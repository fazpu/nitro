package main

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"path"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/cristalhq/jwt/v4"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/BurntSushi/toml"
	"github.com/gorilla/websocket"
)

type Conf struct {
	LogLevel        string
	Address         string
	WebRoot         string
	BaseURL         string
	ClientWebSocket WebSocketConf
	BotWebSocket    WebSocketConf
}

type WebSocketConf struct {
	ReadBufferSize   int
	WriteBufferSize  int
	MaxMessageSize   int64
	MessageQueueSize int
	PingInterval     time.Duration
	PongTimeout      time.Duration
	WriteTimeout     time.Duration
}

var (
	newline = []byte{'\n'}
)

type Creds struct {
	ID     string `json:"id"`
	Secret string `json:"secret"`
}

type Actor struct {
	conn  *websocket.Conn
	sendC chan []byte
	route string
	pool  *WorkerPool
	peer  *Actor
}

func (c *Actor) send(b []byte) bool {
	select {
	case c.sendC <- b:
	default:
		close(c.sendC)
		return false
	}
	return true
}

var (
	msgNoPeer   = []byte(`{"t":"e","e":"no-peer"}`)
	msgPeerDied = []byte(`{"t":"e","e":"peer-died"}`)
)

func (c *Actor) Read(readLimit int64, pongTimeout time.Duration) {
	conn := c.conn
	defer func() {
		conn.Close()
		if c.peer != nil {
			c.peer.conn.Close()
		}
		log.Debug().Str("addr", conn.RemoteAddr().String()).Msg("reader closed")
	}()
	conn.SetReadLimit(readLimit)
	conn.SetReadDeadline(time.Now().Add(pongTimeout))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(pongTimeout))
		return nil
	})
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Error().Str("addr", conn.RemoteAddr().String()).Err(err).Msg("unexpected close")
			}
			return
		}

		if c.peer == nil && c.pool != nil {
			c.pool.Match(c)
		}

		if c.peer == nil {
			c.send(msgNoPeer)
			continue
		}

		if !c.peer.send(message) {
			// peer dead; bail out
			c.send(msgPeerDied)
			return
		}
	}
}

func (c *Actor) Write(writeTimeout, pingInterval time.Duration) {
	conn := c.conn
	ping := time.NewTicker(pingInterval)
	defer func() {
		ping.Stop()
		conn.Close()
		if c.peer != nil {
			c.peer.conn.Close()
		}
		log.Debug().Str("addr", conn.RemoteAddr().String()).Msg("writer closed")
	}()

	for {
		select {
		case message, ok := <-c.sendC:
			conn.SetWriteDeadline(time.Now().Add(writeTimeout))
			if !ok {
				// send channel closed
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := conn.NextWriter(websocket.TextMessage)
			if err != nil {
				log.Error().Err(err).Msg("failed to obtain connection writer")
				return
			}
			w.Write(message)

			// drain
			n := len(c.sendC)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.sendC)
			}

			if err := w.Close(); err != nil {
				log.Error().Err(err).Msg("failed to close connection writer")
				return
			}
		case <-ping.C:
			conn.SetWriteDeadline(time.Now().Add(writeTimeout))
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

type Server struct {
	conf           Conf
	workers        *WorkerPool
	clientUpgrader websocket.Upgrader
	workerUpgrader websocket.Upgrader
	fs             http.Handler
}

type WorkerPool struct {
	sync.Mutex
	workers map[string]map[*Actor]struct{}
}

func newWorkerPool() *WorkerPool {
	return &WorkerPool{
		workers: make(map[string]map[*Actor]struct{}),
	}
}

func (p *WorkerPool) Put(route string, w *Actor) {
	p.Lock()

	workers, ok := p.workers[route]
	if !ok {
		workers = make(map[*Actor]struct{})
		p.workers[route] = workers
	}
	workers[w] = struct{}{}

	p.Unlock()
}

func (p *WorkerPool) Match(caller *Actor) bool {
	p.Lock()
	defer p.Unlock()

	if workers, ok := p.workers[caller.route]; ok {
		for callee := range workers {
			delete(workers, callee)
			callee.peer = caller
			caller.peer = callee
			return true
		}
	}
	return false
}

func (s *Server) hijackBot(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	route := query.Get("r")
	log.Debug().Str("addr", r.RemoteAddr).Str("route", route).Msg("worker joining")

	if route == "" {
		log.Error().Msg("empty route")
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	id, secret, ok := r.BasicAuth()
	if !ok {
		log.Error().Msg("missing basic auth")
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	if id != secret { // XXX check via keychain
		log.Error().Msg("bad id/secret")
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	conf := s.conf.BotWebSocket
	conn, err := s.workerUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error().Err(err).Msg("failed to upgrade bot")
		return
	}
	worker := &Actor{
		conn:  conn,
		sendC: make(chan []byte, conf.MessageQueueSize),
		route: route,
	}

	s.workers.Put(route, worker)

	go worker.Write(conf.WriteTimeout, conf.PingInterval)
	go worker.Read(conf.MaxMessageSize, conf.PongTimeout)

	log.Info().Str("route", route).Str("addr", r.RemoteAddr).Msg("worker joined")
}

func (s *Server) hijackClient(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	route := query.Get("r")
	log.Debug().Str("addr", r.RemoteAddr).Str("route", route).Msg("client joining")

	if route == "" {
		log.Error().Msg("empty route")
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	// XXX authenticate

	conf := s.conf.ClientWebSocket
	conn, err := s.clientUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error().Err(err).Msg("failed to upgrade client")
		return
	}

	client := &Actor{
		conn:  conn,
		sendC: make(chan []byte, conf.MessageQueueSize),
		route: route,
		pool:  s.workers,
	}

	go client.Write(conf.WriteTimeout, conf.PingInterval)
	go client.Read(conf.MaxMessageSize, conf.PongTimeout)

	log.Info().Str("addr", r.RemoteAddr).Msg("client joined")
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	p := strings.TrimPrefix(r.URL.Path, s.conf.BaseURL)

	log.Debug().Str("path", r.URL.Path).Msg("request")

	switch p {
	case "ws/ui":
		s.hijackClient(w, r)
		return

	case "ws/bot":
		s.hijackBot(w, r)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	s.fs.ServeHTTP(w, r)
}

type BotAuthRequest struct {
	Route string `json:"route"`
}

type BotAuthResponse struct {
	// https://www.rfc-editor.org/rfc/rfc6749#section-5.1
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"` // seconds
	RefreshToken string `json:"refresh_token,omitempty"`
	Scope        string `json:"scope,omitempty"` // space-delimited, case-sensitive
}

type KeyCache struct {
	sync.RWMutex
	items   map[string]time.Time
	ttl, gc time.Duration
}

func (c *KeyCache) Has(key string) bool {
	c.RLock()
	defer c.RUnlock()
	t, ok := c.items[key]
	return ok && t.After(time.Now())
}

func (c *KeyCache) Put(key string) {
	c.Lock()
	c.items[key] = time.Now().Add(c.ttl)
	c.Unlock()
}

func (c *KeyCache) Del(key string) {
	c.Lock()
	delete(c.items, key)
	c.Unlock()
}

func newKeyCache(ttl, gc time.Duration) *KeyCache {
	if gc < time.Second {
		gc = time.Second
	}
	return &KeyCache{items: make(map[string]time.Time), ttl: ttl, gc: gc}
}
func (c *KeyCache) GC() {
	ticker := time.NewTicker(c.gc)
	for range ticker.C {
		c.Lock()
		now := time.Now()
		for k, t := range c.items {
			if t.Before(now) {
				delete(c.items, k)
			}
		}
		c.Unlock()
	}
}

type BotClaims struct {
	jwt.RegisteredClaims
	IP    string `json:"ip"`
	Route string `json:"route"`
}

type TokenIssuer struct {
	cache    *KeyCache
	builder  *jwt.Builder
	verifier *jwt.HSAlg
	audience string
	ttl      time.Duration
}

func newTokenIssuer(audience string, ttl time.Duration) (*TokenIssuer, error) {
	key := []byte(`secret`)
	signer, err := jwt.NewSignerHS(jwt.HS256, key)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize JWT signer: %v", err)
	}
	verifier, err := jwt.NewVerifierHS(jwt.HS256, key)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize JWT verifier: %v", err)
	}
	builder := jwt.NewBuilder(signer)
	cache := newKeyCache(ttl, time.Minute)
	return &TokenIssuer{cache, builder, verifier, audience, ttl}, nil
}

func (ti *TokenIssuer) GC() {
	ti.cache.GC()
}

func (ti *TokenIssuer) Issue(subject, ip, route string) (string, error) {
	var token string
	uid, err := uuid.NewRandom()
	if err != nil {
		return token, fmt.Errorf("failed to generate UUID: %v", err)
	}
	id := uid.String()
	ti.cache.Put(id)
	claims := &BotClaims{
		jwt.RegisteredClaims{
			ID:        id,
			Subject:   subject,
			Audience:  jwt.Audience{ti.audience},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ti.ttl)),
		},
		ip,
		route,
	}
	t, err := ti.builder.Build(claims)
	if err != nil {
		return token, fmt.Errorf("failed to build JWT token: %v", err)
	}
	return t.String(), nil
}

var (
	errBadAudience  = errors.New("wrong audience in token")
	errBadIP        = errors.New("wrong IP in token")
	errExpiredToken = errors.New("token expired")
	errReusedToken  = errors.New("token reused")
)

func (ti *TokenIssuer) Verify(b []byte, ip string) (*BotClaims, error) {
	var claims BotClaims
	err := jwt.ParseClaims(b, ti.verifier, &claims)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JWT token: %v", err)
	}

	if !ti.cache.Has(claims.ID) {
		return nil, errReusedToken
	}
	ti.cache.Del(claims.ID) // prevent reuse

	if !claims.IsValidExpiresAt(time.Now()) {
		return nil, errExpiredToken
	}
	if !claims.IsForAudience(ti.audience) {
		return nil, errBadAudience
	}
	if claims.IP != ip {
		return nil, errBadIP
	}

	return &claims, nil
}

func adjustDurations(conf *WebSocketConf) {
	conf.WriteTimeout *= time.Second
	conf.PingInterval *= time.Second
	conf.PongTimeout *= time.Second
}

func parseConf(filename string) (Conf, error) {
	var conf Conf
	if meta, err := toml.DecodeFile(filename, &conf); err != nil {
		return conf, fmt.Errorf("failed to decode configuration file: %v", err)
	} else {
		undecoded := meta.Undecoded()
		if len(undecoded) > 0 {
			return conf, fmt.Errorf("illegal keys found in configuration: %v", undecoded)
		}
	}

	adjustDurations(&conf.ClientWebSocket)
	adjustDurations(&conf.BotWebSocket)

	return conf, nil
}

func newUpgrader(conf WebSocketConf) websocket.Upgrader {
	return websocket.Upgrader{
		ReadBufferSize:  conf.ReadBufferSize,
		WriteBufferSize: conf.WriteBufferSize,
	}
}

func loadIndexPage(baseURL, webRoot string) ([]byte, error) {
	b, err := ioutil.ReadFile(filepath.Join(webRoot, "index.html"))
	if err != nil {
		return nil, fmt.Errorf("failed reading default index.html page: %v", err)
	}

	// embed base url
	html := strings.Replace(string(b), "<body", `<body data-baseurl="`+baseURL+`"`, 1)

	// redirect /foo -> /base/url/foo
	html = strings.ReplaceAll(html, `="/`, `="`+baseURL)

	return []byte(html), nil
}

func newWebServer(baseURL, webRoot string, html []byte) http.Handler {
	fs := http.StripPrefix(baseURL, http.FileServer(http.Dir(webRoot)))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// if the url has an extension, serve the file
		if len(path.Ext(r.URL.Path)) > 0 {
			fs.ServeHTTP(w, r)
			return
		}

		// url has no extension; assume index.html
		header := w.Header()
		header.Add("Content-Type", "text/html; charset=UTF-8")
		header.Add("Cache-Control", "no-cache, must-revalidate")
		header.Add("Pragma", "no-cache")
		w.Write(html)
	})
}

func newServer(conf Conf) (*Server, error) {
	html, err := loadIndexPage(conf.BaseURL, conf.WebRoot)
	if err != nil {
		return nil, err
	}
	clientConf, botConf := conf.ClientWebSocket, conf.BotWebSocket
	return &Server{
		conf,
		newWorkerPool(),
		newUpgrader(clientConf),
		newUpgrader(botConf),
		newWebServer(conf.BaseURL, conf.WebRoot, html),
	}, nil
}

func serve(conf Conf) error {
	server, err := newServer(conf)
	if err != nil {
		return err
	}

	s := &http.Server{
		// TODO TLS config
		Addr:         conf.Address,
		Handler:      server,
		ReadTimeout:  time.Second * 10, // TODO expose
		WriteTimeout: time.Second * 10, // TODO expose
	}

	errC := make(chan error, 1)
	go func() {
		// TODO TLS
		log.Info().Str("address", conf.Address).Msg("listening")
		errC <- s.ListenAndServe()
	}()

	sigC := make(chan os.Signal, 1)
	signal.Notify(sigC, os.Interrupt)

	select {
	case err := <-errC:
		log.Error().Err(err).Msg("failed to listen")
	case sig := <-sigC:
		log.Info().Str("signal", sig.String()).Msg("stopping")
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	return s.Shutdown(ctx)
}

var (
	logLevels = map[string]zerolog.Level{
		zerolog.LevelPanicValue: zerolog.PanicLevel,
		zerolog.LevelFatalValue: zerolog.FatalLevel,
		zerolog.LevelErrorValue: zerolog.ErrorLevel,
		zerolog.LevelWarnValue:  zerolog.WarnLevel,
		zerolog.LevelInfoValue:  zerolog.InfoLevel,
		zerolog.LevelDebugValue: zerolog.DebugLevel,
		zerolog.LevelTraceValue: zerolog.TraceLevel,
	}
)

func toLogLevel(s string) zerolog.Level {
	if level, ok := logLevels[s]; ok {
		return level
	}
	return zerolog.Disabled
}

func configureLogger(logLevel string, pretty bool) {
	zerolog.TimestampFieldName = "t"
	zerolog.LevelFieldName = "l"
	zerolog.MessageFieldName = "m"
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(toLogLevel(logLevel))

	if pretty {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	}
}

func main() {
	conf, err := parseConf("./sidekick.toml") // XXX tie to -conf
	if err != nil {
		panic(err)
	}

	configureLogger(conf.LogLevel, true) // XXX tie to -pretty

	// handle error
	if err := serve(conf); err != nil {
		log.Fatal().Err(err).Msg("failed to run server")
	}
}

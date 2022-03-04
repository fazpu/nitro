from typing import Optional, Tuple, List, Dict, Union, Callable
import msgpack
from enum import IntEnum

from flask import Flask, request
import simple_websocket


class _MsgType(IntEnum):
    Error = 1
    Join = 2
    Leave = 3
    Request = 4
    Response = 5
    Watch = 6
    Event = 7
    Text = 8
    Input = 9
    Abort = 10
    Resume = 11
    Read = 12
    Write = 13
    Append = 14


class _ErrorCode(IntEnum):
    PeerUnavailable = 1
    PeerDead = 2
    RateLimited = 3


class _WidgetT(IntEnum):
    Output = 1
    Input = 2
    Option = 3


_primitive = (bool, int, float, str)
Primitive = Union[bool, int, float, str]


# Objects = Union[Tuple[dict, ...], List[dict]]


class RemoteError(Exception):
    pass


class ProtocolError(Exception):
    pass


def _marshal(d: dict):
    return msgpack.packb(d)


def _unmarshal(b) -> dict:
    return msgpack.unpackb(b)


def _dump(x):  # recursive
    if isinstance(x, (tuple, list)):
        return [_dump(e) for e in x]
    if callable(getattr(x, 'dump', None)):
        return x.dump()
    return x


def _clean(d: dict) -> dict:
    return {k: v for k, v in d.items() if v is not None}


N = Union[int, float]
V = Union[N, str]


class Option:
    def __init__(
            self,
            value: V,
            text: Optional[str] = None,
            icon: Optional[str] = None,
            caption: Optional[str] = None,
            selected: Optional[bool] = None,
            options: Optional['Options'] = None,
    ):
        self.value = value
        self.text = text
        self.icon = icon
        self.caption = caption
        self.selected = selected
        self.options = options

    def dump(self) -> dict:
        d = dict(
            t=_WidgetT.Option,
            value=self.value,
            text=self.text,
            icon=self.icon,
            caption=self.caption,
            selected=self.selected,
            options=self.options,
        )
        return _clean(d)


Options = Union[
    Tuple[Primitive, ...],
    List[Primitive],
    Dict[Primitive, any],
    List[Option],
    Tuple[Option, ...],
]

Item = Union['Input', str]
Items = Union[List[Item], Tuple[Item, ...]]


class Input:
    def __init__(
            self,
            text: Optional[str] = None,
            name: Optional[str] = None,
            mode: Optional[str] = None,
            icon: Optional[str] = None,
            value: Optional[Union[V, Tuple[V, V]]] = None,
            min: Optional[V] = None,
            max: Optional[V] = None,
            step: Optional[N] = None,
            precision: Optional[int] = None,
            range: Optional[Union[Tuple[V, V], Tuple[N, N, N], Tuple[N, N, N, int]]] = None,
            mask: Optional[str] = None,
            prefix: Optional[str] = None,
            suffix: Optional[str] = None,
            placeholder: Optional[str] = None,
            error: Optional[str] = None,
            lines: Optional[int] = None,
            multiple: Optional[bool] = None,
            required: Optional[bool] = None,
            password: Optional[bool] = None,
            editable: Optional[bool] = None,
            options: Optional[Options] = None,
            actions: Optional[Options] = None,
            items: Optional[Items] = None,
            inline: Optional[bool] = None,
            size: Optional[V] = None,
    ):
        self.text = text
        self.name = name
        self.mode = mode
        self.icon = icon
        self.value = value
        self.min = min
        self.max = max
        self.step = step,
        self.precision = precision,
        self.range = range
        self.mask = mask
        self.prefix = prefix
        self.suffix = suffix
        self.placeholder = placeholder
        self.error = error
        self.lines = lines
        self.multiple = multiple
        self.required = required
        self.password = password
        self.editable = editable
        self.options = options
        self.actions = actions
        self.items = items
        self.inline = inline
        self.size = size

    def dump(self) -> dict:
        d = dict(
            t=_WidgetT.Input,
            text=self.text,
            mode=self.mode,
            icon=self.icon,
            value=self.value,
            min=self.min,
            max=self.max,
            step=self.step,
            precision=self.precision,
            range=self.range,
            mask=self.mask,
            prefix=self.prefix,
            suffix=self.suffix,
            placeholder=self.placeholder,
            error=self.error,
            lines=self.lines,
            multiple=self.multiple,
            required=self.required,
            password=self.password,
            editable=self.editable,
            options=_dump(self.options),
            actions=_dump(self.actions),
            items=_dump(self.items),
            inline=self.inline,
            size=self.size,
        )
        return _clean(d)


class UI:
    def __init__(self, send: Callable, recv: Callable):
        self._send = send
        self._recv = recv

    def input(
            self,
            content: Optional[Union[str, Items]] = None,
            name: Optional[str] = None,
            mode: Optional[str] = None,
            icon: Optional[str] = None,
            value: Optional[Union[V, Tuple[V, V]]] = None,
            min: Optional[V] = None,
            max: Optional[V] = None,
            step: Optional[N] = None,
            precision: Optional[int] = None,
            range: Optional[Union[Tuple[V, V], Tuple[N, N, N], Tuple[N, N, N, int]]] = None,
            mask: Optional[str] = None,
            prefix: Optional[str] = None,
            suffix: Optional[str] = None,
            placeholder: Optional[str] = None,
            error: Optional[str] = None,
            lines: Optional[int] = None,
            multiple: Optional[bool] = None,
            required: Optional[bool] = None,
            password: Optional[bool] = None,
            editable: Optional[bool] = None,
            options: Optional[Options] = None,
            actions: Optional[Options] = None,
            inline: Optional[bool] = None,
            size: Optional[V] = None,
    ) -> Input:
        text, items = (None, content) if isinstance(content, (tuple, list)) else (content, None)
        return Input(
            text,
            name,
            mode,
            icon,
            value,
            min,
            max,
            step,
            precision,
            range,
            mask,
            prefix,
            suffix,
            placeholder,
            error,
            lines,
            multiple,
            required,
            password,
            editable,
            options,
            actions,
            items,
            inline,
            size,
        )

    def option(
            self,
            value: V,
            text: Optional[str] = None,
            icon: Optional[str] = None,
            caption: Optional[str] = None,
            selected: Optional[bool] = None,
            options: Optional[Options] = None,
    ) -> Option:
        return Option(
            value,
            text,
            icon,
            caption,
            selected,
            options,
        )

    def _read(self, expected: int):
        msg = _unmarshal(self._recv())
        if isinstance(msg, dict):
            t = msg.get('t')
            if t == _MsgType.Error:
                code = msg.get('c')
                raise RemoteError(f'code {code}')
            if (expected > -1) and t != expected:
                raise ProtocolError(f'unexpected message: want {expected}, got {t}')
            if t == _MsgType.Input:
                d = msg.get('d')
                n = len(d)
                if n == 0:
                    raise ProtocolError('unexpected input: got empty list')
                elif n == 1:
                    return d[0]
                else:
                    return tuple(d)
            if t == _MsgType.Join:
                d = msg.get('d')
                return d
            raise ProtocolError(f'unknown message type {t}')
        raise ProtocolError(f'unknown message format: want dict, got {type(msg)}')

    def _write(self):
        pass

    def write(
            self,
            content: Optional[Union[str, Items]] = None,
            name: Optional[str] = None,
            mode: Optional[str] = None,
            icon: Optional[str] = None,
            value: Optional[Union[V, Tuple[V, V]]] = None,
            min: Optional[V] = None,
            max: Optional[V] = None,
            step: Optional[N] = None,
            precision: Optional[int] = None,
            range: Optional[Union[Tuple[V, V], Tuple[N, N, N], Tuple[N, N, N, int]]] = None,
            mask: Optional[str] = None,
            prefix: Optional[str] = None,
            suffix: Optional[str] = None,
            placeholder: Optional[str] = None,
            error: Optional[str] = None,
            lines: Optional[int] = None,
            multiple: Optional[bool] = None,
            required: Optional[bool] = None,
            password: Optional[bool] = None,
            editable: Optional[bool] = None,
            options: Optional[Options] = None,
            actions: Optional[Options] = None,
            inline: Optional[bool] = None,
            size: Optional[V] = None,
    ):
        i = self.input(
            content,
            name,
            mode,
            icon,
            value,
            min,
            max,
            step,
            precision,
            range,
            mask,
            prefix,
            suffix,
            placeholder,
            error,
            lines,
            multiple,
            required,
            password,
            editable,
            options,
            actions,
            inline,
            size,
        )
        self._send(_marshal(dict(t=_MsgType.Read, d=i.dump())))
        return self._read(_MsgType.Input)

    def update(self, name: str, *args, **kwargs):
        pass

    def prepend(self, *args, **kwargs):
        return self.insert(0, *args, **kwargs)

    def append(self, *args, **kwargs):
        return self.insert(-1, *args, **kwargs)

    def insert(self, index: int, *args, **kwargs):
        pass

    def remove(self, index: int):
        pass


# --- userland ---


def main(ui: UI):
    while True:
        counter = 0
        choice = ui.write([
            f'Count={counter}',
            ui.input(actions=('incr', 'decr')),
        ])
        counter += 1 if choice == 'incr' else -1

        ui.write(ui.input())
        ui.write([ui.input(), '', ''])


app = Flask(__name__, static_folder='../web/build', static_url_path='')


@app.route('/ws/f', websocket=True)
def socket():
    ws = simple_websocket.Server(request.environ)
    ui = UI(ws.send, ws.receive)
    try:
        main(ui)
    except simple_websocket.ConnectionClosed:
        pass
    return ''


if __name__ == '__main__':
    app.run()

// Copyright 2022 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { moveSyntheticComments } from 'typescript';
import { anyD, anyN, B, Dict, Incr, isB, isN, isO, isPair, isS, isV, S, words, xid } from './core';
import { css } from './css';
import { markdown } from './markdown';
import { Box, BoxMode, Header, Option } from './protocol';

const determineMode = (box: Box): BoxMode => {
  const { options, editable, multiple } = box

  if (options.length) {
    if (editable) {
      return 'menu'
    }
    if (multiple) {
      const hasShortLabels = options.some(({ text }) => text && (text.length <= 50))
      if (hasShortLabels && options.length > 7) {
        return 'menu'
      }
      return 'check'
    }

    const hasGroups = options.some(c => c.options?.length ? true : false)
    if (hasGroups) {
      return 'menu'
    }
    if (options.length <= 3) {
      return 'button'
    }
    if (options.length <= 7) {
      return 'radio'
    }
    return 'menu'
  }

  const { value, min, max, step, precision } = box

  if (isPair(value)) {
    const [a, b] = value
    if (isN(a) && isN(b)) {
      return 'range'
    }
  }

  if (anyN(value, min, max, step, precision)) {
    return 'number'
  }

  const { mask, prefix, suffix, placeholder, error, lines, required, password, icon } = box
  if (anyD(value, mask, prefix, suffix, placeholder, error, lines, required, password, icon)) {
    return 'text'
  }

  if (box.text) {
    return 'md'
  }

  if (box.image) {
    return 'image'
  }

  return 'none'
}

const sanitizeRange = (box: Box) => {
  const { range } = box
  if (Array.isArray(range)) {
    switch (range.length) {
      case 2:
        {
          const [x, y] = range
          if ((isN(x) && isN(y)) || (isS(x) && isS(y))) {
            box.min = x
            box.max = y
          }
        }
        break
      case 3:
        {
          const [x, y, z] = range
          // TODO string x, y?
          if (isN(x) && isN(y) && isN(z)) {
            box.min = x
            box.max = y
            box.step = z
          }
        }
        break
      case 4:
        {
          const [x, y, z, p] = range
          // TODO string x, y?
          if (isN(x) && isN(y) && isN(z) && isN(p)) {
            box.min = x
            box.max = y
            box.step = z
            box.precision = p
          }
        }
        break
    }
  }
}

export const sanitizeOptions = (x: any): Option[] => { // recursive
  if (!x) return []
  if (Array.isArray(x)) {
    const c: Option[] = []
    for (const v of x) {
      if (isV(v)) { // value
        c.push({ text: String(v), value: v })
      } else if (isPair(v)) { // [value, text]
        const [value, text] = v
        if (isS(text) && isV(value)) {
          c.push({ text, value })
        } else {
          console.warn('Invalid choice pair. Want [string, value], got ', v)
        }
      } else if (isO(v) && isV(v.value)) { // { value: v }
        if (!v.text) v.text = String(v.value)
        if (v.options) v.options = sanitizeOptions(v.options)
        c.push(v)
      }
    }
    return c
  }
  if (isS(x)) { // 'value1 value2 value3...'
    return words(x).map((value): Option => ({ text: value, value }))
  }
  if (isO(x)) { // { value1: text1, value2: text2, ... }
    const c: Option[] = []
    for (const value in x) {
      const text = x[value]
      c.push({ text, value })
    }
    return c
  }
  console.warn('Invalid choice list. Want string or array or dictionary, got ', x)
  return []
}

const translate = (locale: Dict<S>, s?: S) => {
  if (s && /^@\w+$/.test(s)) {
    const alt = locale[s.substring(1)]
    if (alt) return alt
  }
  return s
}

const localizeBox = (locale: Dict<S>, box: Box) => {
  const { text, title, caption, placeholder, prefix, suffix, hint, help, options, headers } = box
  if (text) box.text = translate(locale, text)
  if (title) box.title = translate(locale, title)
  if (caption) box.caption = translate(locale, caption)
  if (placeholder) box.placeholder = translate(locale, placeholder)
  if (prefix) box.prefix = translate(locale, prefix)
  if (suffix) box.suffix = translate(locale, suffix)
  if (hint) box.hint = translate(locale, hint)
  if (help) box.help = translate(locale, help)
  if (options) for (const option of options) localizeOption(locale, option)
  if (headers) for (const header of headers) localizeHeader(locale, header)
}

const localizeOption = (locale: Dict<S>, option: Option) => {
  const { text, caption, options } = option
  if (text) option.text = translate(locale, text)
  if (caption) option.caption = translate(locale, caption)
  if (options) for (const option of options) localizeOption(locale, option)
}

const localizeHeader = (locale: Dict<S>, header: Header) => {
  const { text } = header
  if (text) header.text = translate(locale, text) ?? ''
}

const prefixStyle = (box: Box, prefix: S | undefined) => {
  if (prefix) box.style = box.style ? prefix + ' ' + box.style : prefix
}

const knownModes = new Set([
  'row', 'col', 'tabs', 'md', 'button', 'menu', 'radio', 'check', 'toggle'
  , 'text', 'range', 'number', 'time', 'date', 'day', 'week', 'month', 'tag', 'color'
  , 'rating', 'table', 'file', 'progress', 'spinner', 'separator', 'image', 'web',
  'info', 'success', 'warning', 'critical', 'blocked', 'error'
])

const readonlyBoxes = [
  'progress',
  'spinner',
  'separator',
  'info',
  'success',
  'warning',
  'critical',
  'blocked',
  'error',
  'image',
  'web',
]

export const sanitizeBox = (locale: Dict<S>, box: Box): Box => {
  if (isS(box)) {
    box = { xid: xid(), index: 0, modes: new Set(['md']), text: box, options: [] }
  } else {
    const mode: any = (box as any).mode
    box.modes = isS(mode) ? new Set(words(mode)) : new Set()
  }

  const { modes } = box

  if (modes.has('column')) modes.add('col') // QOL

  if (box.items) {
    if (modes.has('tabs')) {
      box.items.forEach(box => prefixStyle(box, 'flex flex-col gap-2 my-2'))
    }
    const prefix = modes.has('col')
      ? 'flex flex-col gap-2'
      : modes.has('row')
        ? 'flex flex-row gap-2'
        : undefined
    prefixStyle(box, prefix)
    box.items = box.items.map(b => sanitizeBox(locale, b))
  } else {
    const { value, options } = box
    if (isB(value)) {
      box.value = value ? 1 : 0 // TODO ugly: protocol should accept boolean
      if (!modes.size) modes.add('check')
    }
    box.options = sanitizeOptions(options)
    box.index = 0
    sanitizeRange(box)

    if (!modes.size) modes.add(determineMode(box))

    localizeBox(locale, box)

    if (modes.has('md')) {
      const [md, hasLinks] = markdown(box.text ?? '')
      box.text = md
      if (!hasLinks) box.index = -1 // don't capture
    } else {
      for (const t of readonlyBoxes) if (modes.has(t)) box.index = -1 // don't capture

      if (modes.has('web')) {
        // Set a height if missing, otherwise iframe won't flow.
        // iframe widths are already set to 100% in webview.
        if (!box.height) box.height = '400px'
      }
    }
    if (box.ignore) box.index = -1 // don't capture
  }

  if (box.style) box.style = css(box.style)

  return box
}

export const reIndex = (boxes: Box[], incr: Incr) => {
  for (const box of boxes) {
    if (box.items) {
      reIndex(box.items, incr)
    } else {
      if (box.index >= 0) { // only set for interactive boxes, not containers.
        box.index = incr()
      }
    }
  }
}

export const hasActions = (boxes: Box[]): B => { // recursive
  for (const box of boxes) {
    if (box.halt || box.live) return true
    if (box.items) {
      if (hasActions(box.items)) return true
    } else {
      const { modes } = box
      if (modes.has('button')) {
        if (box.options.length) return true
      } else if (modes.has('md')) {
        if (box.index >= 0) return true
      } else if (modes.has('toggle') || modes.has('progress') || modes.has('spinner')) {
        return true
      } else if (modes.has('table')) {
        if (isB(box.multiple)) return false
        if (box.headers) for (const header of box.headers) if (header.mode === 'link') return true
      }
    }
  }
  return false
}

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

import { BoxProps } from './ui';
import { css } from './css';
import { useEffect, useRef } from 'react';
import { F, S } from './core';

const
  lerp = (f: F, a: F, b: F) => a * (1.0 - f) + (b * f),
  clamp1 = (f: F) => f < 0 ? 0 : f > 1 ? 1 : f,
  clamp1s = (fs: F[]) => fs.map(clamp1),
  makeLineY = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 2) return ''
    const
      dx = w / (n - 1),
      d: Array<S | F> = []
    for (let i = 0; i < n; i++) d.push(i ? 'L' : 'M', dx * i, lerp(ys[i], h, 0))
    return d.join(' ')
  },
  makeLineYFill = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 2) return ''
    const
      dx = w / (n - 1),
      d: Array<S | F> = []
    d.push('M', 0, h)
    for (let i = 0; i < n; i++) d.push('L', dx * i, lerp(ys[i], h, 0))
    d.push('L', w, h)
    d.push('Z')
    return d.join(' ')
  },
  makeStepY = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 1) return ''
    const
      dx = w / n,
      d: Array<S | F> = []
    for (let i = 0; i < n; i++) {
      const y = lerp(ys[i], h, 0)
      if (i) {
        d.push('V', y)
      } else {
        d.push('M', 0, y)
      }
      d.push('h', dx)
    }
    return d.join(' ')
  },
  makeStepYFill = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 1) return ''
    const
      dx = w / n,
      d: Array<S | F> = []
    d.push('M', 0, h)
    for (let i = 0; i < n; i++) {
      d.push('V', lerp(ys[i], h, 0))
      d.push('h', dx)
    }
    d.push('V', w, h)
    d.push('Z')
    return d.join(' ')
  },
  makeBarY = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 1) return ''
    const
      dx = (w / n) - 1, // 1px gap
      d: Array<S | F> = [],
      n1 = n - 1
    d.push('M', 0, h)
    for (let i = 0; i < n; i++) {
      const y = lerp(ys[i], h, 0)
      d.push('V', y)
      d.push('h', dx)
      if (i < n1) {
        d.push('V', h)
        d.push('h', 1) // gap
        d.push('V', y)
      }
    }
    d.push('V', w, h)
    d.push('Z')
    return d.join(' ')
  },
  makeStrokeY = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 1) return ''
    const
      dx = w / n,
      dx2 = dx / 2,
      d: Array<S | F> = []
    for (let i = 0; i < n; i++) {
      d.push('M', dx2 + dx * i, h)
      d.push('V', lerp(ys[i], h, 0))
    }
    return d.join(' ')
  },
  makeTickY = (ys: F[], w: F, h: F) => {
    const n = ys.length
    if (n < 1) return ''
    const
      dx = w / n,
      d: Array<S | F> = []
    for (let i = 0; i < n; i++) {
      d.push('M', dx * i, lerp(ys[i], h, 0))
      d.push('h', dx)
    }
    return d.join(' ')
  }
export const Graphic = ({ context, box }: BoxProps) => {
  const { modes, style, data } = box
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const div = ref.current
    if (div) {
      const
        rect = div.getBoundingClientRect(),
        w = Math.round(rect.width),
        h = Math.round(rect.height),
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.setAttribute('width', `${w}`)
      svg.setAttribute('height', `${h}`)

      if (modes.has('line-y')) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        line.setAttribute('d', makeLineY(clamp1s(data as F[]), w, h));
        line.setAttribute('fill', 'none'); // inherit stroke
        line.setAttribute('stroke-linecap', 'round')
        line.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(line)
        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        area.setAttribute('d', makeLineYFill(clamp1s(data as F[]), w, h));
        area.setAttribute('stroke', 'none'); // inherit fill
        area.setAttribute('stroke-linecap', 'round')
        area.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(area)
      } else if (modes.has('step-y')) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        line.setAttribute('d', makeStepY(clamp1s(data as F[]), w, h));
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke-linecap', 'round')
        line.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(line)
        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        area.setAttribute('d', makeStepYFill(clamp1s(data as F[]), w, h));
        area.setAttribute('stroke', 'none'); // inherit fill
        area.setAttribute('stroke-linecap', 'round')
        area.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(area)
      } else if (modes.has('bar-y')) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', makeBarY(clamp1s(data as F[]), w, h));
        path.setAttribute('stroke', 'none');
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(path)
      } else if (modes.has('stroke-y')) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', makeStrokeY(clamp1s(data as F[]), w, h));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(path)
      } else if (modes.has('tick-y')) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', makeTickY(clamp1s(data as F[]), w, h));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke-linejoin', 'round')
        svg.appendChild(path)
      }

      while (div.firstChild) div.removeChild(div.firstChild)
      div.appendChild(svg)
    }
  })
  return <div ref={ref} className={css(style)} />
}
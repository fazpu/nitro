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

import React from 'react';
import { css } from 'styled-components';
import { B, Dict, S, U } from './core';

type CSS = React.CSSProperties

// Tailwind palette
// https://tailwindcss.com/docs/customizing-colors
export const colorPalette: Dict<S> = {
  transparent: 'transparent',
  white: '#fff',
  black: '#000',
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e3e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',
  'gray-50': '#f9fafb',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
  'zinc-50': '#fafafa',
  'zinc-100': '#f4f4f5',
  'zinc-200': '#e4e4e7',
  'zinc-300': '#d4d4d8',
  'zinc-400': '#a1a1aa',
  'zinc-500': '#71717a',
  'zinc-600': '#52525b',
  'zinc-700': '#3f3f46',
  'zinc-800': '#27272a',
  'zinc-900': '#18181b',
  'neutral-50': '#fafafa',
  'neutral-100': '#f5f5f5',
  'neutral-200': '#e5e5e5',
  'neutral-300': '#d4d4d4',
  'neutral-400': '#a3a3a3',
  'neutral-500': '#737373',
  'neutral-600': '#525252',
  'neutral-700': '#404040',
  'neutral-800': '#262626',
  'neutral-900': '#171717',
  'stone-50': '#fafaf9',
  'stone-100': '#f5f5f4',
  'stone-200': '#e7e5e4',
  'stone-300': '#d6d3d1',
  'stone-400': '#a8a29e',
  'stone-500': '#78716c',
  'stone-600': '#57534e',
  'stone-700': '#44403c',
  'stone-800': '#292524',
  'stone-900': '#1c1917',
  'red-50': '#fef2f2',
  'red-100': '#fee2e2',
  'red-200': '#fecaca',
  'red-300': '#fca5a5',
  'red-400': '#f87171',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',
  'red-800': '#991b1b',
  'red-900': '#7f1d1d',
  'orange-50': '#fff7ed',
  'orange-100': '#ffedd5',
  'orange-200': '#fed7aa',
  'orange-300': '#fdba74',
  'orange-400': '#fb923c',
  'orange-500': '#f97316',
  'orange-600': '#ea580c',
  'orange-700': '#c2410c',
  'orange-800': '#9a3412',
  'orange-900': '#7c2d12',
  'amber-50': '#fffbeb',
  'amber-100': '#fef3c7',
  'amber-200': '#fde68a',
  'amber-300': '#fcd34d',
  'amber-400': '#fbbf24',
  'amber-500': '#f59e0b',
  'amber-600': '#d97706',
  'amber-700': '#b45309',
  'amber-800': '#92400e',
  'amber-900': '#78350f',
  'yellow-50': '#fefce8',
  'yellow-100': '#fef9c3',
  'yellow-200': '#fef08a',
  'yellow-300': '#fde047',
  'yellow-400': '#facc15',
  'yellow-500': '#eab308',
  'yellow-600': '#ca8a04',
  'yellow-700': '#a16207',
  'yellow-800': '#854d0e',
  'yellow-900': '#713f12',
  'lime-50': '#f7fee7',
  'lime-100': '#ecfccb',
  'lime-200': '#d9f99d',
  'lime-300': '#bef264',
  'lime-400': '#a3e635',
  'lime-500': '#84cc16',
  'lime-600': '#65a30d',
  'lime-700': '#4d7c0f',
  'lime-800': '#3f6212',
  'green-50': '#f0fdf4',
  'green-100': '#dcfce7',
  'green-200': '#bbf7d0',
  'green-300': '#86efac',
  'green-400': '#4ade80',
  'green-500': '#22c55e',
  'green-600': '#16a34a',
  'green-700': '#15803d',
  'green-800': '#166534',
  'green-900': '#14532d',
  'emerald-50': '#ecfdf5',
  'emerald-100': '#d1fae5',
  'emerald-200': '#a7f3d0',
  'emerald-300': '#6ee7b7',
  'emerald-400': '#34d399',
  'emerald-500': '#10b981',
  'emerald-600': '#059669',
  'emerald-700': '#047857',
  'emerald-800': '#065f46',
  'emerald-900': '#064e3b',
  'teal-50': '#f0fdfa',
  'teal-100': '#ccfbf1',
  'teal-200': '#99f6e4',
  'teal-300': '#5eead4',
  'teal-400': '#2dd4bf',
  'teal-500': '#14b8a6',
  'teal-600': '#0d9488',
  'teal-700': '#0f766e',
  'teal-800': '#115e59',
  'teal-900': '#134e4a',
  'cyan-50': '#ecfeff',
  'cyan-100': '#cffafe',
  'cyan-200': '#a5f3fc',
  'cyan-300': '#67e8f9',
  'cyan-400': '#22d3ee',
  'cyan-500': '#06b6d4',
  'cyan-600': '#0891b2',
  'cyan-700': '#0e7490',
  'cyan-800': '#155e75',
  'cyan-900': '#164e63',
  'sky-50': '#f0f9ff',
  'sky-100': '#e0f2fe',
  'sky-200': '#bae6fd',
  'sky-300': '#7dd3fc',
  'sky-400': '#38bdf8',
  'sky-500': '#0ea5e9',
  'sky-600': '#0284c7',
  'sky-700': '#0369a1',
  'sky-800': '#075985',
  'sky-900': '#0c4a6e',
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'blue-300': '#93c5fd',
  'blue-400': '#60a5fa',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'blue-800': '#1e40af',
  'blue-900': '#1e3a8a',
  'indigo-50': '#eef2ff',
  'indigo-100': '#e0e7ff',
  'indigo-200': '#c7d2fe',
  'indigo-300': '#a5b4fc',
  'indigo-400': '#818cf8',
  'indigo-500': '#6366f1',
  'indigo-600': '#4f46e5',
  'indigo-700': '#4338ca',
  'indigo-800': '#3730a3',
  'indigo-900': '#312e81',
  'violet-50': '#f5f3ff',
  'violet-100': '#ede9fe',
  'violet-200': '#ddd6fe',
  'violet-300': '#c4b5fd',
  'violet-400': '#a78bfa',
  'violet-500': '#8b5cf6',
  'violet-600': '#7c3aed',
  'violet-700': '#6d28d9',
  'violet-800': '#5b21b6',
  'violet-900': '#4c1d95',
  'purple-50': '#faf5ff',
  'purple-100': '#f3e8ff',
  'purple-200': '#e9d5ff',
  'purple-300': '#d8b4fe',
  'purple-400': '#c084fc',
  'purple-500': '#a855f7',
  'purple-600': '#9333ea',
  'purple-700': '#7e22ce',
  'purple-800': '#6b21a8',
  'purple-900': '#581c87',
  'fuchsia-50': '#fdf4ff',
  'fuchsia-100': '#fae8ff',
  'fuchsia-200': '#f5d0fe',
  'fuchsia-300': '#f0abfc',
  'fuchsia-400': '#e879f9',
  'fuchsia-500': '#d946ef',
  'fuchsia-600': '#c026d3',
  'fuchsia-700': '#a21caf',
  'fuchsia-800': '#86198f',
  'fuchsia-900': '#701a75',
  'pink-50': '#fdf2f8',
  'pink-100': '#fce7f3',
  'pink-200': '#fbcfe8',
  'pink-300': '#f9a8d4',
  'pink-400': '#f472b6',
  'pink-500': '#ec4899',
  'pink-600': '#db2777',
  'pink-700': '#be185d',
  'pink-800': '#9d174d',
  'pink-900': '#831843',
  'rose-50': '#fff1f2',
  'rose-100': '#ffe4e6',
  'rose-200': '#fecdd3',
  'rose-300': '#fda4af',
  'rose-400': '#fb7185',
  'rose-500': '#f43f5e',
  'rose-600': '#e11d48',
  'rose-700': '#be123c',
  'rose-800': '#9f1239',
  'rose-900': '#881337',
}

// Tailwind size scale
export const sizeScale: Dict<U> = {
  '0': 0,
  'px': 1,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
  '36': 144,
  '40': 160,
  '44': 176,
  '48': 192,
  '52': 208,
  '56': 224,
  '60': 240,
  '64': 256,
  '72': 288,
  '80': 320,
  '96': 384,
}

const miscSizings: Dict<S> = {
  auto: 'auto',
  full: '100%',
  screen: '100vw',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
}

const textAlignments = ['left', 'center', 'right', 'justify', 'start', 'end']
type Match = (s: S) => any
type Apply = (css: CSS, value: any) => void
type Handler = [Match, Apply]

const
  matchValue = (k: S) => (v: S) => { if (k === v) return v },
  matchEmpty = matchValue(''),
  matchSet = (xs: any[]) => {
    const set = new Set(xs)
    return (v: S) => { if (set.has(v)) return v }
  },
  matchDict = (dict: Dict<S | U>) => (k: S) => { if (k in dict) return dict[k] },
  matchPercent = (s: S) => {
    if (/^\d+\/\d+$/.test(s)) {
      const
        [x, y] = s.split('/'),
        p = 100 * parseInt(x) / parseInt(y)
      return (Number.isInteger(p) ? p : p.toFixed(6)) + '%'
    }
  },
  matchOne = (...matchers: Match[]) => (s: S) => {
    for (const m of matchers) {
      const v = m(s)
      if (v !== undefined) return v
    }
  },
  matchSizeScale = matchDict(sizeScale),
  matchAuto = matchValue('auto'),
  matchSizeOrAuto = matchOne(matchAuto, matchSizeScale),
  matchSize = matchOne(matchSizeScale, matchDict(miscSizings), matchPercent),
  matchInheritOrColor = matchOne(matchValue('inherit'), matchDict(colorPalette)),
  match0248 = matchDict({ '0': 0, '2': 2, '4': 4, '8': 8 })


const handlers: Dict<Handler[]> = {
  p: [[matchSizeScale, (css, v) => css.padding = v]],
  px: [[matchSizeScale, (css, v) => { css.paddingLeft = v; css.paddingRight = v }]],
  py: [[matchSizeScale, (css, v) => { css.paddingTop = v; css.paddingBottom = v }]],
  pt: [[matchSizeScale, (css, v) => css.paddingTop = v]],
  pr: [[matchSizeScale, (css, v) => css.paddingRight = v]],
  pb: [[matchSizeScale, (css, v) => css.paddingBottom = v]],
  pl: [[matchSizeScale, (css, v) => css.paddingLeft = v]],
  m: [[matchSizeOrAuto, (css, v) => css.margin = v]],
  mx: [[matchSizeOrAuto, (css, v) => { css.marginLeft = v; css.marginRight = v }]],
  my: [[matchSizeOrAuto, (css, v) => { css.marginTop = v; css.marginBottom = v }]],
  mt: [[matchSizeOrAuto, (css, v) => css.marginTop = v]],
  mr: [[matchSizeOrAuto, (css, v) => css.marginRight = v]],
  mb: [[matchSizeOrAuto, (css, v) => css.marginBottom = v]],
  ml: [[matchSizeOrAuto, (css, v) => css.marginLeft = v]],
  w: [[matchSize, (css, v) => css.width = v]],
  h: [[matchSize, (css, v) => css.height = v]],
  text: [
    [matchSet(textAlignments), (css, v) => css.textAlign = v],
    [matchInheritOrColor, (css, v) => css.color = v],
  ],
  bg: [
    [matchInheritOrColor, (css, v) => css.backgroundColor = v],
  ],
  border: [
    [matchEmpty, (css) => css.borderWidth = 1],
    [match0248, (css, v) => css.borderWidth = v],
  ],
  'border-x': [
    [matchEmpty, (css) => { css.borderLeftWidth = 1, css.borderRightWidth = 1 }],
    [match0248, (css, v) => { css.borderLeftWidth = v; css.borderRightWidth = v }],
  ],
  'border-y': [
    [matchEmpty, (css) => { css.borderTopWidth = 1, css.borderBottomWidth = 1 }],
    [match0248, (css, v) => { css.borderTopWidth = v; css.borderBottomWidth = v }],
  ],
  'border-t': [
    [matchEmpty, (css) => css.borderTopWidth = 1],
    [match0248, (css, v) => css.borderTopWidth = v],
  ],
  'border-r': [
    [matchEmpty, (css) => css.borderRightWidth = 1],
    [match0248, (css, v) => css.borderRightWidth = v],
  ],
  'border-b': [
    [matchEmpty, (css) => css.borderBottomWidth = 1],
    [match0248, (css, v) => css.borderBottomWidth = v],
  ],
  'border-l': [
    [matchEmpty, (css) => css.borderLeftWidth = 1],
    [match0248, (css, v) => css.borderLeftWidth = v],
  ],
}

const tryApply = (css: CSS, handles: Handler[], arg: S): B => {
  if (!handles) return false
  for (const [match, apply] of handles) {
    const v = match(arg)
    if (v !== undefined) {
      apply(css, v)
      return true
    }
  }
  return false
}

export const stylize = (css: CSS, spec: S) => {
  const styles = spec.split(/\s+/g)
  for (const s of styles) {
    if (tryApply(css, handlers[s], '')) continue
    let
      pos = s.indexOf('-'),
      matched = false
    while (pos >= 0 && pos < s.length) {
      const handles = handlers[s.substring(0, pos)]
      if (tryApply(css, handles, s.substring(pos + 1))) {
        matched = true
        break
      }
      pos = s.indexOf('-', pos + 1)
    }
    if (!matched) console.warn(`Unknown style: "${s}"`)
  }
}

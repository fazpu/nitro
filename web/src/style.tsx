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
import { B, Dict, S, U } from './core';

type CSS = React.CSSProperties

// Tailwind palette
// https://tailwindcss.com/docs/customizing-colors
const colorPalette: Dict<S> = {
  inherit: 'inherit',
  current: 'currentColor',
  transparent: 'transparent',
  white: '#fff',
  black: '#000',
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
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
  'lime-900': '#365314',
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

const cursors: S[] = [
  'auto',
  'default',
  'pointer',
  'wait',
  'text',
  'move',
  'help',
  'not-allowed',
  'none',
  'context-menu',
  'progress',
  'cell',
  'crosshair',
  'vertical-text',
  'alias',
  'copy',
  'no-drop',
  'grab',
  'grabbing',
  'all-scroll',
  'col-resize',
  'row-resize',
  'n-resize',
  'e-resize',
  's-resize',
  'w-resize',
  'ne-resize',
  'nw-resize',
  'se-resize',
  'sw-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'zoom-in',
  'zoom-out',
]

// Tailwind size scale
const sizeScale: Dict<U> = {
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

const ratioPercents: Dict<S> = {
  full: '100%',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
}

const ratioPercentsSubset: Dict<S> = {
  full: '100%',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
}

const miscSizings: Dict<S> = {
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
}

const corners: Dict<U> = {
  none: 0,
  sm: 2,
  '': 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
}

const maxW: Dict<any> = {
  '0': 0,
  'none': 'none',
  'xs': 320,
  'sm': 384,
  'md': 448,
  'lg': 512,
  'xl': 576,
  '2xl': 672,
  '3xl': 768,
  '4xl': 896,
  '5xl': 1024,
  '6xl': 1152,
  '7xl': 1280,
  'full': '100%',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'prose': '65ch',
  'screen-sm': 640,
  'screen-md': 768,
  'screen-lg': 1024,
  'screen-xl': 1280,
  'screen-2xl': 1536,
}

const boxShadows: Dict<S> = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
}

const scaleTransforms: Dict<S> = {
  '0': '0',
  '50': '.5',
  '75': '.75',
  '90': '.9',
  '95': '.95',
  '100': '1',
  '105': '1.05',
  '110': '1.1',
  '125': '1.25',
  '150': '1.5',
}

type Match = (s: S) => any
type Apply = (css: CSS, value: any) => void
type Handler = [Match, Apply]

const willChangeMap: Dict<S> = {
  auto: 'auto',
  scroll: 'scroll-position',
  contents: 'contents',
  transform: 'transform',
}

const
  eq1 = (k: S) => (x: S) => { if (x === k) return x },
  map1 = (find: S, replace: any) => (x: S) => { if (x === find) return replace },
  map = (dict: Dict<S | U>) => (x: S) => { if (x in dict) return dict[x] },
  eq = (...xs: S[]) => {
    const set = new Set(xs)
    return (x: S) => { if (set.has(x)) return x }
  },
  or = (...matchers: Match[]) => (x: S) => {
    for (const m of matchers) {
      const v = m(x)
      if (v !== undefined) return v
    }
  },
  auto = eq1('auto'),
  isSize = map(sizeScale),
  isAutoOrSize = or(auto, isSize),
  matchSize = or(isSize, auto, map(miscSizings), map(ratioPercents)),
  isRatioSubset = map(ratioPercentsSubset),
  isColor = map(colorPalette),
  is0248 = map({ '': 1, '0': 0, '2': 2, '4': 4, '8': 8 }),
  isCorner = map(corners),
  isDuration = eq('75', '100', '150', '200', '300', '500', '700', '1000'),
  easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter = (f: S) => (css: CSS, v: any) => css.backdropFilter = `${f}(${v})`,
  filter = (f: S) => (css: CSS, v: any) => css.filter = `${f}(${v})`,
  transformU = (u: S) => (f: S) => (css: CSS, v: S) => {
    const t = `${f}(${v}${u})`
    if (css.transform) {
      css.transform += ' ' + t
    } else {
      css.transform = t
    }
  },
  transform = transformU(''),
  transformDeg = transformU('deg'),
  transformPx = transformU('px'),
  isBlur = map({
    'none': '0',
    'sm': '4px',
    '': '8px',
    'md': '12px',
    'lg': '16px',
    'xl': '24px',
    '2xl': '40px',
    '3xl': '64px',
  }),
  isBrightness = map({
    '0': '0',
    '50': '.5',
    '75': '.75',
    '90': '.9',
    '95': '.95',
    '100': '1',
    '105': '1.05',
    '110': '1.1',
    '125': '1.25',
    '150': '1.5',
    '200': '2',
  }),
  isContrast = map({
    '0': '0',
    '50': '.5',
    '75': '.75',
    '100': '1',
    '125': '1.25',
    '150': '1.5',
    '200': '2',
  }),
  isGrayscale = map({
    '0': '0',
    '': '100%',
  }),
  isHueRotate = map({
    '0': '0deg',
    '15': '15deg',
    '30': '30deg',
    '60': '60deg',
    '90': '90deg',
    '180': '180deg',
  }),
  isInvert = map({
    '0': '0',
    '': '100%',
  }),
  isOpacity = map({
    '0': '0',
    '5': '0.05',
    '10': '0.1',
    '20': '0.2',
    '25': '0.25',
    '30': '0.3',
    '40': '0.4',
    '50': '0.5',
    '60': '0.6',
    '70': '0.7',
    '75': '0.75',
    '80': '0.8',
    '90': '0.9',
    '95': '0.95',
    '100': '1',
  }),
  isSaturate = map({
    '0': '0',
    '50': '.5',
    '100': '1',
    '150': '1.5',
    '200': '2',
  }),
  isSepia = map({
    '0': '0',
    '': '100%',
  })


const handlers: Dict<Handler[]> = {
  p: [[isSize, (css, v) => css.padding = v]],
  px: [[isSize, (css, v) => { css.paddingLeft = v; css.paddingRight = v }]],
  py: [[isSize, (css, v) => { css.paddingTop = v; css.paddingBottom = v }]],
  pt: [[isSize, (css, v) => css.paddingTop = v]],
  pr: [[isSize, (css, v) => css.paddingRight = v]],
  pb: [[isSize, (css, v) => css.paddingBottom = v]],
  pl: [[isSize, (css, v) => css.paddingLeft = v]],
  m: [[isAutoOrSize, (css, v) => css.margin = v]],
  mx: [[isAutoOrSize, (css, v) => { css.marginLeft = v; css.marginRight = v }]],
  my: [[isAutoOrSize, (css, v) => { css.marginTop = v; css.marginBottom = v }]],
  mt: [[isAutoOrSize, (css, v) => css.marginTop = v]],
  mr: [[isAutoOrSize, (css, v) => css.marginRight = v]],
  mb: [[isAutoOrSize, (css, v) => css.marginBottom = v]],
  ml: [[isAutoOrSize, (css, v) => css.marginLeft = v]],
  w: [[or(matchSize, map1('screen', '100vw')), (css, v) => css.width = v]],
  'min-w': [[or(map1('0', 0), map(miscSizings)), (css, v) => css.minWidth = v]],
  'max-w': [[or(map(maxW), map(miscSizings)), (css, v) => css.maxWidth = v]],
  h: [[or(matchSize, map1('screen', '100vh')), (css, v) => css.height = v]],
  'min-h': [[or(map1('0', 0), map(miscSizings), map1('screen', '100vh')), (css, v) => css.minHeight = v]],
  'max-h': [[or(matchSize, map(miscSizings), map1('screen', '100vh')), (css, v) => css.maxHeight = v]],
  text: [
    [eq('left', 'center', 'right', 'justify', 'start', 'end'), (css, v) => css.textAlign = v],
    [isColor, (css, v) => css.color = v],
  ],
  bg: [
    [isColor, (css, v) => css.backgroundColor = v],
  ],
  border: [
    [is0248, (css, v) => css.borderWidth = v],
    [eq('solid', 'dashed', 'dotted', 'double', 'hidden', 'none'), (css, v) => css.borderStyle = v],
    [isColor, (css, v) => css.borderColor = v],
  ],
  'border-x': [
    [is0248, (css, v) => { css.borderLeftWidth = v; css.borderRightWidth = v }],
    [isColor, (css, v) => { css.borderLeftColor = v; css.borderRightColor = v }],
  ],
  'border-y': [
    [is0248, (css, v) => { css.borderTopWidth = v; css.borderBottomWidth = v }],
    [isColor, (css, v) => { css.borderTopColor = v; css.borderBottomColor = v }],
  ],
  'border-t': [
    [is0248, (css, v) => css.borderTopWidth = v],
    [isColor, (css, v) => css.borderTopColor = v],
  ],
  'border-r': [
    [is0248, (css, v) => css.borderRightWidth = v],
    [isColor, (css, v) => css.borderRightColor = v],
  ],
  'border-b': [
    [is0248, (css, v) => css.borderBottomWidth = v],
    [isColor, (css, v) => css.borderBottomColor = v],
  ],
  'border-l': [
    [is0248, (css, v) => css.borderLeftWidth = v],
    [isColor, (css, v) => css.borderLeftColor = v],
  ],
  rounded: [[isCorner, (css, v) => css.borderRadius = v]],
  'rounded-t': [[isCorner, (css, v) => { css.borderTopLeftRadius = v; css.borderTopRightRadius = v }]],
  'rounded-r': [[isCorner, (css, v) => { css.borderTopRightRadius = v; css.borderBottomRightRadius = v }]],
  'rounded-b': [[isCorner, (css, v) => { css.borderBottomLeftRadius = v; css.borderBottomRightRadius = v }]],
  'rounded-l': [[isCorner, (css, v) => { css.borderTopLeftRadius = v; css.borderBottomLeftRadius = v }]],
  'rounded-tr': [[isCorner, (css, v) => css.borderTopRightRadius = v]],
  'rounded-tl': [[isCorner, (css, v) => css.borderTopLeftRadius = v]],
  'rounded-br': [[isCorner, (css, v) => css.borderBottomRightRadius = v]],
  'rounded-bl': [[isCorner, (css, v) => css.borderBottomLeftRadius = v]],

  'blur': [[isBlur, filter('blur')]],
  'brightness': [[isBrightness, filter('brightness')]],
  'contrast': [[isContrast, filter('contrast')]],
  'drop-shadow': [[map({
    'sm': 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
    '': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
    'md': 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    'lg': 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    'xl': 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
    '2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
    'none': 'drop-shadow(0 0 #0000)',
  }), (css, v) => css.filter = v]],
  'grayscale': [[isGrayscale, filter('grayscale')]],
  'hue-rotate': [[isHueRotate, filter('hue-rotate')]],
  'invert': [[isInvert, filter('invert')]],
  'opacity': [[isOpacity, filter('opacity')]],
  'saturate': [[isSaturate, filter('saturate')]],
  'sepia': [[isSepia, filter('sepia')]],

  'backdrop-blur': [[isBlur, backdropFilter('blur')]],
  'backdrop-brightness': [[isBrightness, backdropFilter('brightness')]],
  'backdrop-contrast': [[isContrast, backdropFilter('contrast')]],
  'backdrop-grayscale': [[isGrayscale, backdropFilter('grayscale')]],
  'backdrop-hue-rotate': [[isHueRotate, backdropFilter('hue-rotate')]],
  'backdrop-invert': [[isInvert, backdropFilter('invert')]],
  'backdrop-opacity': [[isOpacity, backdropFilter('opacity')]],
  'backdrop-saturate': [[isSaturate, backdropFilter('saturate')]],
  'backdrop-sepia': [[isSepia, backdropFilter('sepia')]],

  duration: [[isDuration, (css, v) => css.transitionDuration = v + 'ms']],
  transition: [
    [eq1('none'), (css, s) => css.transitionProperty = s],
    [or(eq('all', 'opacity', 'transform'), map({
      '': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      'shadow': 'box-shadow',
    })), (css, s) => {
      css.transitionProperty = s;
      css.transitionTimingFunction = easeInOut;
      css.transitionDuration = '150ms';
    }],
  ],
  ease: [[map({
    'linear': 'linear',
    'in': 'cubic-bezier(0.4, 0, 1, 1)',
    'out': 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': easeInOut,
  }), (css, v) => css.transitionTimingFunction = v]],
  delay: [[isDuration, (css, v) => css.transitionDelay = v + 'ms']],
  animate: [[map({
    'none': 'none',
    'spin': 'spin 1s linear infinite',
    'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'bounce': 'bounce 1s infinite',
  }), (css, v) => css.animation = v]],
  'scale': [[map(scaleTransforms), transform('scale')]],
  'scale-x': [[map(scaleTransforms), transform('scaleX')]],
  'scale-y': [[map(scaleTransforms), transform('scaleY')]],
  'rotate': [[eq('0', '1', '2', '3', '6', '12', '45', '90', '180'), transformDeg('rotate')]],
  'translate-x': [
    [isSize, transformPx('translateX')],
    [isRatioSubset, transform('translateX')],
  ],
  'translate-y': [
    [isSize, transformPx('translateY')],
    [isRatioSubset, transform('translateY')],
  ],
  'skew-x': [[eq('0', '1', '2', '3', '6', '12'), transformDeg('skewX')]],
  'skew-y': [[eq('0', '1', '2', '3', '6', '12'), transformDeg('skewY')]],
  origin: [[map({
    'center': 'center',
    'top': 'top',
    'top-right': 'top right',
    'right': 'right',
    'bottom-right': 'bottom right',
    'bottom': 'bottom',
    'bottom-left': 'bottom left',
    'left': 'left',
    'top-left': 'top left',
  }), (css, v) => css.transformOrigin = v]],
  accent: [[or(isColor, eq1('auto')), (css, v) => css.accentColor = v]],
  appearance: [[eq1('none'), (css, v) => css.appearance = v]],
  cursor: [[eq(...cursors), (css, v) => css.cursor = v]],
  caret: [[isColor, (css, v) => css.caretColor = v]],
  'pointer-events': [[eq('none', 'auto'), (css, v) => css.pointerEvents = v]],
  resize: [[map({ none: 'none', x: 'horizontal', y: 'vertical', '': 'both' }), (css, v) => css.resize = v]],
  scroll: [[eq('auto', 'smooth'), (css, v) => css.scrollBehavior = v]],
  'scroll-m': [[isSize, (css, v) => css.scrollMargin = v]],
  'scroll-mx': [[isSize, (css, v) => { css.scrollMarginLeft = v; css.scrollMarginRight = v }]],
  'scroll-my': [[isSize, (css, v) => { css.scrollMarginTop = v; css.scrollMarginBottom = v }]],
  'scroll-mt': [[isSize, (css, v) => css.scrollMarginTop = v]],
  'scroll-mr': [[isSize, (css, v) => css.scrollMarginRight = v]],
  'scroll-mb': [[isSize, (css, v) => css.scrollMarginBottom = v]],
  'scroll-ml': [[isSize, (css, v) => css.scrollMarginLeft = v]],
  'scroll-p': [[isSize, (css, v) => css.scrollPadding = v]],
  'scroll-px': [[isSize, (css, v) => { css.scrollPaddingLeft = v; css.scrollPaddingRight = v }]],
  'scroll-py': [[isSize, (css, v) => { css.scrollPaddingTop = v; css.scrollPaddingBottom = v }]],
  'scroll-pt': [[isSize, (css, v) => css.scrollPaddingTop = v]],
  'scroll-pr': [[isSize, (css, v) => css.scrollPaddingRight = v]],
  'scroll-pb': [[isSize, (css, v) => css.scrollPaddingBottom = v]],
  'scroll-pl': [[isSize, (css, v) => css.scrollPaddingLeft = v]],
  snap: [
    [eq1('none'), (css, v) => css.scrollSnapType = v],
    [map({
      start: 'start',
      end: 'end',
      center: 'center',
      'align-none': 'none',
    }), (css, v) => css.scrollSnapAlign = v],
    [eq('normal', 'always'), (css, v) => css.scrollSnapStop = v]
  ],
  shadow: [[map(boxShadows), (css, v) => css.boxShadow = v]],
  touch: [[eq('auto', 'none', 'pan-x', 'pan-left', 'pan-right', 'pan-y', 'pan-up', 'pan-down', 'pinch-zoom', 'manipulation'), (css, v) => css.touchAction = v]],
  select: [[eq('none', 'text', 'all', 'auto'), (css, v) => css.userSelect = v]],
  'will-change': [[map(willChangeMap), (css, v) => css.willChange = v]],
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

const applyStyle = (css: CSS, s: S): B => {
  if (tryApply(css, handlers[s], '')) return true
  let pos = s.indexOf('-')
  while (pos >= 0 && pos < s.length) {
    const handles = handlers[s.substring(0, pos)]
    if (tryApply(css, handles, s.substring(pos + 1))) return true
    pos = s.indexOf('-', pos + 1)
  }
  return false
}

export const stylize = (css: CSS, spec: S) => {
  const styles = spec.split(/\s+/g)
  // for (const s of styles) if (!applyStyle(css, s)) console.warn(`Unknown style: "${s}"`)
  for (const s of styles) applyStyle(css, s)
}

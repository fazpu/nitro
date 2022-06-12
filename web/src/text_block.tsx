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
import { BoxProps, make } from './ui';

export const TextBlock = make(({ box }: BoxProps) => {
  const
    ref = React.createRef<HTMLDivElement>(),
    update = () => {
      const { context, index } = box
      if (index < 0) return

      const el = ref.current
      if (!el) return

      el.querySelectorAll<HTMLAnchorElement>('a[data-jump]').forEach(link => {
        const value = link.getAttribute('data-jump')
        if (value) {
          link.onclick = e => {
            context.record(value)
            context.commit()
            e.preventDefault()
          }
        }
      })
    },
    render = () => {
      return <div className='md' ref={ref} dangerouslySetInnerHTML={{ __html: box.text ?? '' }} />
    }
  return { init: update, update, render }
})
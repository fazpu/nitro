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

import { ChoiceGroup as FChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import React from 'react';
import { isB } from './core';
import { selectedOf } from './options';
import { BoxProps, make } from './ui';

export const ChoiceGroup = make(({ box }: BoxProps) => {
  const
    { context, text, placeholder, required, options } = box,
    hasNoPrimary = options.every(o => !isB(o.selected)),
    selected = selectedOf(box),
    items: IChoiceGroupOption[] = options.map(({ value, text, icon: iconName }) => ({
      key: String(value),
      text: String(text),
      iconProps: iconName ? { iconName } : undefined,
    })),
    selectedKey = selected ? selected.value : (hasNoPrimary && options.length > 0) ? options[0].value : undefined,
    onChange = (_?: React.FormEvent<HTMLElement>, option?: IChoiceGroupOption) => {
      if (option) context.capture(option?.key)
    },
    render = () => {
      return (
        <FChoiceGroup
          label={text}
          placeholder={placeholder}
          options={items}
          defaultSelectedKey={selectedKey}
          required={required ? true : false}
          onChange={onChange}
        />
      )
    }

  if (selectedKey) context.capture(selectedKey)

  return { render }
})

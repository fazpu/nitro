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

import { CommandBar, ContextualMenu } from '@fluentui/react';
import { GlobalNavButtonActiveIcon, GlobalNavButtonIcon, RocketIcon } from '@fluentui/react-icons-mdl2';
import React from 'react';
import { Client } from './client';
import { signal } from './core';
import { css } from './css';
import { toContextualMenuItem } from './options';
import { Option } from './protocol';
import { make } from './ui';

const Menu = make(({ client, options }: { client: Client, options: Option[] }) => {
  const
    hasMenu = options.length > 0,
    items = options.map(o => toContextualMenuItem(o, client.jump)),
    containerRef = React.createRef<HTMLDivElement>(),
    showMenuB = signal(false),
    showMenu = () => showMenuB(true),
    hideMenu = () => showMenuB(false),
    render = () => {
      const isMenuVisible = showMenuB()
      return (
        <div ref={containerRef} className={css('flex items-center cursor-pointer w-6 h-6')} onClick={showMenu}>
          {
            hasMenu
              ? isMenuVisible
                ? <GlobalNavButtonActiveIcon />
                : <GlobalNavButtonIcon />
              : <RocketIcon />
          }
          <ContextualMenu
            items={items}
            hidden={!isMenuVisible}
            target={containerRef}
            onItemClick={hideMenu}
            onDismiss={hideMenu}
          />
        </div>
      )
    }
  return { render, showMenuB }
})

const NavBar = make(({ client, options }: { client: Client, options: Option[] }) => {
  const
    items = options.map(o => toContextualMenuItem(o, client.jump)),
    render = () => (
      <div className={css('flex grow justify-end')}>
        <CommandBar items={items} />
      </div>
    )
  return { render }
})

export const Header = make(({ client }: { client: Client }) => {
  const
    render = () => {
      const
        title = client.titleB(),
        caption = client.captionB(),
        menu = client.menuB() ?? [],
        nav = client.navB() ?? []

      return (
        <div className={css('flex flex-row mt-4 mb-6 gap-2 items-center')}>
          <Menu client={client} options={menu} />
          <div className={css('text-sm font-extrabold tracking-wider uppercase')}>{title}</div>
          <div className={css('text-sm')}>{caption}</div>
          <NavBar client={client} options={nav} />
        </div>
      )
    }
  return { render }
})

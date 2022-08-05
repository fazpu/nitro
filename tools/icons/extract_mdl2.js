// Copyright 2020 H2O.ai, Inc.
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

//
// This script scans index.d.ts in the react-icons-mdl2 package and generates icons.tsx.
// 
// The default icon package that ships with Fluent contains Microsoft-proprietary 
// brand icons that are not licensed for use on non-Office sites.
// 
// The react-icons-mdl2 package does not contain branded icons as of this writing.
//
// Source: https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
// "An SVG-based version of Fluent UI's icon set is available from @fluentui/react-icons-mdl2 and 
// is released under the MIT license. This is the same MDL2 icon set used in the font icons, 
// excluding any branded icons."

const
  fs = require('fs'),
  codePath = 'web/src/icons.tsx',
  libPath = 'web/node_modules/@fluentui/react-icons-mdl2/lib/index.d.ts',
  libCode = fs.readFileSync(libPath, { encoding: 'utf8' }),
  icons = [...libCode.matchAll(/default as ([A-Z]\w+)Icon/g)].map(m => m[1]),
  importing = icons.map(x => `  ${x}Icon,`),
  listing = icons.map(x => `  ${x}: <${x}Icon />,`),
  code = [
    'import {',
    importing.join('\n'),
    "} from '@fluentui/react-icons-mdl2'",
    "import React from 'react'",
    "import { Dict } from './core'",
    '',
    'export const icons: Dict<React.ReactElement> = {',
    listing.join('\n'),
    '}',
    ''
  ].join('\n')

fs.writeFileSync(codePath, code, { encoding: 'utf8' })

console.log(`Success! ${icons.length} icons written to ${codePath}`)

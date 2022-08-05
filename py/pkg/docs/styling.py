# Copyright 2022 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from h2o_nitro import View, box, row, col, option, lorem


# # Styling
# Change how boxes look: colors, borders, sizing, margins, and padding.

# ## Tag
def styling_tag(view: View):
    view(
        row(
            box('Info',
                style='border text-sky-500 border-current uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Info',
                style='border text-white border-sky-500 bg-sky-500 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Info',
                style='border text-sky-500 border-sky-500 bg-sky-100 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
        ),
        row(
            box('Warning',
                style='border text-amber-500 border-current uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Warning',
                style='border text-white border-amber-500 bg-amber-500 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Warning',
                style='border text-amber-500 border-amber-500 bg-amber-100 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
        ),
        row(
            box('Success',
                style='border text-green-500 border-current uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Success',
                style='border text-white border-green-500 bg-green-500 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Success',
                style='border text-green-500 border-green-500 bg-green-100 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
        ),
        row(
            box('Critical',
                style='border text-red-500 border-current uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Critical',
                style='border text-white border-red-500 bg-red-500 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
            box('Critical',
                style='border text-red-500 border-red-500 bg-red-100 uppercase px-5 py-1.5 rounded-full text-xs tracking-wide'),
        ),
    )


# ## Persona
def styling_persona(view: View):
    view(
        row(
            box(image='sample.jpg', style='object-cover w-6 h-6 rounded-full'),
            box('Boaty McBoatface', style='text-xs font-medium'),
            style='items-center bg-gray-100 pl-2 pr-3 py-1.5 rounded-full',
        ),
        row(
            box('Boaty McBoatface', style='text-xs font-medium'),
            box(image='sample.jpg', style='object-cover w-6 h-6 rounded-full'),
            style='items-center bg-gray-100 pr-2 pl-3 py-1.5 rounded-full',
        ),
    )

    )

    text = lorem(3)
    view(
    )

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


# # Spinner
# Use a spinner to indicate that a long-running operation is in progress,
# and it's unsure how long it will take to complete.

# ## Basic
# Call `box()` with `mode='spinner'` to show a spinner.
def spinner_basic(view: View):  # height 2
    view(box('Reticulating splines...', mode='spinner'))


# ## Set alignment
# Add `text-left`, `text-right`, `text-top` or `text-bottom` to the `mode` to align the text
# to the `left`, `right`, `top`, or `bottom` of the spinner.
def spinner_align(view: View):  # height 7
    view(
        col(
            'Default:',
            box('Reticulating splines...', mode='spinner'),
            'Left:',
            box('Reticulating splines...', mode='spinner text-left'),
            'Top:',
            box('Reticulating splines...', mode='spinner text-top'),
            'Right:',
            box('Reticulating splines...', mode='spinner text-right'),
            'Bottom:',
            box('Reticulating splines...', mode='spinner text-bottom'),
        )
    )


# ## Remove text
# To display a spinner without text, don't pass any text to `box()`.
def spinner_only(view: View):  # height 2
    view(box(mode='spinner'))

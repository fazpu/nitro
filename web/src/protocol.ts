import { S, N, B, U, V, Pair, I } from "./core"

export enum MsgType {
  Error = 1,
  Join,
  Leave,
  Abort,
  Resume,
  Request,
  Response,
  Watch,
  Event,
  Input,
  Insert,
  Update,
  Remove,
}

export type Msg = {
  t: MsgType.Error
  e: S
} | {
  t: MsgType.Join
  d: any // XXX formalize
} | {
  t: MsgType.Insert
  d: Input
  p?: I
} | {
  t: MsgType.Update
  d: Input
  p?: I
} | {
  t: MsgType.Remove
  d: Input
} | {
  t: MsgType.Input,
  d: Array<V | null>
}

export enum WidgetT {
  Input = 1,
  Option,
  Text,
}

export type Widget = Input | Text

export type InputMode = 'button' | 'menu' | 'radio' | 'check' | 'text' | 'range' | 'number' | 'time' | 'day' | 'week' | 'month' | 'tag' | 'color' | 'rating'

export type Input = {
  t: WidgetT.Input
  xid: S
  index?: U
  text?: S
  name?: S
  mode?: InputMode
  icon?: S
  value?: V | Pair<V>
  min?: V
  max?: V
  step?: N
  precision?: U
  range?: [V, V] | [N, N, N] | [N, N, N, U]
  mask?: S
  prefix?: S
  suffix?: S
  // format?: S // TODO: displayed-value format string for spinbutton, slider
  placeholder?: S
  error?: S
  lines?: U
  multiple?: B
  required?: B
  password?: B
  editable?: B
  options: Option[]
  items?: Widget[]
  inline?: B
  size?: V
  align?: S
}

export type Option = {
  t: WidgetT.Option
  value: V
  text?: S
  icon?: S
  caption?: S
  selected?: B
  options?: Option[]
}

export type Text = {
  t: WidgetT.Text
  xid: S
  value: S
}

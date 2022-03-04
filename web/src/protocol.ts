import { S, N, B, U, V, Pair } from "./core"

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
  Write,
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
  t: MsgType.Write
  d: Input
} | {
  t: MsgType.Insert
  d: Input
} | {
  t: MsgType.Update
  d: Input
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
}

export type Widget = Input

export type Input = {
  t: WidgetT.Input
  xid: S
  text?: S
  name?: S
  mode?: 'text' | 'int' | 'float' | 'time' | 'day' | 'week' | 'month' | 'tag' | 'color' | 'rating'
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
  actions: Option[]
  items?: Widget[]
  inline?: B
  size?: V
  align?: S
}

export type Option = {
  t: WidgetT.Option
  value: V
  label?: S
  icon?: S
  caption?: S
  selected?: B
  options?: Option[]
}

import { S, words } from "./core"
import { format, makeFormatOptions } from "./format"

const en = ['en-US']

it('should interpolate format', () => {
  expect(format(en, '', {})).toEqual('')
  expect(format(en, 'foo', {})).toEqual('foo')
  expect(format(en, 'foo {} bar', {})).toEqual('foo  bar')
  expect(format(en, 'foo {   } bar', {})).toEqual('foo  bar')
  expect(format(en, '{foo}', { foo: 'bar' })).toEqual('bar')
  expect(format(en, '\n{\nfoo\n}\n', { foo: 'bar' })).toEqual('\nbar\n')
  expect(format(en, '  { foo   }  ', { foo: 'bar' })).toEqual('  bar  ')
  expect(format(en, '{foo} {qux}', { foo: 'bar', qux: 42 })).toEqual('bar 42')
})

const opt = (s: S) => makeFormatOptions(words(s))[1]
it('should translate number format', () => {
  expect(opt('num')).toEqual({ style: 'decimal' })
  expect(opt('pct')).toEqual({ style: 'percent' })
  expect(opt('sci')).toEqual({ notation: 'scientific' })
  expect(opt('eng')).toEqual({ notation: 'engineering' })
  expect(opt('num-xs')).toEqual({ notation: 'compact' })
  expect(opt('num-s')).toEqual({ notation: 'compact', compactDisplay: 'long' })
  expect(opt('cur-USD')).toEqual({ style: 'currency', currency: 'USD' })
  expect(opt('cur-EUR')).toEqual({ style: 'currency', currency: 'EUR' })
  expect(opt('cur-l')).toEqual({ currencyDisplay: 'name' })
  expect(opt('cur-m')).toEqual({ currencyDisplay: 'code' })
  expect(opt('cur-s')).toEqual({ currencyDisplay: 'symbol' })
  expect(opt('cur-xs')).toEqual({ currencyDisplay: 'narrowSymbol' })
  expect(opt('acc')).toEqual({ currencySign: 'accounting' })
  expect(opt('locale-fit')).toEqual({ localeMatcher: 'best fit' })
  expect(opt('locale-lookup')).toEqual({ localeMatcher: 'lookup' })
  expect(opt('numbering-deva')).toEqual({ numberingSystem: 'deva' })
  expect(opt('numbering-thai')).toEqual({ numberingSystem: 'thai' })
  expect(opt('sign-auto')).toEqual({ signDisplay: 'auto' })
  expect(opt('sign-always')).toEqual({ signDisplay: 'always' })
  expect(opt('sign-except-zero')).toEqual({ signDisplay: 'exceptZero' })
  expect(opt('sign-negative')).toEqual({ signDisplay: 'negative' })
  expect(opt('sign-none')).toEqual({ signDisplay: 'never' })
  expect(opt('unit-degree')).toEqual({ style: 'unit', unit: 'degree' })
  expect(opt('unit-inch')).toEqual({ style: 'unit', unit: 'inch' })
  expect(opt('unit-l')).toEqual({ unitDisplay: 'long' })
  expect(opt('unit-s')).toEqual({ unitDisplay: 'short' })
  expect(opt('unit-xs')).toEqual({ unitDisplay: 'narrow' })
  expect(opt('d-5')).toEqual({ minimumIntegerDigits: 5 })
  expect(opt('fd-5')).toEqual({ minimumFractionDigits: 5 })
  expect(opt('fd-5-15')).toEqual({ minimumFractionDigits: 5, maximumFractionDigits: 15 })
  expect(opt('fd--15')).toEqual({ maximumFractionDigits: 15 })
  expect(opt('sd-5')).toEqual({ minimumSignificantDigits: 5 })
  expect(opt('sd-5-15')).toEqual({ minimumSignificantDigits: 5, maximumSignificantDigits: 15 })
  expect(opt('sd--15')).toEqual({ maximumSignificantDigits: 15 })
})

it('should translate date format', () => {
  expect(opt('date')).toEqual({ dateStyle: 'full' })
  expect(opt('date-l')).toEqual({ dateStyle: 'long' })
  expect(opt('date-m')).toEqual({ dateStyle: 'medium' })
  expect(opt('date-s')).toEqual({ dateStyle: 'short' })
  expect(opt('time')).toEqual({ timeStyle: 'full' })
  expect(opt('time-l')).toEqual({ timeStyle: 'long' })
  expect(opt('time-m')).toEqual({ timeStyle: 'medium' })
  expect(opt('time-s')).toEqual({ timeStyle: 'short' })
  expect(opt('datetime')).toEqual({ dateStyle: 'full', timeStyle: 'full' })
  expect(opt('datetime-l')).toEqual({ dateStyle: 'long', timeStyle: 'long' })
  expect(opt('datetime-m')).toEqual({ dateStyle: 'medium', timeStyle: 'medium' })
  expect(opt('datetime-s')).toEqual({ dateStyle: 'short', timeStyle: 'short' })
  expect(opt('calendar-hebrew')).toEqual({ calendar: 'hebrew' })
  expect(opt('period-l')).toEqual({ dayPeriod: 'long' })
  expect(opt('period-s')).toEqual({ dayPeriod: 'short' })
  expect(opt('period-xs')).toEqual({ dayPeriod: 'narrow' })
  expect(opt('numbering-deva')).toEqual({ numberingSystem: 'deva' })
  expect(opt('numbering-thai')).toEqual({ numberingSystem: 'thai' })
  expect(opt('locale-fit')).toEqual({ localeMatcher: 'best fit' })
  expect(opt('locale-lookup')).toEqual({ localeMatcher: 'lookup' })
  expect(opt('cycle-12')).toEqual({ hourCycle: 'h12' })
  expect(opt('cycle-24')).toEqual({ hourCycle: 'h24' })
  expect(opt('cycle-11')).toEqual({ hourCycle: 'h11' })
  expect(opt('cycle-23')).toEqual({ hourCycle: 'h23' })
  expect(opt('format-fit')).toEqual({ formatMatcher: 'best fit' })
  expect(opt('format-basic')).toEqual({ formatMatcher: 'basic' })
  expect(opt('weekday-l')).toEqual({ weekday: 'long' })
  expect(opt('weekday-s')).toEqual({ weekday: 'short' })
  expect(opt('weekday-xs')).toEqual({ weekday: 'narrow' })
  expect(opt('era-l')).toEqual({ era: 'long' })
  expect(opt('era-s')).toEqual({ era: 'short' })
  expect(opt('era-xs')).toEqual({ era: 'narrow' })
  expect(opt('year')).toEqual({ year: 'numeric' })
  expect(opt('year-2')).toEqual({ year: '2-digit' })
  expect(opt('month')).toEqual({ month: 'numeric' })
  expect(opt('month-2')).toEqual({ month: '2-digit' })
  expect(opt('month-l')).toEqual({ month: 'long' })
  expect(opt('month-s')).toEqual({ month: 'short' })
  expect(opt('month-xs')).toEqual({ month: 'narrow' })
  expect(opt('day')).toEqual({ day: 'numeric' })
  expect(opt('day-2')).toEqual({ day: '2-digit' })
  expect(opt('hour')).toEqual({ hour: 'numeric' })
  expect(opt('hour-2')).toEqual({ hour: '2-digit' })
  expect(opt('minute')).toEqual({ minute: 'numeric' })
  expect(opt('minute-2')).toEqual({ minute: '2-digit' })
  expect(opt('second')).toEqual({ second: 'numeric' })
  expect(opt('second-2')).toEqual({ second: '2-digit' })
  expect(opt('fs-0')).toEqual({ fractionalSecondDigits: 0 })
  expect(opt('fs-1')).toEqual({ fractionalSecondDigits: 1 })
  expect(opt('fs-2')).toEqual({ fractionalSecondDigits: 2 })
  expect(opt('fs-3')).toEqual({ fractionalSecondDigits: 3 })
  expect(opt('zone-l')).toEqual({ timeZoneName: 'long' })
  expect(opt('zone-s')).toEqual({ timeZoneName: 'short' })
  expect(opt('zone-offset-l')).toEqual({ timeZoneName: 'longOffset' })
  expect(opt('zone-offset-s')).toEqual({ timeZoneName: 'shortOffset' })
  expect(opt('zone-generic-l')).toEqual({ timeZoneName: 'longGeneric' })
  expect(opt('zone-generic-s')).toEqual({ timeZoneName: 'shortGeneric' })
})

it('should translate relative time format', () => {
  ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second'].forEach(x => {
    expect(opt(`rel-${x}`)).toEqual({})
    expect(opt(`rel-${x}-l`)).toEqual({ style: 'long' })
    expect(opt(`rel-${x}-s`)).toEqual({ style: 'short' })
    expect(opt(`rel-${x}-xs`)).toEqual({ style: 'narrow' })
  })
})

import { tzUtc } from '@jetblack/date'
import { JetblackDateUtils } from '../src'
import { allUtils } from './utils'

test.each`
  format                     | expectedWithEn
  ${'normalDate'}            | ${'1 January'}
  ${'normalDateWithWeekday'} | ${'Wed, Jan 1'}
  ${'shortDate'}             | ${'Jan 1'}
  ${'year'}                  | ${'2020'}
  ${'month'}                 | ${'January'}
  ${'monthAndDate'}          | ${'January 1'}
  ${'weekday'}               | ${'Wednesday'}
  ${'weekdayShort'}          | ${'Wed'}
  ${'dayOfMonth'}            | ${'1'}
  ${'fullTime12h'}           | ${'11:44 PM'}
  ${'fullTime24h'}           | ${'23:44'}
  ${'hours12h'}              | ${'11'}
  ${'hours24h'}              | ${'23'}
  ${'minutes'}               | ${'44'}
  ${'seconds'}               | ${'00'}
`(
  'Correctly format standalone hardcoded formats',
  ({ format, expectedWithEn }) => {
    allUtils.forEach(([libName, utils]) => {
      const date: any = utils.date('2020-01-01T23:44:00.000Z')
      const result = utils.format(date, format)
      if (result !== expectedWithEn) {
        throw new Error(
          `${libName} utils.formats.${format} results to "${result}", expected "${expectedWithEn}"`
        )
      }
    })
  }
)

describe('Localized formats', () => {
  test.each`
    format                   | expectedWithEn                  | expectedWithRu
    ${'fullDate'}            | ${'Feb 1, 2020'}                | ${'1 февр. 2020 г.'}
    ${'fullDateWithWeekday'} | ${'Saturday, February 1, 2020'} | ${'суббота, 1 февраль 2020 г.'}
    ${'fullDateTime'}        | ${'Feb 1, 2020 11:44 PM'}       | ${'1 февр. 2020 г., 23:44'}
    ${'fullDateTime12h'}     | ${'Feb 1, 2020 11:44 PM'}       | ${'1 февр. 2020 г., 11:44 PM'}
    ${'fullDateTime24h'}     | ${'Feb 1, 2020 23:44'}          | ${'1 февр. 2020 г., 23:44'}
    ${'keyboardDate'}        | ${'02/01/2020'}                 | ${'01.02.2020'}
    ${'keyboardDateTime'}    | ${'02/01/2020 11:44 PM'}        | ${'01.02.2020 23:44'}
    ${'keyboardDateTime12h'} | ${'02/01/2020 11:44 PM'}        | ${'01.02.2020 11:44 PM'}
    ${'keyboardDateTime24h'} | ${'02/01/2020 23:44'}           | ${'01.02.2020 23:44'}
  `(
    '@jetblack/date localized $format',
    ({ format, expectedWithEn, expectedWithRu }) => {
      const jetblackDateUtils = new JetblackDateUtils()
      const jetblackDateRuUtils = new JetblackDateUtils({
        tz: tzUtc,
        locale: 'ru',
        formats: {
          fullDate: 'd mmm yyyy г.',
          fullDateWithWeekday: 'dddd, d mmmm yyyy г.',
          fullDateTime: 'd mmm yyyy г., HH:MM',
          fullDateTime12h: 'd mmm yyyy г., hh:MM t',
          fullDateTime24h: 'd mmm yyyy г., HH:MM',
          keyboardDate: 'dd.mm.yyyy',
          keyboardDateTime: 'dd.mm.yyyy HH:MM',
          keyboardDateTime12h: 'dd.mm.yyyy hh:MM t',
          keyboardDateTime24h: 'dd.mm.yyyy HH:MM'
        }
      })
      const date = jetblackDateUtils.date('2020-02-01T23:44:00.000Z') as Date

      expect(jetblackDateUtils.format(date, format)).toBe(expectedWithEn)
      expect(jetblackDateRuUtils.format(date, format)).toBe(expectedWithRu)
    }
  )
})

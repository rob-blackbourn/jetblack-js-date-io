// import { IUtils } from "../packages/core/IUtils";
// import LuxonUtils from "../packages/luxon/src";
// import DateFnsUtils from "../packages/date-fns/src";
// import MomentUtils from "../packages/moment/src";
// import DayJSUtils from "../packages/dayjs/src";
// import JSJodaUtils from "../packages/js-joda/src";
import { IUtils } from '@date-io/core/IUtils'
import { IANATimezone, dataToTimezoneOffset, tzUtc } from '@jetblack/date'
import { JetblackDateUtils } from '../src'
import londonTzData from '@jetblack/tzdata/dist/latest/Europe/London.json'
import chicagoTzData from '@jetblack/tzdata/dist/latest/America/Chicago.json'

const tzLondon = new IANATimezone(
  'Europe/London',
  londonTzData.map(dataToTimezoneOffset)
)
const tzChicago = new IANATimezone(
  'America/Chicago',
  londonTzData.map(dataToTimezoneOffset)
)

// Time when the first commit to date-io was created
export const TEST_TIMESTAMP = '2018-10-30T11:44:00.000Z'
export const LOCALDATE_TEST_TIMESTAMP = '2018-10-30'
export type TestLib = 'JetblackDate'

export const allUtils = [
  ['JetblackDate', new JetblackDateUtils({ tz: tzUtc })]
] as const

export const utilsTest = (
  name: string,
  innerFn: (date: any, utils: IUtils<any>, currentLib: TestLib) => void
) => {
  test.each(allUtils)(`%s -- ${name}`, (name, utils) =>
    innerFn(utils.date(TEST_TIMESTAMP), utils, name)
  )
}

// export const localDateAllUtils = [
//   ["JSJoda", new JSJodaUtils()]
// ] as const;

// export const localDateutilsTest = (
//   name: string,
//   innerFn: (date: any, utils: IUtils<any>, currentLib: TestLib) => void
// ) => {
//   test.each(localDateAllUtils)(`%s -- ${name}`, (name, utils) =>
//     innerFn(utils.date(LOCALDATE_TEST_TIMESTAMP), utils, name)
//   );
// };

export const formats: Record<string, Record<TestLib, string>> = {
  day: { JetblackDate: 'dd' },
  dateTime: {
    JetblackDate: 'yyyy-mm-dd HH:MM'
  },
  date: {
    JetblackDate: 'yyyy-mm-dd'
  }
}

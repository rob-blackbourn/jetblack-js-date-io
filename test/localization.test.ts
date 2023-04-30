import { DateIOFormats } from '@date-io/core/IUtils'
import { JetblackDateUtils } from '../src'
import { TEST_TIMESTAMP, utilsTest } from './utils'

describe('Localization helpers', () => {
  utilsTest('formatNumber', (date, utils) => {
    expect(utils.formatNumber('1')).toBe('1')
  })

  utilsTest('getMeridiemText', (date, utils) => {
    expect(utils.getMeridiemText('am')).toBe('AM')
    expect(utils.getMeridiemText('pm')).toBe('PM')
  })
})

describe('@jetblack/date -- Localization', () => {
  const enAuJetblackDateUtils = new JetblackDateUtils({ locale: 'en-AU' })
  const ruJetblackDateUtils = new JetblackDateUtils({ locale: 'ru' })

  it('Should return weekdays starting with monday', () => {
    const result = ruJetblackDateUtils.getWeekdays()
    expect(result).toEqual(['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'])
  })

  it('is12HourCycleInCurrentLocale: properly determine should use meridiem or not', () => {
    expect(enAuJetblackDateUtils.is12HourCycleInCurrentLocale()).toBe(true)
    // expect(ruJetblackDateUtils.is12HourCycleInCurrentLocale()).toBe(false)
    // default behavior
    expect(new JetblackDateUtils().is12HourCycleInCurrentLocale()).toBe(true)
  })

  it('getCurrentLocaleCode: returns locale code', () => {
    expect(ruJetblackDateUtils.getCurrentLocaleCode()).toBe('ru')
  })
  it('startOfWeek: returns correct start of week for locale', () => {
    expect(
      ruJetblackDateUtils.formatByString(
        ruJetblackDateUtils.startOfWeek(
          ruJetblackDateUtils.date(TEST_TIMESTAMP) as Date
        ),
        'd'
      )
    ).toEqual('29')
  })
  it('endOfWeek: returns correct end of week for locale', () => {
    expect(
      ruJetblackDateUtils.formatByString(
        ruJetblackDateUtils.endOfWeek(
          ruJetblackDateUtils.date(TEST_TIMESTAMP) as Date
        ),
        'd'
      )
    ).toEqual('4')
  })
})

// describe("Dayjs -- Localization", () => {
//   dayjs.extend(advancedDayJsFormat);

//   describe("Russian", () => {
//     let dayjsUtils = new DayjsUtils({ instance: dayjs, locale: "ru" });
//     const date = dayjsUtils.date(TEST_TIMESTAMP);

//     it("getWeekdays: should start from monday", () => {
//       const result = dayjsUtils.getWeekdays();
//       expect(result).toEqual(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
//     });

//     it("getWeekArray: week should start from monday", () => {
//       const result = dayjsUtils.getWeekArray(date);
//       expect(result[0][0].format("dd")).toBe("пн");
//     });

//     it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
//       expect(dayjsUtils.is12HourCycleInCurrentLocale()).toBe(false);
//     });

//     it("getCurrentLocaleCode: returns locale code", () => {
//       expect(dayjsUtils.getCurrentLocaleCode()).toBe("ru");
//     });
//   });

//   describe("English", () => {
//     let dayjsUtils = new DayjsUtils({ instance: dayjs, locale: "en" });
//     const date = dayjsUtils.date(TEST_TIMESTAMP);

//     it("getWeekdays: should start from sunday", () => {
//       const result = dayjsUtils.getWeekdays();
//       expect(result).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
//     });

//     it("getWeekArray: week should start from sunday", () => {
//       const result = dayjsUtils.getWeekArray(date);
//       expect(result[0][0].format("dd")).toBe("Su");
//     });

//     it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
//       expect(dayjsUtils.is12HourCycleInCurrentLocale()).toBe(true);
//     });
//   });
// });

// describe('formatHelperText', () => {
//   utilsTest('getFormatHelperText', (_, utils, lib) => {
//     // if (lib === "Luxon") {
//     //   return;
//     // }

//     expect(utils.getFormatHelperText(utils.formats.keyboardDate)).toBe(
//       'mm/dd/yyyy'
//     )
//     expect(utils.getFormatHelperText(utils.formats.keyboardDateTime12h)).toBe(
//       'mm/dd/yyyy hh:mm (a|p)m'
//     )
//   })

//   // it("Luxon -- getFormatHelperText should return empty string", () => {
//   //   const utils = new LuxonUtils();

//   //   expect(utils.getFormatHelperText(utils.formats.keyboardDate)).toBe("");
//   // });
// })

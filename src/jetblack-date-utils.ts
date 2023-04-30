import { IUtils, DateIOFormats, Unit } from '@date-io/core/IUtils'
import {
  Timezone,
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  addYears,
  diffInCalYears,
  diffInCalMonths,
  diffInCalDays,
  diffInHours,
  diffInMinutes,
  diffInSeconds,
  diffInMilliseconds,
  isDateAfter,
  isDateBefore,
  startOfDay,
  endOfDay,
  tzLocal,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeekday,
  endOfWeekday,
  isDateOnOrAfter,
  isDateOnOrBefore,
  daysInMonth,
  parseDate,
  formatDate,
  getLocaleInfo,
  I18nSettings
} from '@jetblack/date'

const defaultFormats: DateIOFormats = {
  normalDateWithWeekday: 'ddd, mmm d',
  normalDate: 'd mmmm',
  shortDate: 'mmm d',
  monthAndDate: 'mmmm d',
  dayOfMonth: 'd',
  year: 'yyyy',
  month: 'mmmm',
  monthShort: 'mmm',
  monthAndYear: 'mmmm yyyy',
  weekday: 'dddd',
  weekdayShort: 'ddd',
  minutes: 'MM',
  hours12h: 'hh',
  hours24h: 'HH',
  seconds: 'SS',
  fullTime: 'hh:MM t',
  fullTime12h: 'hh:MM t',
  fullTime24h: 'HH:MM',
  fullDate: 'mmm d, yyyy',
  fullDateWithWeekday: 'dddd, mmmm d, yyyy',
  fullDateTime: 'mmm d, yyyy hh:MM t',
  fullDateTime12h: 'mmm d, yyyy hh:MM t',
  fullDateTime24h: 'mmm d, yyyy HH:MM',
  keyboardDate: 'mm/dd/yyyy',
  keyboardDateTime: 'mm/dd/yyyy hh:MM t',
  keyboardDateTime12h: 'mm/dd/yyyy hh:MM t',
  keyboardDateTime24h: 'mm/dd/yyyy HH:MM'
}

export class JetblackDateUtils implements IUtils<Date> {
  public lib = '@jetblack/date'
  public tz: Timezone
  public formats: DateIOFormats
  public localeInfo: I18nSettings

  constructor({
    tz,
    formats,
    locale
  }: {
    formats?: Partial<DateIOFormats>
    tz?: Timezone
    locale?: string
  } = {}) {
    this.tz = tz || tzLocal
    this.formats = Object.assign({}, defaultFormats, formats)
    this.localeInfo = getLocaleInfo(
      locale || Intl.DateTimeFormat().resolvedOptions().locale
    )
  }

  date = (value?: any): Date | null => {
    return value === null
      ? null
      : value === undefined
      ? new Date()
      : new Date(value)
  }
  toJsDate = (value: Date): Date => value
  parseISO = (isString: string): Date => new Date(isString)
  toISO = (value: Date): string => value.toISOString()
  parse = (value: string, format: string): Date | null => {
    return parseDate(value, format, this.localeInfo)
  }

  getCurrentLocaleCode = (): string => this.localeInfo.locale
  is12HourCycleInCurrentLocale = (): boolean => true
  /** Returns user readable format (taking into account localized format tokens), useful to render helper text for input (e.g. placeholder). For luxon always returns empty string. */
  getFormatHelperText = (format: string): string => ''

  isNull = (value: Date | null): boolean => value == null
  isValid = (value: any): boolean => {
    return (
      value === undefined ||
      (value instanceof Date && !isNaN(value.valueOf())) ||
      (typeof value === 'string' && !isNaN(new Date(value).valueOf()))
    )
  }
  getDiff = (value: Date, comparing: Date | string, unit?: Unit): number => {
    const other = comparing instanceof Date ? comparing : new Date(comparing)

    switch (unit) {
      case 'years':
        return diffInCalYears(value, other, this.tz)
      case 'quarters':
        return Math.trunc(diffInCalMonths(value, other, this.tz) / 3)
      case 'months':
        return diffInCalMonths(value, other, this.tz)
      case 'weeks':
        return Math.trunc(diffInCalDays(value, other, this.tz) / 7)
      case 'days':
        return diffInCalDays(value, other, this.tz)
      case 'hours':
        return diffInHours(value, other)
      case 'minutes':
        return diffInMinutes(value, other)
      case 'seconds':
        return diffInSeconds(value, other)
      default: {
        return diffInMilliseconds(value, other)
      }
    }
  }
  isEqual = (value: any, comparing: any): boolean => {
    return (
      (value == null && comparing == null) ||
      (value instanceof Date &&
        comparing instanceof Date &&
        value.valueOf() == comparing.valueOf())
    )
  }

  isSameDay = (value: Date, comparing: Date): boolean => {
    const lhs = this.tz.dateParts(value, {
      year: true,
      monthIndex: true,
      day: true
    })
    const rhs = this.tz.dateParts(comparing, {
      year: true,
      monthIndex: true,
      day: true
    })
    return (
      lhs.year === rhs.year &&
      lhs.monthIndex == rhs.monthIndex &&
      lhs.day == rhs.day
    )
  }
  isSameMonth = (value: Date, comparing: Date): boolean => {
    const lhs = this.tz.dateParts(value, { year: true, monthIndex: true })
    const rhs = this.tz.dateParts(comparing, { year: true, monthIndex: true })
    return lhs.year === rhs.year && lhs.monthIndex == rhs.monthIndex
  }
  isSameYear = (value: Date, comparing: Date): boolean => {
    return this.tz.year(value) === this.tz.year(comparing)
  }
  isSameHour = (value: Date, comparing: Date): boolean => {
    const lhs = this.tz.dateParts(value, {
      year: true,
      monthIndex: true,
      day: true,
      hours: true
    })
    const rhs = this.tz.dateParts(comparing, {
      year: true,
      monthIndex: true,
      day: true,
      hours: true
    })
    return (
      lhs.year === rhs.year &&
      lhs.monthIndex == rhs.monthIndex &&
      lhs.day == rhs.day &&
      lhs.hours == rhs.hours
    )
  }

  isAfter = (value: Date, comparing: Date): boolean =>
    value == null || (comparing != null && isDateAfter(value, comparing))
  isAfterDay = (value: Date, comparing: Date): boolean =>
    isDateAfter(startOfDay(value, this.tz), startOfDay(comparing, this.tz))
  isAfterYear = (value: Date, comparing: Date): boolean =>
    isDateAfter(startOfYear(value, this.tz), startOfYear(comparing, this.tz))

  isBeforeDay = (value: Date, comparing: Date): boolean =>
    isDateBefore(startOfDay(value, this.tz), startOfDay(comparing, this.tz))
  isBeforeYear = (value: Date, comparing: Date): boolean => {
    return isDateBefore(
      startOfYear(value, this.tz),
      startOfYear(comparing, this.tz)
    )
  }
  isBefore = (value: Date, comparing: Date): boolean =>
    comparing == null || (value != null && isDateBefore(value, comparing))

  isWithinRange = (value: Date, range: [Date, Date]): boolean =>
    isDateOnOrAfter(value, range[0]) && isDateOnOrBefore(value, range[1])

  startOfYear = (value: Date): Date => startOfYear(value, this.tz)
  endOfYear = (value: Date): Date => endOfYear(value, this.tz)
  startOfMonth = (value: Date): Date => startOfMonth(value, this.tz)
  endOfMonth = (value: Date): Date => endOfMonth(value, this.tz)
  startOfWeek = (value: Date): Date => startOfWeekday(value, 1, this.tz)
  endOfWeek = (value: Date): Date => endOfWeekday(value, 1, this.tz)

  addSeconds = (value: Date, count: number): Date => addSeconds(value, count)
  addMinutes = (value: Date, count: number): Date => addMinutes(value, count)
  addHours = (value: Date, count: number): Date => addHours(value, count)
  addDays = (value: Date, count: number): Date => addDays(value, count, this.tz)
  addWeeks = (value: Date, count: number): Date =>
    addDays(value, count * 7, this.tz)
  addMonths = (value: Date, count: number): Date =>
    addMonths(value, count, this.tz)
  addYears = (value: Date, count: number): Date =>
    addYears(value, count, this.tz)

  startOfDay = (value: Date): Date => startOfDay(value, this.tz)
  endOfDay = (value: Date): Date => endOfDay(value, this.tz)

  format = (value: Date, formatKey: keyof DateIOFormats): string =>
    formatDate(value, this.formats[formatKey], this.tz, this.localeInfo)
  formatByString = (value: Date, formatString: string): string =>
    formatDate(value, formatString, this.tz, this.localeInfo)
  formatNumber = (numberToFormat: string): string => numberToFormat

  getHours = (value: Date): number => this.tz.hours(value)
  setHours = (value: Date, count: number): Date => {
    const { year, monthIndex, day, hours, minutes, seconds, milliseconds } =
      this.tz.dateParts(value, {
        year: true,
        monthIndex: true,
        day: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
      })
    return this.tz.makeDate(
      year,
      monthIndex,
      day,
      count,
      minutes,
      seconds,
      milliseconds
    )
  }

  getMinutes = (value: Date): number => this.tz.minutes(value)
  setMinutes = (value: Date, count: number): Date => {
    const { year, monthIndex, day, hours, minutes, seconds, milliseconds } =
      this.tz.dateParts(value, {
        year: true,
        monthIndex: true,
        day: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
      })
    return this.tz.makeDate(
      year,
      monthIndex,
      day,
      hours,
      count,
      seconds,
      milliseconds
    )
  }

  getSeconds = (value: Date): number => this.tz.seconds(value)
  setSeconds = (value: Date, count: number): Date => {
    const { year, monthIndex, day, hours, minutes, seconds, milliseconds } =
      this.tz.dateParts(value, {
        year: true,
        monthIndex: true,
        day: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
      })
    return this.tz.makeDate(
      year,
      monthIndex,
      day,
      hours,
      minutes,
      count,
      milliseconds
    )
  }

  getDate = (value: Date): number => this.tz.day(value)
  setDate = (value: Date, count: number): Date => {
    const { year, monthIndex, day, hours, minutes, seconds, milliseconds } =
      this.tz.dateParts(value, {
        year: true,
        monthIndex: true,
        day: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
      })
    return this.tz.makeDate(
      year,
      monthIndex,
      count,
      hours,
      minutes,
      seconds,
      milliseconds
    )
  }

  getMonth = (value: Date): number => this.tz.monthIndex(value)
  getDaysInMonth = (value: Date): number =>
    daysInMonth(this.tz.year(value), this.tz.monthIndex(value))
  setMonth = (value: Date, count: number): Date => {
    const { year, monthIndex, day, hours, minutes, seconds, milliseconds } =
      this.tz.dateParts(value, {
        year: true,
        monthIndex: true,
        day: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
      })
    return this.tz.makeDate(
      year,
      count,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    )
  }
  getNextMonth = (value: Date): Date => addMonths(value, 1, this.tz)
  getPreviousMonth = (value: Date): Date => addMonths(value, -1, this.tz)

  getMonthArray = (value: Date): Date[] => {
    const year = this.tz.year(value)
    return [
      this.tz.makeDate(year, 0),
      this.tz.makeDate(year, 1),
      this.tz.makeDate(year, 2),
      this.tz.makeDate(year, 3),
      this.tz.makeDate(year, 4),
      this.tz.makeDate(year, 5),
      this.tz.makeDate(year, 6),
      this.tz.makeDate(year, 7),
      this.tz.makeDate(year, 8),
      this.tz.makeDate(year, 9),
      this.tz.makeDate(year, 10),
      this.tz.makeDate(year, 11)
    ]
  }

  getYear = (value: Date): number => this.tz.year(value)
  setYear = (value: Date, count: number): Date => {
    const { year, monthIndex, day, hours, minutes, seconds, milliseconds } =
      this.tz.dateParts(value, {
        year: true,
        monthIndex: true,
        day: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
      })
    return this.tz.makeDate(
      count,
      monthIndex,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    )
  }

  mergeDateAndTime = (date: Date, time: Date): Date => {
    const { year, monthIndex, day } = this.tz.dateParts(date, {
      year: true,
      monthIndex: true,
      day: true
    })
    const { hours, minutes, seconds, milliseconds } = this.tz.dateParts(time, {
      hours: true,
      minutes: true,
      seconds: true,
      milliseconds: true
    })
    return this.tz.makeDate(
      year,
      monthIndex,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    )
  }

  getWeekdays = (): string[] => [
    ...this.localeInfo.weekday.short.slice(1, 7),
    ...this.localeInfo.weekday.short.slice(0, 1)
  ]
  getWeekArray = (date: Date): Date[][] => {
    const start = startOfWeekday(startOfMonth(date, this.tz), 0, this.tz)
    const end = endOfWeekday(endOfMonth(date, this.tz), 0, this.tz)

    let count = 0
    let current = start
    const nestedWeeks: Date[][] = []
    let lastDay = null
    while (isDateBefore(current, end)) {
      const weekNumber = Math.floor(count / 7)
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || []
      const day = this.tz.weekday(current)
      if (lastDay !== day) {
        lastDay = day
        nestedWeeks[weekNumber].push(current)
        count += 1
      }
      current = addDays(current, 1)
    }
    return nestedWeeks
  }
  getYearRange = (start: Date, end: Date): Date[] => {
    const startDate = startOfYear(start, this.tz)
    const endDate = endOfYear(end, this.tz)
    const years: Date[] = []

    let current = startDate
    while (isDateBefore(current, endDate)) {
      years.push(current)
      current = addYears(current, 1, this.tz)
    }

    return years
  }

  /** Allow to customize displaying "am/pm" strings */
  getMeridiemText = (ampm: 'am' | 'pm'): string => ampm.toUpperCase()
}

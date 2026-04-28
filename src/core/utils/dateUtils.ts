/**
 * Date formatting utilities — faithful conversion of DHTMLX suite.js date_1 module
 * (lines 2933–3400 in suite.js v9.2.0).
 *
 * Format tokens:
 *   %d  day with leading zero (01..31)
 *   %j  day without leading zero (1..31)
 *   %D  short day name (Sun..Sat)
 *   %l  full day name (Sunday..Saturday)
 *   %m  month with leading zero (01..12)
 *   %n  month without leading zero (1..12)
 *   %M  short month name (Jan..Dec)
 *   %F  full month name (January..December)
 *   %y  2-digit year
 *   %Y  4-digit year
 *   %h  12-hour with leading zero (01..12)
 *   %g  12-hour without leading zero (1..12)
 *   %H  24-hour with leading zero (00..23)
 *   %G  24-hour without leading zero (0..23)
 *   %i  minutes with leading zero (00..59)
 *   %s  seconds with leading zero (00..59)
 *   %a  am/pm
 *   %A  AM/PM
 *   %u  milliseconds
 */

export const locale = {
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  cancel: 'Cancel',
}

// ─── Formatters (date → string part) ──────────────────────────────────────

const formatters: Record<string, (d: Date) => string | number> = {
  '%d': (d) => String(d.getDate()).padStart(2, '0'),
  '%j': (d) => d.getDate(),
  '%D': (d) => locale.daysShort[d.getDay()],
  '%l': (d) => locale.days[d.getDay()],
  '%m': (d) => String(d.getMonth() + 1).padStart(2, '0'),
  '%n': (d) => d.getMonth() + 1,
  '%M': (d) => locale.monthsShort[d.getMonth()],
  '%F': (d) => locale.months[d.getMonth()],
  '%y': (d) => String(d.getFullYear()).slice(2),
  '%Y': (d) => d.getFullYear(),
  '%h': (d) => { const h = d.getHours() % 12 || 12; return String(h).padStart(2, '0') },
  '%g': (d) => d.getHours() % 12 || 12,
  '%H': (d) => String(d.getHours()).padStart(2, '0'),
  '%G': (d) => d.getHours(),
  '%i': (d) => String(d.getMinutes()).padStart(2, '0'),
  '%s': (d) => String(d.getSeconds()).padStart(2, '0'),
  '%a': (d) => (d.getHours() >= 12 ? 'pm' : 'am'),
  '%A': (d) => (d.getHours() >= 12 ? 'PM' : 'AM'),
  '%u': (d) => d.getMilliseconds(),
}

// ─── Tokenizer ────────────────────────────────────────────────────────────

type Token = { type: 'separator' | 'datePart'; value: string }

function tokenizeFormat(format: string): Token[] {
  const tokens: Token[] = []
  let sep = ''
  for (let i = 0; i < format.length; i++) {
    if (format[i] === '%' && i + 1 < format.length) {
      if (sep) { tokens.push({ type: 'separator', value: sep }); sep = '' }
      tokens.push({ type: 'datePart', value: format[i] + format[i + 1] })
      i++
    } else {
      sep += format[i]
    }
  }
  if (sep) tokens.push({ type: 'separator', value: sep })
  return tokens
}

// ─── getFormattedDate ─────────────────────────────────────────────────────

export function getFormattedDate(format: string, date: Date): string {
  return tokenizeFormat(format).reduce((res, token) => {
    if (token.type === 'separator') return res + token.value
    const fn = formatters[token.value]
    return res + (fn ? fn(date) : '')
  }, '')
}

// ─── stringToDate ─────────────────────────────────────────────────────────

export function stringToDate(
  str: string,
  format: string,
  validate?: boolean,
): Date | false | undefined {
  if (typeof str !== 'string' || !str) return validate ? false : undefined

  const tokens = tokenizeFormat(format)
  const date = new Date(2000, 0, 1, 0, 0, 0, 0)
  let idx = 0
  let ampm: string | null = null

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t]

    if (token.type === 'separator') {
      const found = str.indexOf(token.value, idx)
      if (found === -1) { if (validate) return false; break }
      idx = found + token.value.length
      continue
    }

    // Find where this date part ends (at next separator or end of string)
    const nextSep = tokens.slice(t + 1).find((tk) => tk.type === 'separator')
    let val: string
    if (nextSep) {
      const sepIdx = str.indexOf(nextSep.value, idx)
      val = sepIdx >= 0 ? str.slice(idx, sepIdx) : str.slice(idx)
    } else {
      // Last token: read expected length
      const expectedLen: Record<string, number> = {
        '%Y': 4, '%u': 3, '%d': 2, '%m': 2, '%H': 2, '%h': 2, '%i': 2, '%s': 2,
      }
      const len = expectedLen[token.value] ?? 2
      val = str.slice(idx, idx + len)
    }
    idx += val.length

    switch (token.value) {
      case '%Y': date.setFullYear(Number(val)); break
      case '%y': date.setFullYear(Number('20' + val)); break
      case '%m': case '%n': date.setMonth(Number(val) - 1); break
      case '%M': { const mi = locale.monthsShort.indexOf(val); if (mi >= 0) date.setMonth(mi); break }
      case '%F': { const fi = locale.months.indexOf(val); if (fi >= 0) date.setMonth(fi); break }
      case '%d': case '%j': date.setDate(Number(val)); break
      case '%H': case '%G': date.setHours(Number(val)); break
      case '%h': case '%g': date.setHours(Number(val) % 12); break
      case '%i': date.setMinutes(Number(val)); break
      case '%s': date.setSeconds(Number(val)); break
      case '%u': date.setMilliseconds(Number(val)); break
      case '%a': case '%A': ampm = val.toLowerCase(); break
    }
  }

  if (ampm === 'pm' && date.getHours() < 12) date.setHours(date.getHours() + 12)
  if (ampm === 'am' && date.getHours() === 12) date.setHours(0)
  if (validate && isNaN(date.getTime())) return false
  return isNaN(date.getTime()) ? undefined : date
}

// ─── DateHelper ───────────────────────────────────────────────────────────

const DAY_MS = 86_400_000

export const DateHelper = {
  copy: (d: Date): Date => new Date(d.getTime()),

  fromYear: (year: number): Date => new Date(year, 0, 1),

  fromYearAndMonth: (year: number, month: number): Date => new Date(year, month, 1),

  /** Move d back to the start of the week for the given firstWeekday offset.
   *  firstWeekday: 0=Sun, 1=Mon, -1=Sat (DHTMLX convention). */
  weekStart: (d: Date, firstWeekday: number): Date => {
    const result = new Date(d.getTime())
    const day = d.getDay()
    const diff = (day - firstWeekday + 7) % 7
    result.setDate(d.getDate() - diff)
    result.setHours(0, 0, 0, 0)
    return result
  },

  monthStart: (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1),

  yearStart: (d: Date): Date => new Date(d.getFullYear(), 0, 1),

  dayStart: (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate()),

  addDay: (d: Date, count = 1): Date => {
    const r = new Date(d.getTime())
    r.setDate(d.getDate() + count)
    return r
  },

  addMonth: (d: Date, count = 1): Date => {
    const r = new Date(d.getTime())
    r.setMonth(d.getMonth() + count)
    return r
  },

  addYear: (d: Date, count = 1): Date => {
    const r = new Date(d.getTime())
    r.setFullYear(d.getFullYear() + count)
    return r
  },

  withHoursAndMinutes: (d: Date, hours: number, minutes: number, AM?: string): Date => {
    const r = new Date(d.getTime())
    let h = hours
    if (AM === 'PM' && h < 12) h += 12
    if (AM === 'AM' && h === 12) h = 0
    r.setHours(h, minutes, 0, 0)
    return r
  },

  setMonth: (d: Date, month: number): void => { d.setMonth(month) },

  setYear: (d: Date, year: number): void => { d.setFullYear(year) },

  mergeHoursAndMinutes: (source: Date, target: Date): Date => {
    const r = new Date(source.getTime())
    r.setHours(target.getHours(), target.getMinutes(), 0, 0)
    return r
  },

  isWeekEnd: (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6,

  /** Returns 12 years centred on the decade containing d (DHTMLX getTwelweYears). */
  getTwelveYears: (d: Date): number[] => {
    const year = d.getFullYear()
    const start = year - (year % 12)
    return Array.from({ length: 12 }, (_, i) => start + i)
  },

  getDayOrdinal: (d: Date): number => {
    const ys = new Date(d.getFullYear(), 0, 1)
    return Math.floor((d.valueOf() - ys.valueOf()) / DAY_MS)
  },

  getWeekNumber: (d: Date): number => {
    const day = d.getDay()
    const thu = day === 4 ? d : DateHelper.addDay(d, 4 - day)
    return Math.floor(DateHelper.getDayOrdinal(thu) / 7) + 1
  },

  isSameDay: (d1: Date | null | undefined, d2: Date | null | undefined): boolean => {
    if (!d1 || !d2) return false
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  },

  toDateObject: (
    date: string | Date | null | undefined,
    dateFormat: string,
  ): Date | undefined => {
    if (!date) return undefined
    if (date instanceof Date) return new Date(date.getTime())
    const result = stringToDate(date, dateFormat)
    return result === false ? undefined : result
  },
}

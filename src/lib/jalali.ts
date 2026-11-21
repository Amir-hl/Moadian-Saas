/**
 * Lightweight Jalali (Shamsi) <-> Gregorian date converter without external dependencies.
 */

export function toJalali(date: Date | string | number): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  // Format using built-in Intl with Latin digits for simple parsing
  const formatter = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(d)
}

export function formatJalaliDisplay(date: Date | string | number): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Converts a Jalali date string (YYYY/MM/DD) into a Gregorian Date object.
 */
export function jalaliToGregorian(jDateStr: string): Date {
  const parts = jDateStr.trim().split(/[\/\-.]/).map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    return new Date()
  }

  const [jy, jm, jd] = parts

  const gy =
    jy <= 979
      ? 621
      : 1600
  let jy2 = jy <= 979 ? jy : jy - 979

  const days =
    365 * jy2 +
    Math.floor(jy2 / 33) * 8 +
    Math.floor(((jy2 % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186)

  let gy2 = gy + 400 * Math.floor(days / 146097)
  let d = days % 146097

  if (d >= 36525) {
    d--
    gy2 += 100 * Math.floor(d / 36524)
    d = d % 36524

    if (d >= 365) {
      d++
    }
  }

  gy2 += 4 * Math.floor(d / 1461)
  d %= 1461

  if (d >= 366) {
    d--
    gy2 += Math.floor(d / 365)
    d = d % 365
  }

  const sal_a = [0, 31, (gy2 % 4 === 0 && gy2 % 100 !== 0) || gy2 % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm = 0
  for (gm = 0; gm < 13; gm++) {
    const v = sal_a[gm]
    if (d < v) break
    d -= v
  }

  return new Date(Date.UTC(gy2, gm - 1, d + 1, 12, 0, 0))
}

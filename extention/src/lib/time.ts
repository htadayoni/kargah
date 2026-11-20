import { LOCALE_META, type Locale } from './i18n';

export type CalendarKind = 'jalali' | 'gregorian';

export function formatClock(locale: Locale, hour12: boolean, d: Date): { time: string; period: string } {
  const intl = LOCALE_META[locale].intl;
  if (!hour12) {
    return { time: new Intl.DateTimeFormat(intl, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d), period: '' };
  }
  const parts = new Intl.DateTimeFormat(intl, { hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(d);
  const pick = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { time: `${pick('hour')}:${pick('minute')}`, period: pick('dayPeriod') };
}

export function formatDate(locale: Locale, calendar: CalendarKind, d: Date): string {
  const tag = `${LOCALE_META[locale].intl}-u-ca-${calendar === 'jalali' ? 'persian' : 'gregory'}`;
  return new Intl.DateTimeFormat(tag, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
}

export function formatCountdown(locale: Locale, ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const f = new Intl.NumberFormat(LOCALE_META[locale].intl, { minimumIntegerDigits: 2, useGrouping: false });
  return `${f.format(Math.floor(s / 60))}:${f.format(s % 60)}`;
}

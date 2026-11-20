import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { actions, moodEvents, useAppState, type MoodLevel, type MoodEvent } from '@/lib/state';
import { LOCALE_META } from '@/lib/i18n';
import { useI18n } from '@/lib/useI18n';
import { Close } from '@/components/Icons';
import { useMockFeatures } from '@/lib/featureFlags';
import { colors, dateKey, levels, MoodChoices, MoodIcon, moodText } from './MoodWidget';

export default function MoodDetail({ onClose }: { onClose: () => void }) {
  const { locale, t } = useI18n(); const entries = useAppState().moodEntries ?? {}; const today = dateKey(); const entry = entries[today]; const text = moodText(locale === 'fa'); const [range, setRange] = useState<7 | 30>(7); const [mockEnabled] = useMockFeatures(); const [selectedDate, setSelectedDate] = useState<string | null>(null); const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const days = Array.from({ length: range }, (_, i) => { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - (range - 1 - i)); const key = dateKey(date); return { date, key, mood: entries[key]?.mood }; });
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearHoverTimer = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  const leaveHover = () => { clearHoverTimer(); hoverTimer.current = setTimeout(() => setHoveredDate(null), 250); };
  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); }, []);
  const activeDate = selectedDate ?? hoveredDate;
  const activeIndex = days.findIndex(day => day.key === activeDate);
  const timeFormat = new Intl.DateTimeFormat(LOCALE_META[locale].intl, { hour: '2-digit', minute: '2-digit' });
  const format = new Intl.DateTimeFormat(LOCALE_META[locale].intl, { month: 'short', day: 'numeric' });
  return <section className="k-mood-dialog k-solid" role="dialog" aria-modal="true" aria-labelledby="mood-title">
    <header className="k-mood-header"><div><h2 id="mood-title">{text.title}</h2><p>{text.private}</p></div><button type="button" onClick={onClose} aria-label={t('common.close')}><Close /></button></header>
    <div className="k-mood-top"><div><h3>{text.question}</h3><MoodChoices value={entry?.mood} onChange={(level) => actions.setMood(today, level)} /></div><div><h3>{text.energy}</h3><div className="k-energy-choices" role="group" aria-label={text.energy}>{levels.map(level => <button key={level} type="button" aria-pressed={entry?.energy === level} disabled={!entry} className={entry?.energy === level ? 'is-selected' : ''} onClick={() => actions.setMoodEnergy(today, level)}><span className="k-energy-icon" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < level ? 'is-filled' : ''} />)}</span><span dir="auto">{text.energyLabels[level - 1]}</span></button>)}</div>{!entry && <p className="k-mood-muted">{text.empty}</p>}</div></div>
    {entry && entry.mood <= 2 && <p className="k-mood-support">{text.support}</p>}
    <div className="k-mood-chart"><div className="k-mood-chart-head"><h3>{text.history}</h3><div className="k-mood-ranges">{([7, 30] as const).map(n => <button type="button" key={n} onClick={() => { setRange(n); setSelectedDate(null); setHoveredDate(null); }} aria-pressed={range === n} className={range === n ? 'is-selected' : ''}>{n === 7 ? text.week : text.month}</button>)}</div></div>
      {days.some(d => d.mood) ? <div className={`k-mood-chart-grid ${range === 30 ? 'is-month' : ''}`} dir="ltr">{days.map(day => <button type="button" className="k-mood-day" key={day.key} disabled={!day.mood} aria-pressed={selectedDate === day.key} onMouseEnter={() => { clearHoverTimer(); if (day.mood) setHoveredDate(day.key); }} onMouseLeave={leaveHover} onFocus={() => day.mood && setHoveredDate(day.key)} onBlur={() => setHoveredDate(null)} onClick={() => setSelectedDate(selectedDate === day.key ? null : day.key)} aria-label={`${format.format(day.date)}: ${day.mood ? text.labels[day.mood - 1] : text.missing}`}><div className="k-mood-plot">{day.mood ? <span className="k-mood-dot" style={{ bottom: `${(day.mood - 1) * 21 + 5}%`, color: colors[day.mood - 1] }}><MoodIcon level={day.mood as MoodLevel}/></span> : <span className="k-mood-absent">·</span>}</div><span className="k-mood-date">{range === 7 || day.date.getDate() === 1 || day.key === today ? format.format(day.date) : ''}</span></button>)}</div> : <p className="k-mood-empty">{text.noData}</p>}
      {activeDate && entries[activeDate] && <div className={`k-mood-history-popover ${selectedDate === activeDate ? 'is-pinned' : ''} ${activeIndex >= days.length / 2 ? 'is-left' : 'is-right'}`} style={{ '--day-position': `${(activeIndex + .5) / days.length * 100}%` } as CSSProperties} dir={locale === 'fa' || locale === 'ar' ? 'rtl' : 'ltr'} onMouseEnter={clearHoverTimer} onMouseLeave={leaveHover}>
        {selectedDate === activeDate && <button className="k-history-close" type="button" onClick={() => { setSelectedDate(null); setHoveredDate(null); }} aria-label={t('common.close')}><Close /></button>}
        {(['mood', 'energy', 'note'] as const).map(kind => { const events = moodEvents(entries[activeDate]!).filter(event => event.type === kind); if (!events.length) return null; return <section className="k-history-section" key={kind} aria-label={kind === 'mood' ? (locale === 'fa' ? 'حال' : 'Mood') : kind === 'energy' ? (locale === 'fa' ? 'انرژی' : 'Energy') : (locale === 'fa' ? 'یادداشت‌ها' : 'Notes')}>
          <span className="k-history-category">{kind === 'mood' ? (locale === 'fa' ? 'حال' : 'Mood') : kind === 'energy' ? (locale === 'fa' ? 'انرژی' : 'Energy') : (locale === 'fa' ? 'یادداشت‌ها' : 'Notes')}{kind !== 'note' && ` (${new Intl.NumberFormat(LOCALE_META[locale].intl).format(events.length)} ${locale === 'fa' ? 'تغییر' : events.length === 1 ? 'entry' : 'entries'})`}</span>
          {kind === 'note' ? <div className="k-history-notes">{events.map((event, index) => event.type === 'note' && <div className="k-history-note" key={index}><time>{event.at === null ? (locale === 'fa' ? 'زمان نامشخص' : 'Time unknown') : timeFormat.format(event.at)}</time><p>{event.text}</p></div>)}</div> : <HistoryChanges key={`${activeDate}-${kind}`} events={events} locale={locale} kind={kind} labels={kind === 'mood' ? text.labels : text.energyLabels} timeFormat={timeFormat} />}

        </section>; })}</div>}
    </div>{mockEnabled && <div className="k-mood-community"><div className="k-community-content"><h3>{text.community} <span>{locale === 'fa' ? 'داده آزمایشی' : 'Mock data'}</span></h3><p>{locale === 'fa' ? 'نمونه نمایشی؛ نشان‌دهنده وضعیت واقعی کاربران نیست.' : 'Example only; not real user data.'}</p><div className="k-community-bars">{[8, 14, 20, 28, 30].map((value, i) => <div className="k-community-row" key={value}><MoodIcon level={levels[i]} style={{ color: colors[i] }} /><span>{text.labels[i]}</span><div className="k-community-track"><i style={{ width: `${value}%`, background: colors[i] }} /></div><b>{new Intl.NumberFormat(LOCALE_META[locale].intl, { style: 'percent' }).format(value / 100)}</b></div>)}</div></div><MoodIcon level={4} aria-hidden="true" /></div>}
  </section>;
}

function HistoryChanges({ events, locale, kind, labels, timeFormat }: { events: MoodEvent[]; locale: string; kind: 'mood' | 'energy'; labels: string[]; timeFormat: Intl.DateTimeFormat }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const previous = events.slice(0, -1).reverse();
  const latest = events[events.length - 1];
  const expanded = open || hover;
  const number = new Intl.NumberFormat(LOCALE_META[locale as keyof typeof LOCALE_META].intl).format(Math.max(0, previous.length - 3));
  const groupLabel = locale === 'fa' ? 'نمایش تغییرات قبلی' : 'Show previous entries';
  const icon = (event: MoodEvent, index: number) => {
    if (event.type === 'note') return null;
    const time = event.at === null ? (locale === 'fa' ? 'زمان نامشخص' : 'Time unknown') : timeFormat.format(event.at);
    const label = labels[event.value - 1];
    return <span className={`k-history-icon ${index === -1 ? 'is-latest' : ''}`} key={index} tabIndex={0} title={`${label} · ${time}`} aria-label={`${label} · ${time}`}>{event.type === 'mood' ? <MoodIcon level={event.value} style={{ color: colors[event.value - 1] }} /> : <span className="k-energy-icon" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < event.value ? 'is-filled' : ''} />)}</span>}</span>;
  };
  return <div className="k-history-changes">{latest && icon(latest, -1)}{previous.length > 0 && <div className={`k-history-group ${expanded ? 'is-expanded' : ''}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}><div className="k-history-stack-items" role="button" tabIndex={0} aria-expanded={expanded} aria-label={groupLabel} onClick={() => setOpen(value => !value)} onFocus={() => setHover(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHover(false); }} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setOpen(value => !value); } }}>{previous.map((event, index) => <span className={`k-history-stack-item ${index >= 3 ? 'is-extra' : ''}`} key={index} inert={!expanded && index >= 3} aria-hidden={!expanded && index >= 3 ? true : undefined} style={{ '--stack-index': index } as CSSProperties}>{icon(event, index)}</span>)}{previous.length > 3 && <span className="k-history-overflow" aria-hidden="true">+{number}</span>}</div></div>}</div>;
}

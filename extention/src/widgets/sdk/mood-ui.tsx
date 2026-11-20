import { useState, type CSSProperties, type SVGProps } from 'react';
import { createPortal } from 'react-dom';
import type { MoodLevel } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { levels, colors, moodText } from '../mood-copy';

export function MoodIcon(props: SVGProps<SVGSVGElement> & { level?: MoodLevel }) {
  const { level = 3, ...rest } = props;
  const mouths = ['M8 16 Q12 11 16 16', 'M8 15.5 Q12 12.5 16 15.5', 'M8 14.5 H16', 'M8 13.5 Q12 17 16 13.5', 'M8 13 Q12 19 16 13'];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...rest}><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".7" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r=".7" fill="currentColor" stroke="none"/><path d={mouths[level - 1]} /></svg>;
}
export function MoodChoices({ value, onChange }: { value?: MoodLevel; onChange: (level: MoodLevel) => void }) {
  const { locale } = useI18n(); const text = moodText(locale === 'fa');
  const [burst, setBurst] = useState<{ level: MoodLevel; id: number } | null>(null);
  return <div className="k-mood-choices" role="group" aria-label={text.question}>{levels.map((level) => <button key={level} type="button" title={text.labels[level - 1]} aria-label={text.labels[level - 1]} aria-pressed={value === level} className={`k-mood-choice ${value === level ? 'is-selected' : ''}`} style={{ '--mood-color': colors[level - 1] } as CSSProperties} onClick={() => { setBurst({ level, id: Date.now() }); onChange(level); }}><MoodIcon level={level} />{burst?.level === level && <span key={burst.id} className="k-mood-burst" aria-hidden="true" onAnimationEnd={(event) => { if (event.target === event.currentTarget) setBurst(null); }}>{Array.from({ length: 10 }, (_, i) => <MoodIcon key={i} level={level} style={{ '--particle-x': `${(i - 4.5) * 8}px`, '--particle-delay': `${(i % 5) * 25}ms`, '--particle-y': `${65 + (i % 4) * 9}px` } as CSSProperties} />)}</span>}</button>)}</div>;
}
export function WidgetMoodCard({ value, onChange, onAddNote }: { value?: MoodLevel; onChange: (value: MoodLevel) => void; onAddNote: (note: string) => void }) {
  const { locale, t } = useI18n();
  const text = moodText(locale === 'fa');
  const [writing, setWriting] = useState(false); const [draft, setDraft] = useState('');
  const openNote = () => { setDraft(''); setWriting(true); };
  return <div className="k-mood-widget"><p>{text.question}</p><MoodChoices value={value} onChange={onChange} />{value && <button type="button" className="k-mood-note-link" onClick={openNote}>{locale === 'fa' ? 'می‌خوای درباره حالت بنویسی؟' : 'Want to write about how you feel?'}</button>}{writing && createPortal(<div className="k-journal-overlay"><div className="k-mood-note-popover k-solid" role="dialog" aria-modal="true" aria-labelledby="mood-note-title"><h2 id="mood-note-title">{locale === 'fa' ? 'یادداشت امروز' : 'Today’s note'}</h2><p className="k-journal-hint">{locale === 'fa' ? 'هر یادداشت به‌صورت جداگانه ثبت می‌شه و بعد از ذخیره قابل ویرایش یا حذف نیست.' : 'Each note is saved separately and cannot be edited or deleted afterwards.'}</p><label htmlFor="mood-quick-note">{locale === 'fa' ? 'دوست داری بیشتر درباره حالت بنویسی؟' : 'Would you like to write more about how you feel?'}</label><textarea id="mood-quick-note" autoFocus value={draft} onChange={event => setDraft(event.target.value)} placeholder={locale === 'fa' ? 'هر چیزی دوست داری برای خودت بنویس…' : 'Write anything you want to remember…'} /><div><button type="button" onClick={() => setWriting(false)}>{t('common.cancel')}</button><button type="button" className="k-btn-accent" disabled={!draft.trim()} onClick={() => { onAddNote(draft); setWriting(false); }}>{t('common.save')}</button></div></div></div>, document.body)}</div>;
}

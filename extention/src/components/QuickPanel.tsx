import { actions, activeProject, useAppState } from '@/lib/state';
import { formatCountdown } from '@/lib/time';
import { useI18n } from '@/lib/useI18n';
import { FeedbackList, IdeasList, NotesList } from '@/widgets/ListWidgets';
import { useFocus } from '@/widgets/FocusWidget';
import { useEffect } from 'react';
import { Close, Grid } from './Icons';
import type { PanelKind } from './ui-context';

const TITLES = { idea: 'chip.idea', notes: 'chip.notes', focus: 'chip.focus', tools: 'tools.title', feedback: 'widget.feedback' } as const;
const PRESETS = [15, 25, 45, 60];

export default function QuickPanel({ kind, onClose }: { kind: PanelKind; onClose: () => void }) {
  const project = activeProject(useAppState());
  const { t, locale, n } = useI18n();
  const { focus, running, remaining } = useFocus();

  useEffect(() => {
    if (kind === 'feedback') actions.markFeedbackRead(project.id);
  }, [kind, project.id]);

  return (
    <section className="k-solid k-pop absolute z-50 flex flex-col" style={{ top: 190, left: 0, right: 0, marginInline: 'auto', width: 640, borderRadius: 30, padding: '22px 28px 28px', gap: 18 }}>
      <header className="flex items-center justify-between">
        <h2 className="font-bold" style={{ fontSize: 'calc(28px * var(--k-font-scale, 1))' }}>{t(TITLES[kind])}</h2>
        <button onClick={onClose} aria-label={t('common.close')} className="grid place-items-center rounded-full hover:bg-white/10" style={{ width: 40, height: 40 }}>
          <Close style={{ width: 24, height: 24 }} />
        </button>
      </header>

      {kind === 'idea' && <IdeasList project={project} maxHeight={320} />}
      {kind === 'notes' && <NotesList project={project} maxHeight={320} />}
      {kind === 'feedback' && <FeedbackList project={project} maxHeight={320} />}

      {kind === 'focus' && (
        <div className="flex flex-col items-center" style={{ gap: 22, padding: '10px 0 4px' }}>
          <div dir="ltr" className="tabular-nums" style={{ fontSize: 'calc(96px * var(--k-font-scale, 1))', fontWeight: 200, lineHeight: 1 }}>{formatCountdown(locale, remaining)}</div>
          <div className="flex" style={{ gap: 10 }}>
            {PRESETS.map((m) => (
              <button key={m} onClick={() => actions.setFocusMinutes(m)} className={`rounded-full ${focus.minutes === m ? 'k-btn-accent' : 'border border-white/20 opacity-80 hover:opacity-100'}`} style={{ padding: '8px 18px', fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>
                {t('focus.minutes', { n: m })}
              </button>
            ))}
          </div>
          <button onClick={() => (running ? actions.stopFocus() : actions.startFocus())} className="k-btn-accent rounded-full" style={{ height: 54, padding: '0 48px', fontSize: 'calc(22px * var(--k-font-scale, 1))' }}>
            {running ? t('focus.pause') : t('focus.start')}
          </button>
          <span hidden>{n(0)}</span>
        </div>
      )}

      {kind === 'tools' && (
        <div className="flex flex-col items-center text-center" style={{ padding: '24px 0', gap: 10 }}>
          <Grid className="text-accent" style={{ width: 44, height: 44 }} />
          <p className="font-bold text-accent" style={{ fontSize: 'calc(22px * var(--k-font-scale, 1))' }}>{t('tools.soon')}</p>
          <p className="opacity-75" style={{ fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>{t('tools.soonText')}</p>
        </div>
      )}
    </section>
  );
}

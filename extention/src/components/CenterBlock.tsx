import { useState, type CSSProperties } from 'react';
import { runSearch } from '@/lib/search';
import { useI18n } from '@/lib/useI18n';
import { Bulb, Grid, NoteIcon, Search, Target } from './Icons';
import { useUi, type PanelKind } from './ui-context';

const centered: CSSProperties = { position: 'absolute', left: 0, right: 0, marginInline: 'auto' };

/** Clock, date, search and quick-action chips. `compact` = there are widgets around it. */
export default function CenterBlock({ compact }: { compact: boolean; layout: boolean }) {
  const { t } = useI18n();
  const { openPanel } = useUi();
  const [q, setQ] = useState('');
  const pos = compact ? { search: 420, chips: 521 } : { search: 481, chips: 587 };
  const chips: { k: PanelKind; label: string; Icon: typeof Bulb }[] = [
    { k: 'idea', label: t('chip.idea'), Icon: Bulb },
    { k: 'notes', label: t('chip.notes'), Icon: NoteIcon },
    { k: 'focus', label: t('chip.focus'), Icon: Target },
    { k: 'tools', label: t('chip.tools'), Icon: Grid },
  ];

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(q);
        }}
        className="k-search k-pill flex items-center rounded-full"
        style={{ ...centered, top: pos.search, width: 750, height: 73, padding: '0 36px', gap: 18, transition: 'top .3s' }}
      >
        <Search className="shrink-0" style={{ width: 30, height: 30 }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('search.placeholder')}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/60"
          style={{ fontSize: 'calc(24px * var(--k-font-scale, 1))' }}
        />
      </form>

      <div className="k-chips flex justify-center" style={{ ...centered, top: pos.chips, width: 900, gap: 20, transition: 'top .3s' }}>
        {chips.map(({ k, label, Icon }) => (
          <button key={k} onClick={() => openPanel(k)} className="k-pill flex items-center rounded-full hover:bg-white/10" style={{ height: 50, padding: '0 24px', gap: 11, fontSize: 'calc(21px * var(--k-font-scale, 1))' }}>
            <Icon style={{ width: 28, height: 28 }} /> {label}
          </button>
        ))}
      </div>
    </>
  );
}

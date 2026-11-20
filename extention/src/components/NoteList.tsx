import { useState } from 'react';
import type { Note } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { Close } from './Icons';

export default function NoteList({
  items,
  placeholder,
  empty,
  onAdd,
  onRemove,
  maxHeight = 240,
}: {
  items: Note[];
  placeholder: string;
  empty: string;
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  maxHeight?: number;
}) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <input
        value={text}
        autoFocus
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && text.trim()) {
            onAdd(text.trim());
            setText('');
          }
        }}
        placeholder={placeholder}
        className="k-field rounded-2xl outline-none focus:border-accent"
        style={{ padding: '12px 16px', fontSize: 'calc(20px * var(--k-font-scale, 1))' }}
      />
      {items.length === 0 ? (
        <p className="opacity-60" style={{ fontSize: 'calc(18px * var(--k-font-scale, 1))' }}>{empty}</p>
      ) : (
        <ul className="flex flex-col overflow-y-auto" style={{ gap: 8, maxHeight }}>
          {items.map((n) => (
            <li key={n.id} className="group flex items-start rounded-2xl bg-white/[0.06]" style={{ gap: 8, padding: '10px 14px', fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>
              <span className="flex-1 break-words">{n.text}</span>
              <button title={t('common.delete')} onClick={() => onRemove(n.id)} className="opacity-0 group-hover:opacity-80" style={{ marginTop: 3 }}>
                <Close style={{ width: 18, height: 18 }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

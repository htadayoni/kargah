import { useState } from 'react';
import { actions } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';

export default function NewProjectDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const create = () => {
    if (name.trim()) {
      actions.addProject(name.trim());
      onClose();
    }
  };
  return (
    <section className="k-solid k-pop absolute z-50 flex flex-col" style={{ top: 300, left: 0, right: 0, marginInline: 'auto', width: 480, borderRadius: 28, padding: 28, gap: 18 }}>
      <h2 className="font-bold" style={{ fontSize: 'calc(26px * var(--k-font-scale, 1))' }}>{t('project.new')}</h2>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && create()}
        placeholder={t('project.namePlaceholder')}
        className="k-field rounded-2xl outline-none focus:border-accent"
        style={{ padding: '14px 18px', fontSize: 'calc(22px * var(--k-font-scale, 1))' }}
      />
      <div className="flex" style={{ gap: 12 }}>
        <button onClick={create} className="k-btn-accent rounded-full" style={{ height: 48, padding: '0 32px', fontSize: 'calc(20px * var(--k-font-scale, 1))' }}>{t('common.add')}</button>
        <button onClick={onClose} className="rounded-full opacity-75 hover:opacity-100" style={{ padding: '0 18px', fontSize: 'calc(20px * var(--k-font-scale, 1))' }}>{t('common.cancel')}</button>
      </div>
    </section>
  );
}

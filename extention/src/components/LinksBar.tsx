import { useState } from 'react';
import { actions, type Project } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import BrandIcon from './BrandIcon';
import { Close, Plus } from './Icons';

export default function LinksBar({ project }: { project: Project }) {
  const { t } = useI18n();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const submit = () => {
    if (!url.trim()) return;
    try {
      actions.addLink(project.id, title, url.trim());
    } catch {
      return;
    }
    setTitle('');
    setUrl('');
    setAdding(false);
  };

  return (
    <div className="k-links absolute flex justify-center" style={{ bottom: 38, left: 0, right: 0 }}>
      <div className="relative">
        {adding && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setAdding(false)} />
            <div className="k-solid k-pop absolute z-20 flex flex-col rounded-3xl" style={{ bottom: 72, insetInlineEnd: 0, width: 360, padding: 18, gap: 10 }}>
              <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('links.title')} className="k-field rounded-xl outline-none focus:border-accent" style={{ padding: '10px 14px', fontSize: 'calc(19px * var(--k-font-scale, 1))' }} />
              <input
                dir="ltr"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder={t('links.url')}
                className="k-field rounded-xl outline-none focus:border-accent"
                style={{ padding: '10px 14px', fontSize: 'calc(19px * var(--k-font-scale, 1))' }}
              />
              <button onClick={submit} className="k-btn-accent rounded-full" style={{ height: 44, fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>
                {t('links.add')}
              </button>
            </div>
          </>
        )}
        <nav className="k-pill flex items-center rounded-full" style={{ height: 57, padding: '0 6px' }}>
          {project.links.map((l, i) => (
            <div key={l.id} className="group relative flex items-center">
              {i > 0 && <span className="k-divider" style={{ width: 1, height: 28 }} />}
              <a href={l.url} className="flex items-center rounded-full hover:bg-white/10" style={{ height: 45, padding: '0 20px', gap: 10, fontSize: 'calc(21px * var(--k-font-scale, 1))' }}>
                <BrandIcon url={l.url} title={l.title} />
                {l.title}
              </a>
              <button
                onClick={() => actions.removeLink(project.id, l.id)}
                title={t('links.remove')}
                className="absolute hidden place-items-center rounded-full bg-black/60 group-hover:grid"
                style={{ top: -6, insetInlineEnd: 6, width: 20, height: 20 }}
              >
                <Close style={{ width: 12, height: 12 }} />
              </button>
            </div>
          ))}
          {project.links.length > 0 && <span className="k-divider" style={{ width: 1, height: 28 }} />}
          <button onClick={() => setAdding(true)} aria-label={t('links.add')} className="grid place-items-center rounded-full hover:bg-white/10" style={{ width: 52, height: 45 }}>
            <Plus style={{ width: 28, height: 28 }} />
          </button>
        </nav>
      </div>
    </div>
  );
}

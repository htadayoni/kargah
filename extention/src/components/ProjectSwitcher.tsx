import { useState } from 'react';
import { actions, activeProject, useAppState } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { ChevronR } from './Icons';

export default function ProjectSwitcher({ onNew }: { onNew: () => void }) {
  const state = useAppState();
  const project = activeProject(state);
  const { t } = useI18n();
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const many = state.projects.length > 1;
  const idx = state.projects.findIndex((p) => p.id === project.id);

  const arrow = 'grid place-items-center rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <div className="k-switcher absolute" style={{ top: 24, left: 0, right: 0, margin: 'auto', width: 327 }}>
      <div className="k-pill flex items-center justify-between rounded-full" style={{ height: 48, padding: '0 4px' }}>
        <button disabled={!many} onClick={() => actions.cycleProject(-1)} aria-label={t('project.prev')} className={arrow} style={{ width: 44, height: 40 }}>
          <ChevronR className="rotate-180 rtl:rotate-0" style={{ width: 22, height: 22 }} />
        </button>
        {renaming ? (
          <input
            autoFocus
            defaultValue={project.name}
            placeholder={t('project.namePlaceholder')}
            onBlur={(e) => (actions.renameProject(project.id, e.currentTarget.value.trim()), setRenaming(false))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') setRenaming(false);
            }}
            className="min-w-0 flex-1 bg-transparent text-center outline-none"
            style={{ fontSize: 'calc(25px * var(--k-font-scale, 1))', fontWeight: 500 }}
          />
        ) : (
          <button onClick={() => setMenu((v) => !v)} className="min-w-0 flex-1 truncate font-medium" style={{ fontSize: 'calc(25px * var(--k-font-scale, 1))' }}>
            {project.name || t('project.my')}
          </button>
        )}
        <button disabled={!many} onClick={() => actions.cycleProject(1)} aria-label={t('project.next')} className={arrow} style={{ width: 44, height: 40 }}>
          <ChevronR className="rtl:rotate-180" style={{ width: 22, height: 22 }} />
        </button>
      </div>

      {/* page dots */}
      <div className="flex justify-center" style={{ gap: 15, marginTop: 14 }}>
        {state.projects.map((p, i) => (
          <button key={p.id} onClick={() => actions.selectProject(p.id)} aria-label={p.name || t('project.my')} className="rounded-full" style={{ width: 12, height: 12, background: i === idx ? '#fff' : 'rgb(255 255 255 / .38)' }} />
        ))}
      </div>

      {menu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
          <div className="k-solid k-pop absolute z-20 rounded-2xl" style={{ top: 56, left: 0, right: 0, padding: 8, fontSize: 'calc(20px * var(--k-font-scale, 1))' }}>
            <button onClick={() => (setRenaming(true), setMenu(false))} className="block w-full rounded-xl text-start hover:bg-white/10" style={{ padding: '10px 14px' }}>
              {t('project.rename')}
            </button>
            <button onClick={() => (onNew(), setMenu(false))} className="block w-full rounded-xl text-start hover:bg-white/10" style={{ padding: '10px 14px' }}>
              {t('project.new')}
            </button>
            {many && idx > 0 && (
              <button onClick={() => { if (window.confirm(t('project.deleteConfirm'))) actions.deleteProject(project.id); setMenu(false); }} className="block w-full rounded-xl text-start text-red-300 hover:bg-white/10" style={{ padding: '10px 14px' }}>
                {t('project.delete')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

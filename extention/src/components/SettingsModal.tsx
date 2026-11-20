import type { ReactNode } from 'react';
import { actions, activeProject, useAppState, type FontSize } from '@/lib/state';
import { LOCALES, LOCALE_META, type Locale } from '@/lib/i18n';
import { THEMES } from '@/lib/themes';
import { useI18n } from '@/lib/useI18n';
import BackgroundEditor from './BackgroundEditor';
import { Check, ChevronDown, Close } from './Icons';

export default function SettingsModal({ onClose, appearance = false }: { onClose: () => void; appearance?: boolean }) {
  const state = useAppState();
  const project = activeProject(state);
  const { settings } = state;
  const { t } = useI18n();

  return (
    <aside
      className="k-settings k-solid k-slide absolute z-50 flex flex-col"
      style={{ top: 22, left: 22, width: 500, height: 736, borderRadius: 26, padding: '14px 28px 28px', overflowY: 'auto' }}
    >
      <header className="flex items-center justify-between" style={{ height: 76 }}>
        <h2 className="font-bold" style={{ fontSize: 'calc(31px * var(--k-font-scale, 1))' }}>{t(appearance ? 'settings.appearance' : 'settings.title')}</h2>
        <button onClick={onClose} aria-label={t('common.close')} className="grid place-items-center rounded-full opacity-85 hover:bg-white/10 hover:opacity-100" style={{ width: 44, height: 44 }}>
          <Close style={{ width: 28, height: 28 }} />
        </button>
      </header>

      {!appearance && <>
      <Row label={t('settings.language')}>
        <Select value={settings.locale} onChange={(v) => actions.setLocale(v as Locale)}>
          {LOCALES.map((l) => <option key={l} value={l}>{LOCALE_META[l].label}</option>)}
        </Select>
      </Row>
      <Row label={t('settings.startDesk')}>
        <Select value={settings.startProject} onChange={(v) => actions.setStartProject(v)}>
          <option value="last">{t('settings.startLast')}</option>
          {state.projects.map((p) => <option key={p.id} value={p.id}>{p.name || t('project.my')}</option>)}
        </Select>
      </Row>

      </>}
      {appearance && <>
      <Row label={t('settings.theme')}>
        <div className="flex" style={{ gap: 14 }}>
          {THEMES.map((th) => {
            const on = project.theme === th.id;
            return (
              <button
                key={th.id}
                title={t(`theme.${th.id}` as const)}
                aria-label={t(`theme.${th.id}` as const)}
                aria-pressed={on}
                onClick={() => actions.setTheme(project.id, th.id)}
                className="relative grid place-items-center rounded-full"
                style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${th.swatch[0]} 50%, ${th.swatch[1]} 50%)`, border: on ? '3px solid #fff' : '1px solid rgb(255 255 255 / .3)' }}
              >
                {on && <Check style={{ width: 0, height: 0 }} />}
              </button>
            );
          })}
        </div>
      </Row>

      <Row label={t('settings.fontSize')}>
        <div role="group" aria-label={t('settings.fontSize')} className="flex rounded-full border border-white/25 bg-white/[0.04]" style={{ height: 54, width: 296, padding: 3 }}>
          {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={(settings.fontSize ?? 'medium') === size}
              onClick={() => actions.setFontSize(size)}
              className="flex-1 rounded-full"
              style={{ fontSize: 'calc(18px * var(--k-font-scale, 1))', background: (settings.fontSize ?? 'medium') === size ? 'rgb(var(--k-accent) / .38)' : undefined }}
            >
              {t(size === 'small' ? 'settings.fontSmall' : size === 'large' ? 'settings.fontLarge' : 'settings.fontMedium')}
            </button>
          ))}
        </div>
      </Row>

      <section style={{ paddingTop: 22 }}>
        <h3 className="font-semibold" style={{ fontSize: 'calc(22px * var(--k-font-scale, 1))', marginBottom: 16 }}>{t('settings.background')}</h3>
        <BackgroundEditor project={project} />
      </section>
      </>}
    </aside>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-white/[0.16]" style={{ minHeight: 120, gap: 16 }}>
      <span style={{ fontSize: 'calc(24px * var(--k-font-scale, 1))' }}>{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <div className="relative" style={{ width: 296 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="k-field w-full cursor-pointer appearance-none rounded-2xl outline-none focus:border-accent"
        style={{ height: 54, paddingInlineStart: 22, paddingInlineEnd: 52, fontSize: 'calc(23px * var(--k-font-scale, 1))', color: '#fff' }}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 -translate-y-1/2" style={{ width: 26, height: 26, insetInlineEnd: 18 }} />
    </div>
  );
}

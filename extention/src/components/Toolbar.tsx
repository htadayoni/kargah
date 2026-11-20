import { useEffect, useRef, useState } from 'react';
import { actions } from '@/lib/state';
import { LOCALES, LOCALE_META } from '@/lib/i18n';
import { useI18n } from '@/lib/useI18n';
import { useMockFeatures } from '@/lib/featureFlags';
import { Gear, Globe, Plus, Sliders } from './Icons';

import LanguageFlag from './LanguageFlag';

export default function Toolbar({
  layout,
  onLayout,
  onSettings,
  onAppearance,
  onAddWidget,
}: {
  layout: boolean;
  onLayout: (v: boolean) => void;
  onSettings: () => void;
  onAppearance: () => void;
  onAddWidget: () => void;
}) {
  const { t, locale } = useI18n();
  const [developerMode, setDeveloperMode] = useMockFeatures();
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setLanguageOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, []);
  const style = { top: 38, insetInlineEnd: 44, height: 51 };

  if (layout) {
    return (
      <button onClick={() => onLayout(false)} className="k-toolbar k-pill absolute rounded-full font-semibold" style={{ ...style, padding: '0 30px', fontSize: 'calc(22px * var(--k-font-scale, 1))' }}>
        {t('toolbar.doneLayout')}
      </button>
    );
  }
  const btn = 'k-toolbar-button flex items-center justify-center';
  const div = <span className="k-divider" style={{ width: 1, height: 28 }} />;
  return (
    <div className="k-toolbar k-pill absolute z-30 flex items-center rounded-full" style={{ ...style, paddingInline: 4 }}>
      <button onClick={onAppearance} title={t('settings.appearance')} aria-label={t('settings.appearance')} className={btn} style={{ height: 43, width: 62 }}>
        <Sliders style={{ width: 26, height: 26 }} />
      </button>
      {div}
      <div ref={languageRef} className="relative" onMouseEnter={() => setLanguageOpen(true)} onMouseLeave={() => setLanguageOpen(false)}>
        <button type="button" onClick={() => setLanguageOpen((open) => !open)} title={t('toolbar.language')} aria-label={t('toolbar.language')} aria-haspopup="true" aria-expanded={languageOpen} className={btn} style={{ height: 43, padding: '0 20px', gap: 8, fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>
          <Globe style={{ width: 26, height: 26 }} /> {locale.toUpperCase()}
        </button>
        {languageOpen && <div className="absolute z-50" style={{ top: '100%', insetInlineStart: 0, paddingTop: 8 }}>
          <div dir="ltr" className="k-solid k-pop rounded-2xl" style={{ width: 210, maxHeight: 'min(600px, 70vh)', overflowY: 'auto', padding: 7 }}>
            {LOCALES.map((language) => <button key={language} type="button" lang={language} dir="ltr" aria-pressed={locale === language} onClick={() => { actions.setLocale(language); setLanguageOpen(false); }} className="flex w-full items-center justify-between rounded-xl text-start hover:bg-white/10" style={{ padding: '8px 12px', fontSize: 'calc(18px * var(--k-font-scale, 1))', background: locale === language ? 'rgb(255 255 255 / .12)' : undefined }}>
              <span className="flex min-w-0 items-center" style={{ gap: 10 }}><LanguageFlag language={language} /><span dir="auto">{LOCALE_META[language].label}</span></span>{locale === language && <span aria-hidden="true">✓</span>}
            </button>)}
          </div>
        </div>}
      </div>
      {div}
      <button onClick={onSettings} title={t('toolbar.settings')} aria-label={t('toolbar.settings')} className={btn} style={{ height: 43, width: 62 }}>
        <Gear style={{ width: 26, height: 26 }} />
      </button>
      {div}
      {import.meta.env.DEV && <><button type="button" className={`${btn} k-developer-button`} aria-pressed={developerMode} title={locale === 'fa' ? 'حالت توسعه و داده‌های آزمایشی' : 'Developer mode and mock data'} onClick={() => setDeveloperMode(!developerMode)} style={{ height: 43, padding: '0 16px', gap: 7, fontSize: 'calc(17px * var(--k-font-scale, 1))' }}><span aria-hidden="true">{'</>'}</span><span>{locale === 'fa' ? 'توسعه' : 'Dev'}</span><span className={`k-developer-dot ${developerMode ? 'is-active' : ''}`} aria-hidden="true" /></button>{div}</>}
      <button onClick={onAddWidget} className={btn} style={{ height: 43, padding: '0 22px', gap: 8, fontSize: 'calc(21px * var(--k-font-scale, 1))' }}>
        <Plus style={{ width: 24, height: 24 }} /> {t('toolbar.addWidget')}
      </button>
    </div>
  );
}

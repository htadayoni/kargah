import { useEffect } from 'react';
import { activeProject, retryStorage, useAppState } from '@/lib/state';
import { LOCALE_META, translate } from '@/lib/i18n';
import Scene from '@/components/Scene';
import Workspace from '@/components/Workspace';

/** Overall UI size: 1 = the 1672x941 reference design fills the window exactly. */
const SCALE_FACTOR = 1;

export default function App() {
  const state = useAppState();
  const { locale } = state.settings;
  const project = activeProject(state);

  useEffect(() => {
    const fit = () => document.documentElement.style.setProperty('--s', String(Math.min(innerWidth / 1672, innerHeight / 941) * SCALE_FACTOR));
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const meta = LOCALE_META[locale];
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.dir;
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = project.theme;
  }, [project.theme]);

  const error = state.storageError && (
    <div role="alert" style={{ position: 'fixed', zIndex: 10000, top: 12, left: '50%', transform: 'translateX(-50%)', background: '#642929', color: 'white', borderRadius: 12, padding: '12px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
      {translate(locale, state.storageError === 'load' ? 'storage.loadError' : 'storage.saveError')}
      <button onClick={retryStorage} style={{ textDecoration: 'underline' }}>{translate(locale, 'storage.retry')}</button>
    </div>
  );
  if (!state.ready) return error;

  return (
    <>
      {error}
      <Scene bg={project.bg} />
      <div className="k-stage" data-font-size={state.settings.fontSize ?? 'medium'}><Workspace /></div>
    </>
  );
}

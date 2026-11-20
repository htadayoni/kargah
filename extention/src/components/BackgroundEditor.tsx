import { useRef, useState } from 'react';
import { actions, type Project } from '@/lib/state';
import { BACKGROUNDS, SOLID_COLORS, backgroundForHour, backgroundUrl, type BackgroundConfig, type BgMode } from '@/lib/themes';
import { useI18n } from '@/lib/useI18n';
import { Check, Upload } from './Icons';

const MODES: BgMode[] = ['scene', 'solid', 'photo'];

async function fileToDataUrl(file: File, maxW = 2000): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxW / bmp.width);
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}

export default function BackgroundEditor({ project }: { project: Project }) {
  const { t } = useI18n();
  const bg = project.bg;
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const apply = (patch: Partial<BackgroundConfig>) => actions.setBackground(project.id, { ...bg, ...patch });
  const activeScene = bg.sync ? backgroundForHour(new Date().getHours()) : bg.scene;

  const upload = async (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    apply({ mode: 'photo', photo: await fileToDataUrl(file) });
  };

  return (
    <div className="flex flex-col" style={{ gap: 18 }}>
      <div className="flex rounded-full border border-white/15 bg-white/[0.04]" style={{ height: 50, padding: 3 }}>
        {MODES.map((m) => (
          <button key={m} onClick={() => apply({ mode: m })} className={`flex-1 rounded-full transition ${bg.mode === m ? 'k-btn-accent' : 'opacity-80 hover:opacity-100'}`} style={{ fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>
            {t(`bg.mode.${m}` as const)}
          </button>
        ))}
      </div>

      {bg.mode === 'scene' && (
        <>
          <div className="grid grid-cols-3" style={{ gap: 12 }}>
            {BACKGROUNDS.map((id) => {
              const on = activeScene === id;
              return (
                <button key={id} onClick={() => apply({ scene: id, sync: false })} aria-pressed={on} className="relative" style={{ height: 118 }}>
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      borderRadius: 18,
                      border: on ? '3px solid rgb(var(--k-accent))' : '1px solid rgb(255 255 255 / .16)',
                      backgroundImage: `linear-gradient(180deg, transparent 50%, rgb(10 18 40 / .8)), url(${backgroundUrl(id)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center bottom',
                    }}
                  />
                  <span className="absolute inset-x-0 text-center" style={{ bottom: 10, fontSize: 'calc(18px * var(--k-font-scale, 1))' }}>{t(`bg.${id}` as const)}</span>
                  {on && (
                    <span className="absolute grid place-items-center rounded-full bg-accent text-accent-ink" style={{ top: -8, insetInlineStart: -6, width: 30, height: 30 }}>
                      <Check style={{ width: 18, height: 18, strokeWidth: 3 }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-full border border-white/12 bg-white/[0.04]" style={{ height: 54, padding: '0 22px' }}>
            <span className="font-semibold" style={{ fontSize: 'calc(19px * var(--k-font-scale, 1))' }}>{t('bg.sync')}</span>
            <Switch on={bg.sync} onChange={(v) => apply({ sync: v })} />
          </label>
        </>
      )}

      {bg.mode === 'solid' && (
        <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
          {SOLID_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => apply({ solid: c })}
              aria-label={c}
              className="grid place-items-center rounded-full"
              style={{ width: 48, height: 48, background: c, border: bg.solid === c ? '3px solid rgb(var(--k-accent))' : '1px solid rgb(255 255 255 / .22)' }}
            >
              {bg.solid === c && <Check className="text-accent" style={{ width: 22, height: 22, strokeWidth: 2.6 }} />}
            </button>
          ))}
          <label className="relative grid cursor-pointer place-items-center overflow-hidden rounded-full" title={t('bg.customColor')} style={{ width: 48, height: 48, background: 'conic-gradient(#f66,#fd6,#6f9,#6df,#96f,#f6c,#f66)' }}>
            <span className="absolute rounded-full" style={{ inset: 5, background: 'rgb(var(--k-surface))' }} />
            <span className="relative text-accent" style={{ fontSize: 'calc(24px * var(--k-font-scale, 1))' }}>+</span>
            <input type="color" value={bg.solid} onChange={(e) => apply({ solid: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
          </label>
        </div>
      )}

      {bg.mode !== 'solid' && (
        <>
          <div
            onDragOver={(e) => (e.preventDefault(), setDrag(true))}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => (e.preventDefault(), setDrag(false), void upload(e.dataTransfer.files[0]))}
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden text-center transition ${drag ? 'bg-accent/10' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}
            style={{
              height: bg.mode === 'photo' && bg.photo ? 130 : 84,
              borderRadius: 22,
              border: `2px dashed ${drag ? 'rgb(var(--k-accent))' : 'rgb(255 255 255 / .3)'}`,
              gap: 4,
              backgroundImage: bg.mode === 'photo' && bg.photo ? `linear-gradient(rgb(10 18 40 / .55), rgb(10 18 40 / .75)), url(${bg.photo})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Upload className="text-accent" style={{ width: 28, height: 28 }} />
            <span style={{ fontSize: 'calc(18px * var(--k-font-scale, 1))' }}>{bg.mode === 'photo' && bg.photo ? t('bg.replace') : t('bg.upload')}</span>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => void upload(e.target.files?.[0])} />
          </div>
          {bg.mode === 'photo' && bg.photo && (
            <button onClick={() => apply({ photo: null, mode: 'scene' })} className="self-center text-red-300 hover:text-red-200" style={{ fontSize: 'calc(17px * var(--k-font-scale, 1))' }}>
              {t('bg.remove')}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={(e) => (e.preventDefault(), onChange(!on))} className="relative rounded-full transition-colors" style={{ width: 56, height: 32, background: on ? 'rgb(var(--k-accent))' : 'rgb(255 255 255 / .2)' }}>
      <span className="absolute rounded-full bg-white transition-all" style={{ top: 4, width: 24, height: 24, insetInlineStart: on ? 28 : 4, boxShadow: '0 2px 5px rgb(0 0 0 / .35)' }} />
    </button>
  );
}

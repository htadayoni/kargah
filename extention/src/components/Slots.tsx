import { useEffect, useState, type CSSProperties } from 'react';
import { actions, SLOT_ORDER, type Project, type SlotId } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { WIDGETS } from '@/widgets/registry';
import WidgetErrorBoundary, { WidgetRender } from './WidgetErrorBoundary';
import { Grip, Plus } from './Icons';
import { useMockFeatures } from '@/lib/featureFlags';

type Box = { side: 'end' | 'start' | 'center'; x: number; top: number; w: number; h: number; label: 'slot.widget' | 'slot.tall' | 'slot.wide' };
export const SLOT_BOX: Record<SlotId, Box> = {
  c1: { side: 'center', x: 0, top: 142, w: 735, h: 223, label: 'slot.wide' },
  e1: { side: 'end', x: 52, top: 142, w: 383, h: 223, label: 'slot.widget' },
  e2: { side: 'end', x: 52, top: 397, w: 342, h: 172, label: 'slot.widget' },
  e3: { side: 'end', x: 51, top: 591, w: 377, h: 182, label: 'slot.tall' },
  s1: { side: 'start', x: 50, top: 142, w: 384, h: 223, label: 'slot.widget' },
  s2: { side: 'start', x: 51, top: 397, w: 342, h: 171, label: 'slot.widget' },
  s3: { side: 'start', x: 49, top: 591, w: 378, h: 182, label: 'slot.tall' },
  c3: { side: 'center', x: 0, top: 612, w: 760, h: 140, label: 'slot.wide' },
};

function boxStyle(b: Box): CSSProperties {
  const s: CSSProperties = { position: 'absolute', top: b.top, width: b.w, height: b.h };
  if (b.side === 'end') s.insetInlineEnd = b.x;
  else if (b.side === 'start') s.insetInlineStart = b.x;
  else Object.assign(s, { left: 0, right: 0, marginInline: 'auto' });
  return s;
}

export default function Slots({
  project,
  layout,
  onPick,
  onWidgetSettings,
}: {
  project: Project;
  layout: boolean;
  /** open the widget picker for this slot */
  onPick: (slot: SlotId) => void;
  onWidgetSettings: (type: import('@/lib/state').WidgetType) => void;
}) {
  const { t, locale } = useI18n();
  const [mockEnabled] = useMockFeatures();
  const [menu, setMenu] = useState<SlotId | null>(null);
  useEffect(() => { setMenu(null); }, [layout, project.id]);

  return (
    <>
      {SLOT_ORDER.map((slot) => {
        const box = SLOT_BOX[slot];
        const type = project.slots[slot];
        const def = type ? WIDGETS[type] : null;
        if (def?.experimental && !mockEnabled && !layout) return null;
        const dnd = layout
          ? {
              onDragOver: (e: React.DragEvent) => e.preventDefault(),
              onDrop: (e: React.DragEvent) => {
                e.preventDefault();
                const from = e.dataTransfer.getData('text/kargah-slot') as SlotId;
                if (from) actions.moveSlot(project.id, from, slot);
              },
            }
          : {};

        if (!def) {
          if (!layout) return null;
          return (
            <button
              key={slot}
              onClick={() => onPick(slot)}
              {...dnd}
              className="k-slot k-dashed flex items-center justify-center hover:bg-white/5"
              style={{ ...boxStyle(box), borderRadius: 28, gap: 10, fontSize: 'calc(24px * var(--k-font-scale, 1))' }}
            >
              {t(box.label)} <Plus style={{ width: 26, height: 26 }} />
            </button>
          );
        }

        const Icon = def.Icon;
        void Icon;
        return (
          <div
            key={slot}
            {...dnd}
            draggable={layout}
            role={!!def.settings && !!def.openSettingsOnClick && !layout ? 'button' : undefined}
            tabIndex={!!def.settings && !!def.openSettingsOnClick && !layout ? 0 : undefined}
            aria-label={!!def.settings && !!def.openSettingsOnClick && !layout ? t('widget.settings') : undefined}
            onClick={def.settings && def.openSettingsOnClick && !layout && type ? () => onWidgetSettings(type) : undefined}
            onKeyDown={!!def.settings && !!def.openSettingsOnClick && !layout ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (type) onWidgetSettings(type); } } : undefined}
            onDragStart={(e) => e.dataTransfer.setData('text/kargah-slot', slot)}
            className={`k-slot ${def.appearance === 'clock' ? 'k-clock-slot' : 'k-card'} flex flex-col`}
            style={{ ...boxStyle(box), borderRadius: 'var(--widget-radius)', padding: def.untitled ? 'var(--widget-padding-compact)' : 'var(--widget-padding)', cursor: layout ? 'grab' : def.settings && def.openSettingsOnClick ? 'pointer' : undefined }}
          >
            {!def.untitled && <div className="k-slot-heading shrink-0" style={{ paddingInlineEnd: layout ? 40 : 0 }}><h3 className="font-medium" style={{ fontSize: 'calc(21px * var(--k-font-scale, 1))', opacity: 0.92 }}>{t(def.titleKey)}</h3>{def.header && !layout && <def.header />}</div>}
            <div className="min-h-0 flex-1" style={{ pointerEvents: layout ? 'none' : undefined }}><WidgetErrorBoundary key={`${project.id}:${type}`} message={locale === 'fa' ? 'نمایش این ویجت با مشکل مواجه شد.' : 'This widget could not be displayed.'}><WidgetRender render={() => def.render(project)} /></WidgetErrorBoundary></div>

            {layout && <button
              onClick={() => setMenu(menu === slot ? null : slot)}
              aria-label={t('widget.remove')}
              aria-expanded={menu === slot}
              aria-haspopup="true"
              className="absolute opacity-55 hover:opacity-100"
              style={{ top: 16, insetInlineEnd: 16, width: 30, height: 30 }}
            >
              <Grip style={{ width: 26, height: 26 }} />
            </button>}
            {layout && menu === slot && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                <div className="k-solid k-pop absolute z-20 rounded-2xl" style={{ top: 48, insetInlineEnd: 12, padding: 6, fontSize: 'calc(19px * var(--k-font-scale, 1))', minWidth: 170 }}>
                  {!!def.settings && <button onClick={() => { setMenu(null); if (type) onWidgetSettings(type); }} className="block w-full rounded-xl text-start hover:bg-white/10" style={{ padding: '9px 14px' }}>{t('widget.settings')}</button>}
                  <button
                    onClick={() => (actions.removeWidget(project.id, slot), setMenu(null))}
                    className="block w-full rounded-xl text-start text-red-300 hover:bg-white/10"
                    style={{ padding: '9px 14px' }}
                  >
                    {t('widget.remove')}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

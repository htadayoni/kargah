import { useEffect, useMemo, useState } from 'react';
import { activeProject, useAppState, type SlotId, type WidgetType } from '@/lib/state';
import { Lantern } from './Icons';
import { useI18n } from '@/lib/useI18n';
import Toolbar from './Toolbar';
import ProjectSwitcher from './ProjectSwitcher';
import CenterBlock from './CenterBlock';
import Slots from './Slots';
import LinksBar from './LinksBar';
import Overlay from './Overlay';
import SettingsModal from './SettingsModal';
import { WIDGETS } from '@/widgets/registry';
import QuickPanel from './QuickPanel';
import WidgetPicker from './WidgetPicker';
import FundingDetail from '@/widgets/FundingDetail';
import { useMockFeatures } from '@/lib/featureFlags';
import MoodDetail from '@/widgets/MoodDetail';
import NewProjectDialog from './NewProjectDialog';
import { UiContext, type PanelKind } from './ui-context';

type Modal = { kind: 'funding' } | { kind: 'mood' } |  { kind: 'settings' } | { kind: 'appearance' } | { kind: 'widgetSettings'; widget: WidgetType } | { kind: 'panel'; panel: PanelKind } | { kind: 'picker'; slot: SlotId | null } | { kind: 'newProject' } | null;

export default function Workspace() {
  const project = activeProject(useAppState());
  const { t } = useI18n();
  const [mockEnabled] = useMockFeatures();
  const [layout, setLayout] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const close = () => setModal(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (modal) close();
      else setLayout(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  const ui = useMemo(
    () => ({ openPanel: (panel: PanelKind) => setModal({ kind: 'panel', panel }), newProject: () => setModal({ kind: 'newProject' }), openMood: () => setModal({ kind: 'mood' }), openFunding: () => setModal({ kind: 'funding' }) }),
    [],
  );
  const hasWidgets = Object.keys(project.slots).length > 0;
  const dimmed = modal?.kind === 'settings' || modal?.kind === 'appearance' || modal?.kind === 'widgetSettings';

  return (
    <UiContext.Provider value={ui}>
      <div className="k-workspace absolute inset-0 transition-opacity duration-300" style={{ opacity: dimmed ? 0.1 : 1, pointerEvents: dimmed ? 'none' : undefined }}>
        {/* Logo */}
        <div className="k-logo absolute flex items-center" style={{ top: 40, insetInlineStart: 50, gap: 14 }}>
          <Lantern style={{ width: 34, height: 48 }} />
          <span className="font-medium" style={{ fontSize: 'calc(29px * var(--k-font-scale, 1))' }}>{t('appName')}</span>
        </div>

        <Toolbar layout={layout} onLayout={setLayout} onSettings={() => setModal({ kind: 'settings' })} onAppearance={() => setModal({ kind: 'appearance' })} onAddWidget={() => setLayout(true)} />
        <ProjectSwitcher onNew={ui.newProject} />
        <CenterBlock compact={hasWidgets || layout} layout={layout} />
        <Slots project={project} layout={layout} onPick={(slot) => setModal({ kind: 'picker', slot })} onWidgetSettings={(widget) => setModal({ kind: 'widgetSettings', widget })} />
        <LinksBar project={project} />
      </div>

      {modal?.kind === 'funding' && mockEnabled && <Overlay onClose={close} darkness={0.65} fullBleed><FundingDetail project={project} onClose={close} /></Overlay>}
      {modal?.kind === 'mood' && <Overlay onClose={close} darkness={0.65} fullBleed><MoodDetail onClose={close} /></Overlay>}
      {modal?.kind === 'settings' && (
        <Overlay onClose={close} dim={false}>
          <SettingsModal onClose={close} />
        </Overlay>
      )}
      {modal?.kind === 'appearance' && (
        <Overlay onClose={close} dim={false}>
          <SettingsModal onClose={close} appearance />
        </Overlay>
      )}
      {modal?.kind === 'widgetSettings' && (
        <Overlay onClose={close} dim={false}>{(() => { const Settings = WIDGETS[modal.widget]?.settings; return Settings ? <Settings project={project} onClose={close} /> : null; })()}</Overlay>
      )}
      {modal?.kind === 'panel' && (
        <Overlay onClose={close}>
          <QuickPanel kind={modal.panel} onClose={close} />
        </Overlay>
      )}
      {modal?.kind === 'picker' && (
        <Overlay onClose={close}>
          <WidgetPicker project={project} slot={modal.slot} onClose={close} />
        </Overlay>
      )}
      {modal?.kind === 'newProject' && (
        <Overlay onClose={close}>
          <NewProjectDialog onClose={close} />
        </Overlay>
      )}
    </UiContext.Provider>
  );
}

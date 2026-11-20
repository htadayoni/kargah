import { actions, useAppState } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { useUi } from '@/components/ui-context';
import { PROJECT_ICONS } from '@/components/Icons';
import { WidgetProjectGrid } from './sdk';

export default function ProjectsWidget() {
  const state = useAppState();
  const { t } = useI18n();
  const { newProject } = useUi();
  const items = state.projects.slice(1).map((project, index) => ({ id: project.id, name: project.name || t('project.my'), Icon: PROJECT_ICONS[index % PROJECT_ICONS.length]!, active: project.id === state.settings.activeProjectId }));
  return <WidgetProjectGrid items={items} newLabel={t('project.newTile')} onSelect={actions.selectProject} onCreate={newProject} />;
}

import { actions, type Project } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { WidgetNoteInput } from './sdk';
export default function PinnedWidget({ project }: { project: Project }) {
  const { t } = useI18n();
  return <WidgetNoteInput label={t('widget.pinned')} value={project.pinned} onChange={value => actions.setPinned(project.id, value)} placeholder={t('pinned.empty')} />;
}

import type { Project } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { useUi } from '@/components/ui-context';
import { Chat } from '@/components/Icons';
import { WidgetFeedback } from './sdk';

export default function FeedbackWidget({ project }: { project: Project }) {
  const { t } = useI18n();
  const { openPanel } = useUi();
  const unread = project.feedback.filter((f) => !f.read).length;
  return <WidgetFeedback icon={Chat} onClick={() => openPanel('feedback')} empty={unread === 0} text={unread > 0 ? t('feedback.new', { n: unread }) : t('feedback.none')} />;
}

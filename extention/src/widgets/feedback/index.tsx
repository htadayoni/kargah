import FeedbackWidget from '../FeedbackWidget';
import { Chat } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'feedback', titleKey: 'widget.feedback', category: 'project', Icon: Chat,
  description: { en: "See new feedback at a glance.", fa: "بازخوردهای تازه را در یک نگاه ببین.", fr: "Consultez les nouveaux commentaires.", de: "Neue Rückmeldungen auf einen Blick sehen.", tr: "Yeni geri bildirimleri gör.", ar: "اطّلع على التعليقات الجديدة.", hi: "नई प्रतिक्रिया एक नज़र में देखें।", zh: "一眼查看新反馈。", ja: "新しいフィードバックを確認します。", ko: "새 피드백을 확인하세요." },
  render: project => <FeedbackWidget project={project} />,
  preview: () => <WidgetPreview kind="feedback" />,
});

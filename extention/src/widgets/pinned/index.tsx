import PinnedWidget from '../PinnedWidget';
import { Pin } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'pinned', titleKey: 'widget.pinned', category: 'notes', Icon: Pin,
  description: { en: "Keep an important note visible.", fa: "یک یادداشت مهم را همیشه جلوی چشم نگه دار.", fr: "Gardez une note importante visible.", de: "Eine wichtige Notiz sichtbar halten.", tr: "Önemli bir notu görünür tut.", ar: "أبقِ ملاحظة مهمة ظاهرة.", hi: "महत्वपूर्ण नोट सामने रखें।", zh: "显示重要笔记。", ja: "重要なメモを表示します。", ko: "중요한 메모를 표시하세요." },
  render: project => <PinnedWidget project={project} />,
  preview: () => <WidgetPreview kind="pinned" />,
});

import { NotesList } from '../ListWidgets';
import { NoteIcon } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'notes', titleKey: 'widget.notes', category: 'notes', Icon: NoteIcon,
  description: { en: "Keep your notes close at hand.", fa: "یادداشت‌هایت را در دسترس نگه دار.", fr: "Gardez vos notes à portée de main.", de: "Notizen griffbereit halten.", tr: "Notlarını elinin altında tut.", ar: "احتفظ بملاحظاتك في متناولك.", hi: "नोट्स पास रखें।", zh: "随时查看笔记。", ja: "メモをすぐに確認できます。", ko: "메모를 가까이 두세요." },
  render: project => <NotesList project={project} maxHeight={90} />,
  preview: () => <WidgetPreview kind="notes" />,
});

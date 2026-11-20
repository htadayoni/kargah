import { IdeasList } from '../ListWidgets';
import { Bulb } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'ideas', titleKey: 'widget.ideas', category: 'notes', Icon: Bulb,
  description: { en: "Capture ideas as they come.", fa: "ایده‌هایت را همان لحظه ثبت کن.", fr: "Notez vos idées.", de: "Ideen direkt festhalten.", tr: "Fikirlerini hemen kaydet.", ar: "سجّل أفكارك فوراً.", hi: "विचार तुरंत दर्ज करें।", zh: "及时记录灵感。", ja: "アイデアを記録します。", ko: "아이디어를 기록하세요." },
  render: project => <IdeasList project={project} maxHeight={90} />,
  preview: () => <WidgetPreview kind="ideas" />,
});

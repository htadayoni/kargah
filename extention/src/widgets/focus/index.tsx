import FocusWidget from '../FocusWidget';
import { Clock } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'focus', titleKey: 'widget.focus', category: 'focus', Icon: Clock,
  description: { en: "Start a focused work session.", fa: "یک جلسه کار متمرکز را شروع کن.", fr: "Lancez une session de concentration.", de: "Eine konzentrierte Arbeitssitzung starten.", tr: "Odaklanma oturumu başlat.", ar: "ابدأ جلسة عمل مركزة.", hi: "एक फ़ोकस सत्र शुरू करें।", zh: "开始专注工作。", ja: "集中セッションを開始します。", ko: "집중 세션을 시작하세요." },
  render: project => <FocusWidget />,
  preview: () => <WidgetPreview kind="focus" />,
});

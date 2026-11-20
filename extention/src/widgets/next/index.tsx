import NextStepWidget from '../NextStepWidget';
import { Clock } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'next', titleKey: 'widget.next', category: 'project', Icon: Clock,
  description: { en: "Keep your next important step in view.", fa: "مهم‌ترین قدم بعدی خودت را همیشه جلوی چشم داشته باش.", fr: "Gardez votre prochaine étape en vue.", de: "Den nächsten wichtigen Schritt im Blick behalten.", tr: "Önemli sonraki adımını göz önünde tut.", ar: "أبقِ خطوتك المهمة التالية أمامك.", hi: "अगला महत्वपूर्ण कदम सामने रखें।", zh: "随时查看下一个重要步骤。", ja: "次の重要なステップを表示します。", ko: "다음 중요한 단계를 한눈에 확인하세요." },
  render: project => <NextStepWidget project={project} />,
  preview: () => <WidgetPreview kind="next" />,
});

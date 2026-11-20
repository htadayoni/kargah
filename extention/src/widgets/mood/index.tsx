import MoodWidget, { MoodIcon } from '../MoodWidget';
import { defineLegacyWidget } from '../types';
import { MoodHeader } from '../sdk/headers';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'mood', titleKey: 'widget.mood', category: 'focus', Icon: MoodIcon, header: MoodHeader,
  description: { en: "Check in and see your personal trend.", fa: "حالت را ثبت کن و روند شخصی‌ات را ببین." },
  render: project => <MoodWidget />,
  preview: () => <WidgetPreview kind="mood" />,
});

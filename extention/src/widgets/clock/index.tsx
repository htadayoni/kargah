import ClockSettings from '@/components/ClockSettings';
import ClockWidget from '../ClockWidget';
import { Clock } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'clock', titleKey: 'widget.clock', category: 'focus', Icon: Clock, untitled: true, settings: ClockSettings, appearance: 'clock', openSettingsOnClick: true,
  description: { en: "See the time and date.", fa: "زمان و تاریخ را ببین." },
  render: project => <ClockWidget project={project} />,
  preview: () => <WidgetPreview kind="clock" />,
});

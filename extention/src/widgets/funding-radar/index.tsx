import FundingWidget from '../FundingWidget';
import { Cube } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { FundingHeader } from '../sdk/headers';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'funding', titleKey: 'widget.funding', category: 'project', Icon: Cube, experimental: true, header: FundingHeader,
  description: { en: "Explore sample funding opportunities.", fa: "فرصت‌های آزمایشی جذب سرمایه را بررسی کن." },
  render: project => <FundingWidget project={project} />,
  preview: () => <WidgetPreview kind="funding" />,
});

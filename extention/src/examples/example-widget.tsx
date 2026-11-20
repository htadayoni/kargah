/** Compile-checked contributor example; not registered or displayed in the app. */
import { Clock } from '@/components/Icons';
import { defineWidget, WidgetStack, WidgetText } from '@/widgets/sdk';
import type { WidgetContext } from '@/widgets/sdk';

function Example({ context }: { context: WidgetContext }) {
  return <WidgetStack><WidgetText>{context.project.name}</WidgetText></WidgetStack>;
}
function Preview({ locale }: { locale: string }) {
  return <WidgetStack><WidgetText>{locale === 'fa' ? 'نمونه پروژه' : 'Example project'}</WidgetText></WidgetStack>;
}
// `next` is a placeholder solely for this compile-only example. A real widget needs a new ID.
export default defineWidget({
  id: 'next', titleKey: 'widget.next', category: 'project', Icon: Clock,
  description: { en: 'An example widget.', fa: 'یک ویجت نمونه.' },
  component: Example, preview: Preview,
});

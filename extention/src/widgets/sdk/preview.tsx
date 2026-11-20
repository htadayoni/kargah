import { useI18n } from '@/lib/useI18n';
import { Clock } from '@/components/Icons';
import { MoodChoices, moodText } from '../MoodWidget';
import { WidgetAction, WidgetClock, WidgetEditableText, WidgetFrame, WidgetIcon, WidgetNoteInput, WidgetOpportunityList, WidgetRow, WidgetStack, WidgetText } from './index';
type BuiltInWidget = 'clock' | 'funding' | 'mood' | 'next' | 'feedback' | 'focus' | 'projects' | 'notes' | 'ideas' | 'pinned';

/** Static, isolated examples: no project data, storage, timers or requests. */
export function WidgetPreview({ kind }: { kind: BuiltInWidget }) {
  const { locale, t } = useI18n();
  const fa = locale === 'fa';
  const noop = () => {};
  if (kind === 'clock') return <WidgetClock time="10:24" date={fa ? 'جمعه، ۲۹ آبان' : 'Friday, November 20'} />;
  if (kind === 'mood') return <div className="k-mood-widget"><p>{moodText(fa).question}</p><MoodChoices value={4} onChange={noop} /></div>;
  if (kind === 'next') return <WidgetFrame><WidgetRow><WidgetIcon icon={Clock} /><WidgetEditableText onEdit={noop} title={t('next.edit')}>{fa ? 'گفتگو با مشتریان' : 'Talk to customers'}</WidgetEditableText></WidgetRow><WidgetAction onClick={noop}>{t('next.record')}</WidgetAction></WidgetFrame>;
  if (kind === 'focus') return <WidgetFrame><WidgetRow><WidgetIcon icon={Clock} /><WidgetText size="display">{t('focus.minutes', { n: 25 })}</WidgetText></WidgetRow><WidgetAction onClick={noop}>{t('focus.start')}</WidgetAction></WidgetFrame>;
  if (kind === 'pinned') return <WidgetNoteInput label={t('widget.pinned')} value={fa ? 'یادداشت مهم من' : 'My important note'} onChange={noop} />;
  if (kind === 'funding') return <WidgetOpportunityList items={[
    { id: 'accelerator', type: 'accelerator', title: fa ? 'شتاب‌دهنده نووا' : 'Nova Accelerator', subtitle: fa ? 'شتاب‌دهنده · محصول اولیه' : 'Accelerator · MVP', deadline: fa ? 'آزمایشی' : 'Sample', hasDeadline: false },
    { id: 'grant', type: 'grant', title: fa ? 'گرنت سازندگان آینده' : 'Future Builders Grant', subtitle: fa ? 'گرنت · ایده' : 'Grant · Idea', deadline: fa ? 'آزمایشی' : 'Sample', hasDeadline: false },
  ]} moreLabel="" direction={fa ? 'rtl' : 'ltr'} onMore={noop} />;

  const samples: Record<Exclude<BuiltInWidget, 'clock' | 'mood' | 'next' | 'focus' | 'pinned' | 'funding'>, [string, string]> = {
    feedback: [fa ? 'بازخورد کاربران' : 'User feedback', fa ? 'ایده جالبی است' : 'An interesting idea'],
    projects: [fa ? 'پروژه من' : 'My project', fa ? 'میز شخصی' : 'Personal desk'],
    notes: [fa ? 'یادداشت اول' : 'First note', fa ? 'یادداشت دوم' : 'Second note'],
    ideas: [fa ? 'ایده اول' : 'First idea', fa ? 'ایده دوم' : 'Second idea'],
  };
  return <WidgetStack>{samples[kind].map((sample, i) => <WidgetRow key={sample}><WidgetText tone={i ? 'muted' : 'normal'}>{sample}</WidgetText></WidgetRow>)}</WidgetStack>;
}

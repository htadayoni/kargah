import { useUi } from '@/components/ui-context';
import { useI18n } from '@/lib/useI18n';
import { moodText } from '../MoodWidget';

export function MoodHeader() {
  const { openMood } = useUi();
  const { locale, dir } = useI18n();
  return <button type="button" className="k-mood-link" onClick={openMood}>{moodText(locale === 'fa').trend}<span aria-hidden="true">{dir === 'rtl' ? '←' : '→'}</span></button>;
}
export function FundingHeader() {
  const { openFunding } = useUi();
  const { locale, dir } = useI18n();
  return <button type="button" className="k-mood-link" onClick={openFunding}>{locale === 'fa' ? 'مشاهده همه' : 'View all'}<span aria-hidden="true">{dir === 'rtl' ? '←' : '→'}</span></button>;
}

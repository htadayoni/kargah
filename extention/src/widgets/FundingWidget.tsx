import type { Project } from '@/lib/state';
import { useUi } from '@/components/ui-context';
import { useI18n } from '@/lib/useI18n';
import { useFunding } from './useFunding';
import { fundingCopy, formatDeadline } from './fundingCopy';
import { WidgetOpportunityList, WidgetText } from './sdk';

export default function FundingWidget({ project: _project }: { project: Project }) {
  const { openFunding } = useUi(); const { locale, n } = useI18n(); const { enabled, result, error } = useFunding(); const fa = locale === 'fa'; const c = fundingCopy(fa);
  if (!enabled) return <WidgetText tone="muted">{c.disabled}</WidgetText>;
  if (error) return <WidgetText tone="muted">{c.error}</WidgetText>;
  if (!result) return <WidgetText tone="muted">{c.loading}</WidgetText>;
  const active = result.cache.items.filter(item => item.status === 'open' && (!item.deadline || new Date(`${item.deadline}T23:59:59`).getTime() >= Date.now()));
  const extra = Math.max(0, active.length - 2);
  return <WidgetOpportunityList
    items={active.slice(0, 2).map(item => ({ id: item.id, type: item.type, title: fa ? item.nameFa : item.name, subtitle: `${c.types[item.type]} · ${c.stages[item.stage]}`, deadline: item.deadline ? `${c.deadline}: ${formatDeadline(item.deadline, locale, c)}` : c.noDeadline, hasDeadline: !!item.deadline }))}
    moreCount={extra ? n(extra) : undefined}
    moreLabel={fa ? 'فرصت فعال دیگر' : `more open ${extra === 1 ? 'opportunity' : 'opportunities'}`}
    direction={fa ? 'rtl' : 'ltr'} onMore={openFunding} />;
}

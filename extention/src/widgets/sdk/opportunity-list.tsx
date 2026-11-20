import type { FundingType } from '@/lib/funding';
import { FundingIcon } from './FundingIcon';

export type OpportunityItem = { id: string; type: FundingType; title: string; subtitle: string; deadline: string; hasDeadline: boolean };
export function WidgetOpportunityList({ items, moreCount, moreLabel, direction, onMore }: { items: OpportunityItem[]; moreCount?: string; moreLabel: string; direction: 'rtl' | 'ltr'; onMore: () => void }) {
  return <div className="k-funding-widget"><div className="k-funding-widget-list">{items.map(item => <div className="k-funding-widget-row" key={item.id}><span className={`k-funding-mini-icon is-${item.type}`}><FundingIcon type={item.type} /></span><div className="k-funding-widget-info"><strong title={item.title}>{item.title}</strong><small>{item.subtitle}</small></div><span className="k-funding-deadline">{item.hasDeadline && <span aria-hidden="true">◷</span>}{item.deadline}</span></div>)}</div><div className="k-funding-widget-footer">{moreCount && <button type="button" className="k-funding-more" onClick={onMore}><strong className="k-funding-more-count">{moreCount}</strong> {moreLabel} <span aria-hidden="true">{direction === 'rtl' ? '←' : '→'}</span></button>}</div></div>;
}

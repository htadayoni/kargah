import type { ComponentType, SVGProps } from 'react';
import { Plus } from '@/components/Icons';

type ProjectTile = { id: string; name: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; active: boolean };
export function WidgetProjectGrid({ items, newLabel, onSelect, onCreate }: { items: ProjectTile[]; newLabel: string; onSelect: (id: string) => void; onCreate: () => void }) {
  return <div className="k-widget-projects">{items.map((item, index) => <button key={item.id} type="button" onClick={() => onSelect(item.id)} className="k-widget-project-tile"><span className={`k-widget-project-icon k-widget-project-color-${index % 6}${item.active ? ' is-active' : ''}`}><item.Icon aria-hidden="true" /></span><span className={item.active ? 'is-active' : undefined}>{item.name}</span></button>)}<button type="button" onClick={onCreate} className="k-widget-project-tile"><span className="k-widget-project-icon is-new"><Plus aria-hidden="true" /></span><span>{newLabel}</span></button></div>;
}

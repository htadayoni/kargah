import type { ReactNode } from 'react';
import { ChevronDown, Close } from '@/components/Icons';

export function WidgetSettingsPanel({ title, label, closeLabel, onClose, children }: { title: string; label: string; closeLabel: string; onClose: () => void; children: ReactNode }) {
  return <aside className="k-settings k-solid k-slide k-widget-settings" role="dialog" aria-modal="true" aria-label={label}><header className="k-widget-settings-header"><h2>{title}</h2><button type="button" onClick={onClose} aria-label={closeLabel} className="k-widget-settings-close"><Close aria-hidden="true" /></button></header>{children}</aside>;
}
export function WidgetSettingsSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: ReadonlyArray<{ value: string; label: string }> }) {
  return <div className="k-widget-settings-row"><label htmlFor={id}>{label}</label><div className="k-widget-settings-select"><select id={id} value={value} onChange={event => onChange(event.target.value)} className="k-field">{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown aria-hidden="true" /></div></div>;
}
export function WidgetSettingsChoice({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: ReadonlyArray<{ value: string; label: string }> }) {
  return <div className="k-widget-settings-row"><span>{label}</span><div className="k-widget-settings-choices" role="group" aria-label={label}>{options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div></div>;
}

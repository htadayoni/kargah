import type { ReactNode } from 'react';

/** Shared building blocks for contribution widgets. Styling belongs to the host. */
export function WidgetStack({ children }: { children: ReactNode }) {
  return <div className="k-widget-stack">{children}</div>;
}
export function WidgetRow({ children }: { children: ReactNode }) {
  return <div className="k-widget-row">{children}</div>;
}
export function WidgetText({ children, tone = 'normal', size = 'normal' }: { children: ReactNode; tone?: 'normal' | 'muted'; size?: 'normal' | 'display' }) {
  return <span className={`k-widget-text${tone === 'muted' ? ' k-widget-text-muted' : ''}${size === 'display' ? ' k-widget-text-display' : ''}`}>{children}</span>;
}
export function WidgetButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button type="button" className="k-widget-button" onClick={onClick}>{children}</button>;
}

export function WidgetInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <input className="k-widget-input" aria-label={label} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />;
}
export function WidgetTextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea className="k-widget-input k-widget-textarea" aria-label={label} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />;
}
export function WidgetBadge({ children }: { children: ReactNode }) {
  return <span className="k-widget-badge">{children}</span>;
}

export { createWidgetStorage } from "./storage";
export { defineWidget } from "./define-widget";
export type { WidgetContext } from "./define-widget";

/** Standard widget layouts and controls used by built-in and contributed widgets. */
export function WidgetFrame({ children }: { children: ReactNode }) {
  return <div className="k-widget-frame">{children}</div>;
}
export function WidgetIcon({ icon: Icon }: { icon: import('react').ComponentType<import('react').SVGProps<SVGSVGElement>> }) {
  return <Icon className="k-widget-icon" aria-hidden="true" />;
}
export function WidgetAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="k-soft-btn k-widget-action">{children}</button>;
}
export function WidgetEditableText({ children, completed, onEdit, title }: { children: ReactNode; completed?: boolean; onEdit: () => void; title: string }) {
  return <span onDoubleClick={onEdit} title={title} className={completed ? 'k-widget-editable is-completed' : 'k-widget-editable'}>{children}</span>;
}
export function WidgetInlineInput({ value, onChange, onSave, onCancel, label }: { value: string; onChange: (value: string) => void; onSave: () => void; onCancel: () => void; label: string }) {
  return <input autoFocus value={value} aria-label={label} onChange={event => onChange(event.target.value)} onBlur={onSave} onKeyDown={event => { if (event.key === 'Enter') onSave(); if (event.key === 'Escape') onCancel(); }} className="k-field k-widget-inline-input" />;
}
export function WidgetNoteInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea value={value} aria-label={label} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="k-widget-note-input" />;
}
export function WidgetClock({ time, period, date }: { time: string; period?: string; date: string }) {
  return <div className="k-clock-widget"><div className="k-clock-time" dir="ltr">{time}{period && <span className="k-clock-period">{period}</span>}</div><div className="k-clock-date">{date}</div></div>;
}
export function WidgetFeedback({ icon: Icon, text, empty, onClick }: { icon: import('react').ComponentType<import('react').SVGProps<SVGSVGElement>>; text: string; empty: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="k-widget-feedback"><span><Icon aria-hidden="true" /><span className={empty ? 'is-empty' : undefined}>{text}</span></span></button>;
}
export { WidgetOpportunityList } from './opportunity-list';
export { WidgetProjectGrid } from './project-grid';
export { WidgetSettingsPanel, WidgetSettingsSelect, WidgetSettingsChoice } from './settings';

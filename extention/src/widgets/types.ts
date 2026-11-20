import type { ComponentType, ReactNode, SVGProps } from 'react';
import type { Project, WidgetType } from '@/lib/state';
import type { Locale, MessageKey } from '@/lib/i18n';

export type WidgetCategory = 'project' | 'focus' | 'notes';
export interface WidgetDef {
  id: WidgetType;
  titleKey: MessageKey;
  category: WidgetCategory;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: { en: string } & Partial<Record<Locale, string>>;
  untitled?: boolean;
  panel?: boolean;
  settings?: ComponentType<{ project: Project; onClose: () => void }>;
  header?: ComponentType;
  appearance?: 'clock';
  openSettingsOnClick?: boolean;
  experimental?: boolean;
  render: (project: Project) => ReactNode;
  /** Side-effect-free content used only in the picker. */
  preview: () => ReactNode;
}
export function defineLegacyWidget<T extends WidgetDef>(definition: T): T { return definition; }

import { createElement, useMemo, type ComponentType } from 'react';
import type { Locale, MessageKey } from '@/lib/i18n';
import { useI18n } from '@/lib/useI18n';
import type { Project, WidgetType } from '@/lib/state';
import { createWidgetStorage } from './storage';
import { defineLegacyWidget, type WidgetDef } from '../types';

export type WidgetContext = {
  readonly project: Readonly<{ id: string; name: string }>;
  readonly locale: Locale;
  readonly direction: 'rtl' | 'ltr';
  readonly storage: ReturnType<typeof createWidgetStorage>;
};
type Contribution = Pick<WidgetDef, 'id' | 'titleKey' | 'category' | 'Icon' | 'description' | 'experimental' | 'untitled'> & {
  component: ComponentType<{ context: WidgetContext }>;
  preview: ComponentType<{ locale: Locale; direction: 'rtl' | 'ltr' }>;
  settings?: ComponentType<{ context: WidgetContext; onClose: () => void }>;
  openSettingsOnClick?: boolean;
};

/** Typed API for bundled, reviewed community widgets. It does not sandbox code. */
export function defineWidget<T extends Contribution>(definition: T): WidgetDef & { id: T['id'] } {
  const { component: Component, preview: Preview, settings: Settings, ...metadata } = definition;
  function useContext(project: Project): WidgetContext {
    const { locale, dir } = useI18n();
    const storage = useMemo(() => createWidgetStorage(definition.id, project.id), [project.id]);
    return { project: { id: project.id, name: project.name }, locale, direction: dir, storage };
  }
  function Live({ project }: { project: Project }) {
    const context = useContext(project);
    return createElement(Component, { context });
  }
  function SettingsView({ project, onClose }: { project: Project; onClose: () => void }) {
    const context = useContext(project);
    return Settings ? createElement(Settings, { context, onClose }) : null;
  }
  function Sample() {
    const { locale, dir } = useI18n();
    return createElement(Preview, { locale, direction: dir });
  }
  return defineLegacyWidget({ ...metadata, settings: Settings ? SettingsView : undefined, render: project => createElement(Live, { project }), preview: () => createElement(Sample) }) as WidgetDef & { id: T['id'] };
}
export type { WidgetType, MessageKey };

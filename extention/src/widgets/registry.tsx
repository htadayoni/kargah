import type { WidgetType } from '@/lib/state';
import type { WidgetDef } from './types';
import mood from './mood';
import next from './next';
import feedback from './feedback';
import focus from './focus';
import projects from './projects';
import notes from './notes';
import ideas from './ideas';
import pinned from './pinned';
import clock from './clock';
import funding from './funding-radar';

const definitions = {
  mood,
  next,
  feedback,
  focus,
  projects,
  notes,
  ideas,
  pinned,
  clock,
  funding,
} satisfies { [K in WidgetType]: WidgetDef & { id: K } };
export const WIDGETS: Record<WidgetType, WidgetDef> = definitions;
export const WIDGET_TYPES = Object.keys(WIDGETS) as WidgetType[];

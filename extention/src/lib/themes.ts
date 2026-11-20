export type ThemeId = 'dusk' | 'ember' | 'forest' | 'violet';
export type BackgroundId = 'morning' | 'afternoon' | 'night';
export type BgMode = 'scene' | 'solid' | 'photo';

export interface Theme {
  id: ThemeId;
  /** Swatch colors for the picker: [glass surface, accent]. Real values live in CSS ([data-theme]). */
  swatch: [string, string];
}
export const THEMES: Theme[] = [
  { id: 'dusk', swatch: ['#202a3e', '#5bb0ff'] },
  { id: 'ember', swatch: ['#2c2422', '#fba519'] },
  { id: 'forest', swatch: ['#1a2c2a', '#5fd4a0'] },
  { id: 'violet', swatch: ['#262240', '#b79cff'] },
];

export interface BackgroundConfig {
  mode: BgMode;
  /** scene mode: follow the time of day */
  sync: boolean;
  scene: BackgroundId;
  solid: string;
  /** user photo as a (downscaled) data URL */
  photo: string | null;
}

export const BACKGROUNDS: BackgroundId[] = ['morning', 'afternoon', 'night'];
export const SOLID_COLORS = ['#233b67', '#1d2a52', '#2b2350', '#16342f', '#3a2a22', '#1f2a30', '#33415c', '#12141c'];

export const defaultBackground = (): BackgroundConfig => ({
  mode: 'scene',
  sync: true,
  scene: 'night',
  solid: SOLID_COLORS[0]!,
  photo: null,
});

export function backgroundForHour(hour: number): BackgroundId {
  if (hour >= 6 && hour < 15) return 'morning';
  if (hour >= 15 && hour < 19) return 'afternoon';
  return 'night';
}
export const backgroundUrl = (id: BackgroundId) => `/backgrounds/bg-${id}.jpg`;

export type ResolvedBackground = { kind: 'image'; url: string } | { kind: 'color'; color: string };

export function resolveBackground(bg: BackgroundConfig, hour: number): ResolvedBackground {
  if (bg.mode === 'solid') return { kind: 'color', color: bg.solid };
  if (bg.mode === 'photo' && bg.photo) return { kind: 'image', url: bg.photo };
  return { kind: 'image', url: backgroundUrl(bg.sync ? backgroundForHour(hour) : bg.scene) };
}

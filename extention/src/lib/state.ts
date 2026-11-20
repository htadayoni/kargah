import { useSyncExternalStore } from 'react';
import { detectLocale, type Locale } from './i18n';
import { storage, subscribeStorage } from './storage';
import type { CalendarKind } from './time';
import { defaultBackground, type BackgroundConfig, type ThemeId } from './themes';

export type Stage = 'hunting' | 'idea' | 'building';
/** Widget slots. e* = reading-end column, s* = reading-start column, c3 = wide slot under the search. */
export type SlotId = 'c1' | 'e1' | 'e2' | 'e3' | 's1' | 's2' | 's3' | 'c3';
export const SLOT_ORDER: SlotId[] = ['c1', 'e1', 's1', 'e2', 's2', 'e3', 's3', 'c3'];
export type WidgetType = 'clock' | 'next' | 'feedback' | 'focus' | 'projects' | 'notes' | 'ideas' | 'pinned' | 'mood' | 'funding';

export interface Note {
  id: string;
  text: string;
  createdAt: number;
  read?: boolean;
}
export interface QuickLink {
  id: string;
  title: string;
  url: string;
}
/** Everything that belongs to one project lives here — each project is its own desk. */
export type FundingPersonalStatus = 'undecided' | 'interested' | 'preparing' | 'applied' | 'not_interested';
export interface Project {
  id: string;
  name: string;
  stage: Stage;
  createdAt: number;
  theme: ThemeId;
  bg: BackgroundConfig;
  nextStep: string | null;
  nextDone: boolean;
  pinned: string;
  notes: Note[];
  ideas: Note[];
  feedback: Note[];
  links: QuickLink[];
  slots: Partial<Record<SlotId, WidgetType>>;
  savedFundingIds?: string[];
  fundingStatuses?: Record<string, FundingPersonalStatus>;
  clockSettings?: { calendar: CalendarKind; hour12: boolean };
}
export type FontSize = 'small' | 'medium' | 'large';

export interface Settings {
  locale: Locale;
  calendar: CalendarKind;
  hour12: boolean;
  fontSize?: FontSize;
  /** 'last' = reopen the last desk, otherwise a project id */
  startProject: string;
  activeProjectId: string;
}
export interface FocusState {
  endsAt: number | null;
  minutes: number;
  remainingMs?: number | null;
}
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type MoodEvent = { type: 'mood' | 'energy'; value: MoodLevel; at: number | null } | { type: 'note'; text: string; at: number | null };
export interface MoodEntry { mood: MoodLevel; energy?: MoodLevel; note?: string; events?: MoodEvent[] }
/** Old entries have no recorded time; preserve them without inventing one. */
export function moodEvents(entry: MoodEntry): MoodEvent[] {
  if (entry.events) return entry.events;
  const events: MoodEvent[] = [{ type: 'mood', value: entry.mood, at: null }];
  if (entry.energy !== undefined) events.push({ type: 'energy', value: entry.energy, at: null });
  if (entry.note?.trim()) events.push({ type: 'note', text: entry.note, at: null });
  return events;
}
function prepareMoodEntry(entry: MoodEntry) {
  if (!entry.events) entry.events = moodEvents(entry);
  delete entry.note;
  return entry.events;
}
export interface AppState {
  version: 2;
  ready: boolean;
  storageError?: 'load' | 'save';
  settings: Settings;
  focus: FocusState;
  moodEntries?: Record<string, MoodEntry>;
  projects: Project[];
}

const KEY = 'kargah:state';
const uid = () => crypto.randomUUID();

const DEFAULT_LINKS: [string, string][] = [
  ['GitHub', 'https://github.com'],
  ['Figma', 'https://www.figma.com'],
  ['Notion', 'https://www.notion.so'],
  ['Gmail', 'https://mail.google.com'],
];

export function newProject(name: string, stage: Stage = 'building', seed = false): Project {
  return {
    id: uid(),
    name,
    stage,
    createdAt: Date.now(),
    theme: 'dusk',
    bg: defaultBackground(),
    nextStep: null,
    nextDone: false,
    pinned: '',
    notes: [],
    ideas: [],
    feedback: [],
    links: DEFAULT_LINKS.map(([title, url]) => ({ id: uid(), title, url })),
    slots: seed ? { c1: 'clock', e2: 'next', s2: 'feedback', c3: 'projects' } : { c1: 'clock' },
    clockSettings: { calendar: 'gregorian', hour12: false },
  };
}

function initialState(): AppState {
  const p = newProject('', 'building', false);
  const locale = detectLocale();
  p.clockSettings = { calendar: locale === 'fa' ? 'jalali' : 'gregorian', hour12: false };
  return {
    version: 2,
    ready: false,
    settings: {
      locale,
      calendar: locale === 'fa' ? 'jalali' : 'gregorian',
      hour12: false,
      fontSize: 'medium',
      startProject: 'last',
      activeProjectId: p.id,
    },
    focus: { endsAt: null, minutes: 25 },
    projects: [p],
  };
}

let state: AppState = initialState();
const listeners = new Set<() => void>();
type Mutation = (draft: AppState) => void;
const pending: Mutation[] = [];
let processing = false;
let initialized = false;

function migrateClock(s: AppState): boolean {
  let changed = false;
  for (const project of s.projects) {
    if (!project.clockSettings) {
      project.clockSettings = { calendar: s.settings.calendar, hour12: s.settings.hour12 };
      project.slots.c1 = 'clock';
      changed = true;
    }
  }
  return changed;
}
function notify() { listeners.forEach((l) => l()); }
function persisted(s: AppState) {
  const { ready, storageError, ...data } = s;
  void ready; void storageError;
  return data;
}
async function locked<T>(fn: () => Promise<T>): Promise<T> {
  // Web Locks serialize read-modify-write operations across all extension tabs.
  if (!navigator.locks) throw new Error('Web Locks unavailable');
  return navigator.locks.request('kargah:state', fn);
}
function set(fn: Mutation) {
  pending.push(fn);
  void flush();
}
async function flush() {
  if (processing || !initialized) return;
  processing = true;
  try {
    while (pending.length) {
      await locked(async () => {
        const saved = await storage.get<Omit<AppState, 'ready' | 'storageError'>>(KEY);
        const next = structuredClone(saved?.version === 2 && saved.projects?.length ? { ...saved, ready: true } : state);
        pending[0]!(next);
        await storage.set(KEY, persisted(next));
        pending.shift();
        state = { ...next, ready: true, storageError: undefined };
        notify();
      });
    }
  } catch {
    state = { ...state, storageError: 'save' };
    notify();
  } finally { processing = false; }
}
export function retryStorage() {
  if (!initialized || state.storageError === 'load') void loadState();
  else void flush();
}
export async function loadState() {
  try {
    await locked(async () => {
      const saved = await storage.get<Omit<AppState, 'ready' | 'storageError'>>(KEY);
      if (saved && (saved.version !== 2 || !saved.projects?.length)) throw new Error('Unsupported or invalid saved state');
      if (saved) {
        state = { ...saved, ready: true };
        if (migrateClock(state)) await storage.set(KEY, persisted(state));
      }
      else {
        state = { ...state, ready: true };
        await storage.set(KEY, persisted(state));
      }
      const { startProject } = state.settings;
      if (startProject !== 'last' && state.projects.some((p) => p.id === startProject)) {
        state.settings.activeProjectId = startProject;
      }
    });
    initialized = true;
    notify();
    void flush();
  } catch {
    state = { ...state, ready: false, storageError: 'load' };
    notify();
  }
}
subscribeStorage(KEY, () => {
  if (!initialized) return;
  void locked(async () => {
    const saved = await storage.get<Omit<AppState, 'ready' | 'storageError'>>(KEY);
    if (saved?.version === 2 && saved.projects?.length) {
      state = { ...saved, ready: true, storageError: state.storageError };
      notify();
    }
  }).catch(() => { state = { ...state, storageError: 'load' }; notify(); });
});

export function useAppState(): AppState {
  return useSyncExternalStore(
    (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    () => state,
  );
}
export function activeProject(s: AppState): Project {
  return s.projects.find((p) => p.id === s.settings.activeProjectId) ?? s.projects[0]!;
}

const withProject = (id: string, fn: (p: Project) => void) =>
  set((d) => {
    const p = d.projects.find((x) => x.id === id);
    if (p) fn(p);
  });

export const actions = {
  setLocale: (locale: Locale) => set((d) => void (d.settings.locale = locale)),
  setCalendar: (c: CalendarKind) => set((d) => void (d.settings.calendar = c)),
  setFontSize: (size: FontSize) => set((d) => void (d.settings.fontSize = size)),
  setHour12: (v: boolean) => set((d) => void (d.settings.hour12 = v)),
  setStartProject: (v: string) => set((d) => void (d.settings.startProject = v)),

  addProject(name: string) {
    set((d) => {
      const p = newProject(name);
      p.clockSettings = { calendar: d.settings.calendar, hour12: d.settings.hour12 };
      p.theme = d.projects.find((x) => x.id === d.settings.activeProjectId)?.theme ?? 'dusk';
      d.projects.push(p);
      d.settings.activeProjectId = p.id;
    });
  },
  selectProject: (id: string) => set((d) => void (d.settings.activeProjectId = id)),
  cycleProject(dir: -1 | 1) {
    set((d) => {
      const i = d.projects.findIndex((p) => p.id === d.settings.activeProjectId);
      const n = d.projects.length;
      d.settings.activeProjectId = d.projects[(i + dir + n) % n]!.id;
    });
  },
  renameProject: (id: string, name: string) => withProject(id, (p) => void (p.name = name)),
  deleteProject(id: string) {
    set((d) => {
      if (d.projects.length < 2) return;
      d.projects = d.projects.filter((p) => p.id !== id);
      if (d.settings.activeProjectId === id) d.settings.activeProjectId = d.projects[0]!.id;
      if (d.settings.startProject === id) d.settings.startProject = 'last';
    });
  },

  setFundingStatus: (id: string, opportunityId: string, status: FundingPersonalStatus) => withProject(id, (p) => { p.fundingStatuses ??= {}; if (status === 'undecided') delete p.fundingStatuses[opportunityId]; else p.fundingStatuses[opportunityId] = status; }),
  toggleFunding: (id: string, opportunityId: string) => withProject(id, (p) => { p.savedFundingIds ??= []; p.savedFundingIds = p.savedFundingIds.includes(opportunityId) ? p.savedFundingIds.filter(x => x !== opportunityId) : [...p.savedFundingIds, opportunityId]; }),
  setClockCalendar: (id: string, calendar: CalendarKind) => withProject(id, (p) => { if (p.clockSettings) p.clockSettings.calendar = calendar; }),
  setClockHour12: (id: string, hour12: boolean) => withProject(id, (p) => { if (p.clockSettings) p.clockSettings.hour12 = hour12; }),
  setTheme: (id: string, theme: ThemeId) => withProject(id, (p) => void (p.theme = theme)),
  setBackground: (id: string, bg: BackgroundConfig) => withProject(id, (p) => void (p.bg = bg)),

  setNextStep: (id: string, text: string | null) =>
    withProject(id, (p) => {
      p.nextStep = text;
      p.nextDone = false;
    }),
  toggleNextDone: (id: string) => withProject(id, (p) => void (p.nextDone = !p.nextDone)),
  setPinned: (id: string, text: string) => withProject(id, (p) => void (p.pinned = text)),

  addNote: (id: string, text: string) => withProject(id, (p) => void p.notes.unshift({ id: uid(), text, createdAt: Date.now() })),
  removeNote: (id: string, nid: string) => withProject(id, (p) => void (p.notes = p.notes.filter((n) => n.id !== nid))),
  addIdea: (id: string, text: string) => withProject(id, (p) => void p.ideas.unshift({ id: uid(), text, createdAt: Date.now() })),
  removeIdea: (id: string, nid: string) => withProject(id, (p) => void (p.ideas = p.ideas.filter((n) => n.id !== nid))),
  addFeedback: (id: string, text: string) =>
    withProject(id, (p) => void p.feedback.unshift({ id: uid(), text, createdAt: Date.now(), read: false })),
  removeFeedback: (id: string, nid: string) => withProject(id, (p) => void (p.feedback = p.feedback.filter((n) => n.id !== nid))),
  markFeedbackRead: (id: string) =>
    withProject(id, (p) => {
      p.feedback.forEach((f) => (f.read = true));
    }),

  addLink(id: string, title: string, url: string) {
    const clean = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(clean);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid URL');
    const link = { id: uid(), title: title.trim() || parsed.hostname, url: parsed.href };
    withProject(id, (p) => void p.links.push(link));
  },
  removeLink: (id: string, linkId: string) => withProject(id, (p) => void (p.links = p.links.filter((l) => l.id !== linkId))),

  placeWidget: (id: string, slot: SlotId, type: WidgetType) =>
    withProject(id, (p) => {
      for (const s of Object.keys(p.slots) as SlotId[]) if (p.slots[s] === type) delete p.slots[s];
      p.slots[slot] = type;
    }),
  removeWidget: (id: string, slot: SlotId) => withProject(id, (p) => void delete p.slots[slot]),
  /** Move (or swap) the widget in `from` to the slot `to`. */
  moveSlot: (id: string, from: SlotId, to: SlotId) =>
    withProject(id, (p) => {
      if (from === to) return;
      const a = p.slots[from];
      const b = p.slots[to];
      if (!a) return;
      p.slots[to] = a;
      if (b) p.slots[from] = b;
      else delete p.slots[from];
    }),

  setMood(date: string, mood: MoodLevel) {
    const at = Date.now();
    set((d) => {
      d.moodEntries ??= {};
      const entry = d.moodEntries[date];
      if (!entry) d.moodEntries[date] = { mood, events: [{ type: 'mood', value: mood, at }] };
      else { prepareMoodEntry(entry).push({ type: 'mood', value: mood, at }); entry.mood = mood; }
    });
  },
  setMoodNote(date: string, note: string) {
    const text = note.trim(); if (!text) return;
    const at = Date.now();
    set((d) => { const entry = d.moodEntries?.[date]; if (entry) prepareMoodEntry(entry).push({ type: 'note', text, at }); });
  },
  setMoodEnergy(date: string, energy: MoodLevel) {
    const at = Date.now();
    set((d) => { const entry = d.moodEntries?.[date]; if (entry) { prepareMoodEntry(entry).push({ type: 'energy', value: energy, at }); entry.energy = energy; } });
  },

  startFocus: () => set((d) => { d.focus.endsAt = Date.now() + (d.focus.remainingMs ?? d.focus.minutes * 60_000); d.focus.remainingMs = null; }),
  stopFocus: () => set((d) => { d.focus.remainingMs = d.focus.endsAt ? Math.max(0, d.focus.endsAt - Date.now()) : null; d.focus.endsAt = null; }),
  setFocusMinutes: (m: number) => set((d) => void ((d.focus.minutes = m), (d.focus.endsAt = null), (d.focus.remainingMs = null))),
};

window.addEventListener('beforeunload', (event) => {
  if (pending.length) { event.preventDefault(); event.returnValue = ''; }
});

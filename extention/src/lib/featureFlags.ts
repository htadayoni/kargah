import { useSyncExternalStore } from 'react';

// This switch exists only in development builds and applies across all mock features.
const MOCK_KEY = 'kargah:dev:mock-features';
let memoryValue = false;
try { memoryValue = import.meta.env.DEV && localStorage.getItem(MOCK_KEY) === 'true'; } catch { /* Use the in-memory value. */ }
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
if (import.meta.env.DEV) window.addEventListener('storage', (event) => {
  if (event.key === MOCK_KEY || event.key === null) {
    memoryValue = event.key === null ? false : event.newValue === 'true';
    notify();
  }
});
export function setDeveloperMode(enabled: boolean) {
  if (!import.meta.env.DEV) return;
  memoryValue = enabled;
  try { localStorage.setItem(MOCK_KEY, String(enabled)); } catch { /* Keep it usable for this session. */ }
  notify();
}
export function useMockFeatures(): [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => import.meta.env.DEV && memoryValue);
  return [enabled, setDeveloperMode];
}

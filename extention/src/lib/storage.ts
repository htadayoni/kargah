/**
 * Thin storage adapter. Uses chrome.storage.local inside the extension and falls
 * back to localStorage so the new tab page can also be previewed as a plain web page.
 * The web app can later provide another adapter (cloud sync) behind this same shape.
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
}

type ChromeLike = { storage?: { local?: { get(k: string): Promise<Record<string, unknown>>; set(o: Record<string, unknown>): Promise<void> } } };

function chromeLocal() {
  const c = (globalThis as unknown as { chrome?: ChromeLike }).chrome;
  return c?.storage?.local;
}

export const storage: StorageAdapter = {
  async get<T>(key: string) {
    const area = chromeLocal();
    if (area) return (await area.get(key))[key] as T | undefined;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  },
  async set<T>(key: string, value: T) {
    const area = chromeLocal();
    if (area) return area.set({ [key]: value });
    localStorage.setItem(key, JSON.stringify(value));
  },
};

/** Notify other open extension pages when the shared state changes. */
export function subscribeStorage(key: string, callback: () => void) {
  const c = (globalThis as any).chrome;
  const listener = (changes: Record<string, unknown>, area: string) => {
    if (area === 'local' && key in changes) callback();
  };
  c?.storage?.onChanged?.addListener(listener);
  const onStorage = (event: StorageEvent) => { if (event.key === key) callback(); };
  window.addEventListener('storage', onStorage);
}

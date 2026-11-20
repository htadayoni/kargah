/** Opens a URL, or searches with the browser's default engine (chrome.search) / Google as a fallback. */
export function runSearch(raw: string) {
  const text = raw.trim();
  if (!text) return;
  if (!/\s/.test(text) && (/^https?:\/\//i.test(text) || /^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(text))) {
    location.href = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    return;
  }
  const c = (globalThis as unknown as { chrome?: { search?: { query(o: { text: string; disposition: string }): void } } }).chrome;
  if (c?.search?.query) c.search.query({ text, disposition: 'CURRENT_TAB' });
  else location.href = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
}

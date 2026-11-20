import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { webcrypto } from 'node:crypto';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

// Two separately loaded stores emulate two new-tab documents sharing browser storage.
test('concurrent tabs preserve changes and focus pause survives reload', async () => {
  let value;
  let failNextSave = false;
  let chain = Promise.resolve();
  const listeners = [];
  globalThis.crypto ??= webcrypto;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    language: 'en', locks: { request(_name, fn) { const run = chain.then(fn); chain = run.catch(() => {}); return run; } },
  } });
  globalThis.window = { addEventListener() {} };
  globalThis.chrome = { storage: {
    local: {
      async get(key) { return { [key]: structuredClone(value) }; },
      async set(data) { if (failNextSave) { failNextSave = false; throw new Error('storage full'); } value = structuredClone(data['kargah:state']); for (const listener of listeners) listener({ 'kargah:state': {} }, 'local'); },
    },
    onChanged: { addListener(fn) { listeners.push(fn); } },
  } };
  const dir = 'tests/.compiled';
  await mkdir(dir, { recursive: true });
  try {
    for (const name of ['state', 'storage', 'i18n', 'translations', 'themes', 'time']) {
      const input = await readFile(`src/lib/${name}.ts`, 'utf8');
      const code = stripTypeScriptTypes(input, { mode: 'transform' })
        .replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
      await writeFile(`${dir}/${name}.mjs`, code);
      if (name === 'state') await writeFile(`${dir}/state-b.mjs`, code);
    }
    const [a, b] = await Promise.all(['state', 'state-b'].map((name) => import(new URL(`./.compiled/${name}.mjs`, import.meta.url))));
    const i18n = await import(new URL('./.compiled/i18n.mjs', import.meta.url));
    assert.equal(i18n.detectLocale(), 'en');
    assert.equal(i18n.LOCALES.length, 10);
    assert.equal(i18n.LOCALE_META.ar.dir, 'rtl');
    for (const locale of i18n.LOCALES) assert.ok(i18n.translate(locale, 'settings.language')); 
    const legacyProject = a.newProject('Existing');
    delete legacyProject.clockSettings;
    delete legacyProject.slots.c1;
    legacyProject.slots.e2 = 'next';
    value = { version: 2, settings: { locale: 'fa', calendar: 'jalali', hour12: true, startProject: 'last', activeProjectId: legacyProject.id }, focus: { endsAt: null, minutes: 25 }, projects: [legacyProject] };
    await Promise.all([a.loadState(), b.loadState()]);
    const id = value.projects[0].id;
    assert.equal(value.projects[0].slots.c1, 'clock');
    assert.equal(value.projects[0].slots.e2, 'next');
    assert.deepEqual(value.projects[0].clockSettings, { calendar: 'jalali', hour12: true });
    a.actions.moveSlot(id, 'c1', 's1');
    await waitFor(() => value.projects[0].slots.s1 === 'clock');
    b.actions.setClockHour12(id, false);
    await waitFor(() => value.projects[0].clockSettings.hour12 === false);
    a.actions.removeWidget(id, 's1');
    await waitFor(() => !value.projects[0].slots.s1);
    await b.loadState();
    assert.equal(value.projects[0].slots.c1, undefined);
    a.actions.placeWidget(id, 'e1', 'clock');
    await waitFor(() => value.projects[0].slots.e1 === 'clock');
    a.actions.addNote(id, 'first');
    b.actions.addIdea(id, 'second');
    await waitFor(() => value.projects[0].notes.length === 1 && value.projects[0].ideas.length === 1);
    a.actions.setFundingStatus(id, 'mock-accelerator', 'preparing');
    await waitFor(() => value.projects[0].fundingStatuses?.['mock-accelerator'] === 'preparing');
    await b.loadState();
    assert.equal(value.projects[0].fundingStatuses['mock-accelerator'], 'preparing');
    b.actions.setFundingStatus(id, 'mock-accelerator', 'applied');
    await waitFor(() => value.projects[0].fundingStatuses?.['mock-accelerator'] === 'applied');
    a.actions.setFundingStatus(id, 'mock-accelerator', 'undecided');
    await waitFor(() => !value.projects[0].fundingStatuses?.['mock-accelerator']);
    a.actions.setLocale('ja');
    await waitFor(() => value.settings.locale === 'ja');
    await b.loadState();
    assert.equal(value.settings.locale, 'ja');
    a.actions.setFontSize('small');
    await waitFor(() => value.settings.fontSize === 'small');
    await b.loadState();
    assert.equal(value.settings.fontSize, 'small');
    // Legacy daily snapshots remain visible with an unknown time and are migrated on first write.
    value.moodEntries = { '2026-11-19': { mood: 2, energy: 3, note: 'Earlier note' } };
    a.actions.setMood('2026-11-19', 4);
    await waitFor(() => value.moodEntries['2026-11-19'].events?.length === 4);
    assert.deepEqual(value.moodEntries['2026-11-19'].events.slice(0, 3), [
      { type: 'mood', value: 2, at: null }, { type: 'energy', value: 3, at: null }, { type: 'note', text: 'Earlier note', at: null },
    ]);
    a.actions.setMood('2026-11-20', 2);
    await waitFor(() => value.moodEntries?.['2026-11-20']?.mood === 2);
    b.actions.setMoodEnergy('2026-11-20', 4);
    await waitFor(() => value.moodEntries?.['2026-11-20']?.energy === 4);
    a.actions.setMoodNote('2026-11-20', 'First note');
    b.actions.setMood('2026-11-20', 3);
    a.actions.setMoodNote('2026-11-20', 'Second note');
    b.actions.setMoodEnergy('2026-11-20', 1);
    await waitFor(() => value.moodEntries?.['2026-11-20']?.events?.length === 6);
    await b.loadState();
    const entry = value.moodEntries['2026-11-20'];
    assert.equal(entry.mood, 3);
    assert.equal(entry.energy, 1);
    assert.deepEqual(entry.events.map(event => event.type), ['mood', 'energy', 'note', 'mood', 'note', 'energy']);
    assert.deepEqual(entry.events.filter(event => event.type === 'note').map(event => event.text), ['First note', 'Second note']);
    assert.ok(entry.events.every(event => typeof event.at === 'number'));
    a.actions.setMoodNote('2026-11-20', '  ');
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(value.moodEntries['2026-11-20'].events.length, 6);
    a.actions.startFocus();
    await waitFor(() => value.focus.endsAt != null);
    b.actions.stopFocus();
    await waitFor(() => value.focus.endsAt === null && value.focus.remainingMs > 0);
    failNextSave = true;
    a.actions.addNote(id, 'retry me');
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(value.projects[0].notes.some((note) => note.text === 'retry me'), false);
    a.retryStorage();
    await waitFor(() => value.projects[0].notes.some((note) => note.text === 'retry me'));
    const remaining = value.focus.remainingMs;
    a.actions.startFocus();
    await waitFor(() => value.focus.endsAt != null);
    assert.ok(value.focus.endsAt - Date.now() <= remaining);
    assert.ok(value.focus.endsAt - Date.now() > remaining - 2000);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
async function waitFor(predicate) {
  for (let i = 0; i < 200; i++) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error('Timed out waiting for state');
}

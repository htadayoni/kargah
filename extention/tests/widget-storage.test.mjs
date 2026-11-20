import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('widget storage keeps widgets, projects and global data isolated', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'kargah-storage-'));
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  try {
    const adapter = stripTypeScriptTypes(await readFile('src/lib/storage.ts', 'utf8'), { mode: 'transform' });
    const source = stripTypeScriptTypes(await readFile('src/widgets/sdk/storage.ts', 'utf8'), { mode: 'transform' }).replace("'@/lib/storage'", "'./adapter.mjs'");
    await writeFile(path.join(directory, 'adapter.mjs'), adapter);
    await writeFile(path.join(directory, 'widget.mjs'), source);
    const { createWidgetStorage } = await import(pathToFileURL(path.join(directory, 'widget.mjs')));
    const a = createWidgetStorage('example', 'project-a'), b = createWidgetStorage('example', 'project-b');
    const other = createWidgetStorage('different', 'project-a'), global = createWidgetStorage('example');
    await a.set('value', 1); await b.set('value', 2); await other.set('value', 3); await global.set('value', 4);
    assert.deepEqual(await Promise.all([a.get('value'), b.get('value'), other.get('value'), global.get('value')]), [1, 2, 3, 4]);
    assert.throws(() => createWidgetStorage('../bad'));
    assert.throws(() => a.get('../bad'));
  } finally { await rm(directory, { recursive: true, force: true }); delete globalThis.localStorage; }
});

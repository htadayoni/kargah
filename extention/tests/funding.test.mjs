import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

test('funding cache refreshes after 24 hours, deduplicates tabs and retains stale data on failure', async () => {
  const values = {}; let chain = Promise.resolve();
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: { request(_key, fn) { const task = chain.then(fn); chain = task.catch(() => {}); return task; } } } });
  globalThis.window = { addEventListener() {} };
  globalThis.chrome = { storage: { local: { async get(key) { return { [key]: structuredClone(values[key]) }; }, async set(data) { Object.assign(values, structuredClone(data)); } }, onChanged: { addListener() {} } } };
  const dir = 'tests/.funding-compiled'; await mkdir(dir, { recursive: true });
  try {
    for (const name of ['funding', 'storage']) {
      const code = stripTypeScriptTypes(await readFile(`src/lib/${name}.ts`, 'utf8'), { mode: 'transform' }).replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
      await writeFile(`${dir}/${name}.mjs`, code);
    }
    const { getMockFunding, FUNDING_TTL } = await import(new URL('./.funding-compiled/funding.mjs', import.meta.url));
    let calls = 0; const source = async () => { calls++; return [{ id: 'example' }]; };
    await Promise.all([getMockFunding(source, 1000), getMockFunding(source, 1000)]);
    assert.equal(calls, 1);
    await getMockFunding(source, 1000 + FUNDING_TTL - 1); assert.equal(calls, 1);
    const stale = await getMockFunding(async () => { throw Error('offline'); }, 1000 + FUNDING_TTL);
    assert.equal(stale.stale, true); assert.equal(stale.cache.items[0].id, 'example'); assert.equal(stale.cache.fetchedAt, 1000);
    await getMockFunding(source, 1000 + FUNDING_TTL); assert.equal(calls, 2);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

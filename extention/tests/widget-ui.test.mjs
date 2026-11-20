import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const checker = path.resolve('scripts/check-widget-ui.mjs');
test('widget UI check accepts SDK components and rejects common custom styling', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kargah-widget-'));
  try {
    const widget = path.join(root, 'example');
    await mkdir(widget);
    const source = path.join(widget, 'index.tsx');
    const check = () => spawnSync(process.execPath, [checker, root], { encoding: 'utf8' });
    await writeFile(source, 'export const Example = () => <WidgetText>Example</WidgetText>;');
    assert.equal(check().status, 0);
    await writeFile(source, 'export const Example = () => <div style={{ padding: 5 }}>Example</div>;');
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /CSS attributes/);
    assert.match(result.stderr, /HTML elements/);
    await writeFile(source, 'export const Example = () => <WidgetText>Example</WidgetText>;');
    await writeFile(path.join(widget, 'custom.css'), '.example { padding: 5px }');
    assert.equal(check().status, 1);
  } finally { await rm(root, { recursive: true, force: true }); }
});

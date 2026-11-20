import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Exercise the documented integration in an isolated copy without changing the real registry.
test('a new contributor widget can be registered and typechecked', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kargah-contribution-'));
  try {
    await cp('src', path.join(root, 'src'), { recursive: true });
    await cp('.wxt', path.join(root, '.wxt'), { recursive: true });
    await cp('tsconfig.json', path.join(root, 'tsconfig.json'));
    await cp('package.json', path.join(root, 'package.json'));
    await symlink(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    const statePath = path.join(root, 'src/lib/state.ts');
    const state = await readFile(statePath, 'utf8');
    const newState = state.replace("export type WidgetType = 'clock'", "export type WidgetType = 'community-example' | 'clock'");
    assert.notEqual(newState, state, 'the fixture must extend the widget ID union');
    await writeFile(statePath, newState);
    const widget = path.join(root, 'src/widgets/community-example');
    await mkdir(widget);
    const sample = (await readFile('src/examples/example-widget.tsx', 'utf8')).replace("id: 'next'", "id: 'community-example'");
    await writeFile(path.join(widget, 'index.tsx'), sample);
    const registryPath = path.join(root, 'src/widgets/registry.tsx');
    const registry = await readFile(registryPath, 'utf8');
    const updated = registry.replace("import mood from './mood';", "import example from './community-example';\nimport mood from './mood';").replace('const definitions = {', "const definitions = {\n  'community-example': example,");
    assert.notEqual(updated, registry, 'the fixture must register the widget');
    await writeFile(registryPath, updated);
    const lint = spawnSync(process.execPath, [path.resolve('scripts/check-widget-ui.mjs'), path.join(root, 'src/widgets')], { encoding: 'utf8' });
    assert.equal(lint.status, 0, lint.stderr || lint.error?.message);
    const compile = spawnSync(path.resolve('node_modules/.bin/tsc'), ['--noEmit', '-p', root], { encoding: 'utf8' });
    assert.equal(compile.status, 0, compile.stdout || compile.stderr || compile.error?.message);
  } finally { await rm(root, { recursive: true, force: true }); }
});

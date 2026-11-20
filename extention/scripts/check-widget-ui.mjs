import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.argv[2] ? path.resolve(process.argv[2]) : fileURLToPath(new URL('../src/widgets/', import.meta.url));
const errors = [];
async function checkFile(file) {
    if (/\.(css|scss|sass|less)$/i.test(file)) { errors.push(`${file}: widget CSS is not permitted`); return; }
    if (!/\.[jt]sx?$/.test(file)) return;
    const content = await readFile(file, 'utf8');
    const checks = [
      [/\b(?:className|class|style)\s*=/, 'use SDK components instead of CSS attributes'],
      [/\b(?:import|require)\b[^\n]*['"][^'"]+\.(?:css|scss|sass|less)(?:\?[^'"]*)?['"]/, 'CSS imports are not permitted'],
      ...(/\.[jt]sx$/.test(file) ? [[/<[a-z][\w-]*(?:\s|\/?>)/, 'use SDK components instead of HTML elements']] : []),
      [/<[A-Za-z][^>]*\{\s*\.\.\./s, 'JSX prop spreads are not permitted'],
    ];
    for (const [pattern, message] of checks) if (pattern.test(content)) errors.push(`${file}: ${message}`);
}
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else await checkFile(file);
  }
}
// Detail screens are host-owned legacy UI; all widget card files and new files are checked.
const hostDetailScreens = new Set(['MoodDetail.tsx', 'FundingDetail.tsx']);
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name !== 'sdk') await walk(path.join(root, entry.name));
  else if (entry.isFile() && !hostDetailScreens.has(entry.name)) await checkFile(path.join(root, entry.name));
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Widget UI standards check passed.');

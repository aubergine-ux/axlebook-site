// Checks every link in the built site: internal pages and #anchors must exist, and
// external links must answer. Run after `npm run build`: npm run check
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const pages = new Map();
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) pages.set(p, fs.readFileSync(p, 'utf8'));
  }
};
walk(dist);
const urlOf = (file) => `/${path.relative(dist, file).replace(/index\.html$/, '').replace(/\.html$/, '')}`;
const ids = new Map([...pages].map(([f, html]) => [urlOf(f), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const bad = [];
const external = new Set();
for (const [file, html] of pages) {
  const from = urlOf(file);
  for (const [, href] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(mailto:|data:)/.test(href)) continue;
    if (/^https?:/.test(href)) {
      if (!href.startsWith('https://axlebook.xyz')) external.add(href);
      continue;
    }
    const u = new URL(href, `https://axlebook.xyz${from}`);
    const target = u.pathname;
    const exists = ids.has(target) || fs.existsSync(path.join(dist, decodeURIComponent(target)));
    if (!exists) bad.push(`${from}: ${href} (missing)`);
    else if (u.hash && ids.has(target) && !ids.get(target).has(u.hash.slice(1)))
      bad.push(`${from}: ${href} (no such anchor)`);
  }
}
for (const href of external) {
  try {
    let res = await fetch(href, { method: 'HEAD', redirect: 'follow' });
    if (res.status >= 400) res = await fetch(href, { redirect: 'follow' });
    if (res.status >= 400) bad.push(`${href} (HTTP ${res.status})`);
  } catch (e) {
    bad.push(`${href} (${e.message})`);
  }
}
console.log(`${pages.size} pages, ${external.size} external links checked`);
if (bad.length) {
  console.log(bad.join('\n'));
  process.exit(1);
}
console.log('all links resolve');

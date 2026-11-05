// Turns the brand kit's tokens.json into CSS custom properties for light and dark.
import fs from 'node:fs';

const t = JSON.parse(fs.readFileSync('src/data/tokens.json', 'utf8'));
const vars = (theme) =>
  [...t.color.tokens, ...t.shadow.tokens]
    .map((x) => `  --${x.name}: ${typeof x.value === 'string' ? x.value : x.value[theme]};`)
    .join('\n');
const fixed = [...t.radius.tokens, ...t.spacing.tokens].map((x) => `  --${x.name}: ${x.value};`).join('\n');
const css = `/* From src/data/tokens.json (the Axlebook brand kit). Run npm run tokens after changing it. */
:root {
  color-scheme: light;
${fixed}
${vars('light')}
}
:root[data-theme='dark'] {
  color-scheme: dark;
${vars('dark')}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
${vars('dark').replaceAll('\n  ', '\n    ').replace(/^ {2}/, '    ')}
  }
}
`;
fs.writeFileSync('src/styles/tokens.css', css);

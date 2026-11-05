# axlebook.xyz

The website for [Axlebook](https://github.com/aubergine-ux/axlebook), a self-hosted vehicle
maintenance logbook. It's a static [Astro](https://astro.build) site, deployed to GitHub Pages on
every push to `main`.

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # writes dist/
npm run check    # every internal link, #anchor and external link must resolve
```

Node 22.23.4 or newer.

## Where things come from

- Colours: `src/data/tokens.json` from the Axlebook brand kit, turned into CSS by
  `scripts/tokens.mjs`.
- Fonts (Archivo, IBM Plex Mono), icons, logos and favicons: copied from the brand kit into
  `public/`.
- Screenshots: `src/assets/screenshots/`, from the app's `docs/screenshots/`.
- The configuration reference on the docs page is the app's `.env.example`, copied to
  `src/data/env.example`. Copy it again when the app's file changes.
- The changelog is built from the app repository's GitHub releases at build time.

The site has no analytics, no cookies and makes no requests to other servers. Keep it that way.

## License

Code: [AGPL-3.0](https://github.com/aubergine-ux/axlebook/blob/main/LICENSE), like the app. The
Axlebook name, logo and brand assets belong to the Axlebook project.

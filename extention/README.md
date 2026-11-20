# Kargah extension (کارگاه)

New tab replacement for builders and solo founders. WXT + React + TypeScript + Tailwind v4, Manifest V3.

```bash
npm run dev      # dev mode with a Chrome profile
npm run build    # production build in .output/chrome-mv3
npm run compile  # typecheck
```

Load manually: `chrome://extensions` → Developer mode → Load unpacked → `.output/chrome-mv3`.

## Structure

- `src/entrypoints/newtab/` — the new tab page. The UI lives on a fixed 1672×941 stage (`.k-stage`) scaled to the window; `SCALE_FACTOR` in `App.tsx` is the overall size knob.
- `src/components/Workspace.tsx` — home screen orchestrator (toolbar, project switcher, clock/search/chips, widget slots, shortcuts bar, modals)
- `src/components/Slots.tsx` — 7 widget slots (`e1 e2 e3 s1 s2 s3 c3`); layout mode lets you drag widgets between slots
- `src/widgets/registry.tsx` — registry of widget definitions; see the contribution guide for required metadata, translations, and previews
- `src/lib/state.ts` — one store; each `Project` owns its widgets, notes, ideas, feedback, shortcuts, theme and background
- `src/lib/i18n.ts` — `fa` and `en` dictionaries (add a language = a dictionary + a `LOCALE_META` entry); layout uses logical properties so RTL/LTR mirror automatically
- `src/lib/themes.ts` + `style.css` — themes are CSS variables under `[data-theme]`
- `src/lib/storage.ts` — storage adapter (chrome.storage.local); swap for web app sync later
- `design/backgrounds/` — original PNGs; `public/backgrounds/` — optimized JPGs used by the extension; `design/archive-garage/` — the first (garage) backgrounds

## Local mock features

In `npm run dev`, use the **Dev** button in the main toolbar to toggle developer mode and mock features throughout the app. The mood widget’s trend view then shows mock community data. The switch is stored locally for that browser profile. Mock features are disabled in production builds, regardless of the saved switch. The displayed community percentages are examples, not real user data.

## Contributing widgets

See [the widget contribution guide](docs/widget-contributions.md) for the initial contract, UI standards, and checks.

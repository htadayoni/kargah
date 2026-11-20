# Contributing to Kargah

Thank you for helping improve Kargah. The browser extension is in `extention/`. Install its dependencies with `npm ci`, then run `npm run dev`. For a new widget, read [the widget contribution guide](extention/docs/widget-contributions.md) and the compile-checked example linked there.

Before opening a pull request, run `npm run check:widget-ui`, `npm run compile`, `npm test` and `npm run build` from `extention/`. Explain the problem and behavior, describe testing and include screenshots for UI changes. Check keyboard navigation, accessibility, different themes, and both RTL and LTR layouts. Never include credentials or personal data.

The project is still preparing for public release; maintainers review code, dependencies, privacy and visual consistency before merging. Use a private security report rather than a public issue for vulnerabilities; see [SECURITY.md](SECURITY.md).

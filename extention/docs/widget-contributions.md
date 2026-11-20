# Widget contribution guide

Widgets are bundled with the extension and reviewed before release. They run as trusted application code, not sandboxed plugins. UI checks encourage consistency; they are not a security boundary. Do not add remote executable code, secrets, arbitrary CSS, direct DOM manipulation, or network access without maintainer review.

## Add a widget

1. Create a folder in `src/widgets/` and export a `defineWidget` definition from `index.tsx`. Use a unique, stable `id`, localized `titleKey`, `category`, `Icon`, `description` (English is required; other languages fall back to English), `component`, and `preview`. Import `defineWidget` from `src/widgets/sdk`; see the compile-checked example in `src/examples/example-widget.tsx`.
2. Add its ID to `WidgetType` in `src/lib/state.ts`, register the definition in `src/widgets/registry.tsx`, and add the title to the dictionaries in `src/lib/i18n.ts`. Existing IDs are persisted and must not be renamed without a migration.
3. Render content using the components in `src/widgets/sdk`. The host owns the card, title, padding, radius and placement. Request a shared component or token when the SDK is insufficient; do not create widget-specific CSS.
4. Provide a dedicated preview with representative sample data. It must not use real project data, storage, timers, network requests, or other side effects. `inert` disables interaction only, not effects.
5. Test in RTL and LTR, different themes, supported widget slots and font sizes; check keyboard and screen-reader behavior, long text and empty/error states. Run `npm run check:widget-ui`, `npm run compile`, `npm test`, and `npm run build`.

Community components receive a context with project ID and name, locale, text direction, and widget/project-namespaced storage. Optionally provide a `settings` component receiving the same context and `onClose`. Built-in legacy widgets still use the full `Project` through an internal compatibility adapter. The context is an API boundary, not a security sandbox. The storage adapter does not validate persisted data or serialize concurrent writes. Validate stored values and manage concurrent updates when needed. Version stored schemas and migrate existing data before changing their format. Never store secrets in an extension.

## Visual standards and review

Use `WidgetStack`, `WidgetRow`, `WidgetText`, `WidgetButton`, `WidgetInput`, `WidgetTextArea`, and `WidgetBadge` from `src/widgets/sdk`; their styles use the host's tokens in `style.css`. New widget folders must not include CSS, inline styles, `className`, raw HTML, or JSX prop spreads. The automated check searches for common violations in widget folders and built-in widget card components, but is not a parser or a sandbox: it can miss bypasses or flag comments, and cannot inspect behavior hidden in imported code. Review all changed files, including shared components and code outside the widget folder.

Built-in widget files use shared components; their existing application services remain available through internal compatibility adapters. The larger mood and funding detail views still use their existing styles; clock settings use shared settings components. Their definitions and previews follow the new contract, but these legacy implementations are not yet examples of the new styling API. They must be migrated deliberately, preserving behavior and visual design. The host renders settings and heading actions declared in the widget definition; built-in header implementations use host-owned components.

Widget error boundaries isolate synchronous render errors; event handlers and asynchronous failures still require explicit error handling.

Funding Radar uses mock data. Its existing cache refreshes after 24 hours, retains stale results on failure and deduplicates refreshes. Do not describe mock opportunities as live data or put a future server's credentials in the extension.

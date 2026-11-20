# Funding Radar: mock and future server integration

The current widget uses fictional opportunities only. It is available only in developer mode (`npm run dev`), and makes no network requests. The sample data deliberately has no real application URLs and is marked as mock in the UI. Saved sample IDs belong to each project and remain in local extension storage.

## Current cache

`src/lib/funding.ts` keeps a mock-only cache in `chrome.storage.local` (or localStorage in web preview). On access, a successful response remains fresh for 24 hours from `fetchedAt`. Once expired, the next access refreshes it; opening a tab does not trigger a refresh while it is fresh. Web Locks serialize refreshes across tabs, and each tab rechecks the cache inside the lock. If refresh fails, the old cache remains available and is marked stale. With no cache, an error is shown. The mock cache key is isolated from future production data. This is an elapsed 24-hour TTL, not a midnight or scheduled background refresh; it refreshes on access.

## Proposed live contract (not implemented)

A backend would gather and verify opportunities from approved sources, normalize them and expose a versioned endpoint such as `GET /v1/funding/opportunities`. A response should include stable IDs, organization and program names, type, eligible stages and geographies, funding amount and currency, investment versus grant terms, application URL, deadline including timezone (or null), application status (`open`, `closed`, `unknown`), source URL and `sourceVerifiedAt`, plus dataset version. Clearly separate the source verification time from the client's `fetchedAt`. Validate the response and URL protocols before use; only mark an opportunity open when supported by a verified source. Filters may run locally on a complete cached dataset; if server-side pagination or personalization is introduced, cache keys must include account and query parameters and prevent data from crossing accounts.

For a live adapter, reuse the TTL and lock pattern with a separate versioned live cache key and a real fetch implementation. Handle network/validation failures with stale data and an explicit warning; first-load failures need retry. Confirm server permissions, authentication, API host permissions, rate limits and data licensing before connecting. Source updates and deadline changes may occur within 24 hours, so display verification/fetch timestamps and re-check eligibility and deadline on the official source before users apply. Do not expose mock records in production or mix them into live results.

Future product choices still needed: sources and ingestion/verification process, geographic coverage, backend hosting, matching inputs and explainable rules, API authorization, live opportunity details, and actual application links. The current filters operate only on sample data and do not claim personalized matching.

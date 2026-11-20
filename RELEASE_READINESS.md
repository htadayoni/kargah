# Public release readiness

The repository is locally prepared for a reviewed, bundled widget-contribution model. It is not a sandbox or independent widget marketplace. The selected default source-code license is MIT; choose a different license before publishing if these permissive terms are not desired. Once code is published, recipients may retain rights already granted under that license.

Before making a repository public:

- Verify that all contributors have authority to license their contributions and that the copyright notice is appropriate.
- Verify provenance and redistribution rights for artwork, generated images, logos and brand assets. The source-code license alone does not resolve those rights.
- Audit the actual Git history and the final files to be published for secrets and personal data. The current working directory did not contain a Git repository when checked, so no history could be audited. A limited scan of current extension text files for common private-key and token patterns found no matches; this is not a comprehensive secret scan.
- Review third-party notices and the full transitive dependency tree. Direct packages inspected locally report MIT (React, React DOM, WXT, Tailwind), Apache-2.0 (TypeScript), OFL-1.1 (Inter and Vazirmatn font packages) and CC0-1.0 (Simple Icons). Verify underlying icon trademark restrictions and font notices separately.
- Configure private vulnerability reporting and branch protections after creating the repository; see SECURITY.md.
- Verify the production build as a loaded browser extension, including existing data migration, Persian and English, keyboard navigation, different screen sizes and the widget picker. Local web preview does not exercise all Chrome extension APIs.

Funding Radar remains explicitly mock-only. Do not publish claims that its opportunities are live.

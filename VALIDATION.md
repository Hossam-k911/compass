# Initial release validation

- Angular production compilation passes; routes are loaded lazily. Initial JS/CSS transfer estimate is approximately 75 kB, excluding study content and fonts.
- Content validation: 108 unique bilingual questions, 13 topics, shared code for output exercises, personal biography excluded.
- Chrome smoke tests passed at widths 1440, 768, and 390 px: route navigation, mobile menu, direct question link/reload, language modes, answer reveal, shared code, saved questions, persisted understanding state, HTML topic count, search empty state, practice assessment, invalid backup rejection, valid backup merge, and export filename.
- No runtime errors or page-wide horizontal overflow in the tested pages.
- Home and study screenshots were visually inspected at desktop and mobile sizes.
- The source checker fetched all four official repository versions. A second run against the accepted baseline produced zero changes without changing question content.
- 21st deterministic review found zero errors and zero warnings; informational findings suggested further color-token consolidation.

The smoke test can be rerun with `node scripts/serve.mjs` in one terminal and `node scripts/smoke-test.mjs` in another after a build. Set `CHROME_PATH` if Chrome is installed elsewhere. Set `COMPASS_URL` to test a deployed site. Tests use isolated browser contexts and do not touch a learner's real progress.

These checks do not constitute a fresh technical review of all imported answers, a full accessibility audit, or cross-browser certification.

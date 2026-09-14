# Content review workflow

The initial 107 study questions were imported from senior-angular-study-guide. Phase 1 has reviewed 20 of them: 14 JavaScript and six targeted Angular/RxJS/NgRx questions. The remaining 87 stay marked imported; the introduction template remains a draft. `lastReviewedAt` stays null until a documented review occurs.

1. Inspect weekly GitHub Actions reports and manually submitted market signals. The automated checker covers stable release tags only; it does not infer market demand.
2. Map a proposed update to existing question IDs. Prefer correcting or deepening an existing question over adding duplicates. Record source URL, publication date, technology version, role level, and reason for inclusion.
3. Reproduce code examples in the stated environment (browser vs Node, script vs module). Confirm both output and reasoning. Keep prompt code separate from answer HTML.
4. Review Arabic and English for equivalent meaning, not merely literal translation. Verify source relevance and avoid copying long source excerpts.
5. Update `review.status`, `review.lastReviewedAt`, and `review.versionNotes`; add per-question evidence when available. Use `reviewed` only after review actually happens.
6. Run `npm run check:content`, `npm run check:exercises`, and `npm run build`. Submit a reviewed PR. Do not publish AI-generated changes directly.
7. After assessing source releases, run `node scripts/check-updates.mjs --accept-baseline` and commit the new baseline with the review record. An unchanged baseline intentionally keeps a release visible in later reports.

The initial release baseline is a monitoring starting point, not an assertion that the existing questions cover those versions.

## Next editorial work

- Continue auditing the 87 imported answers, prioritizing Angular core, RxJS, NgRx, then HTML/CSS and engineering scenarios.
- Add browser-specific exercises in a controlled browser runner when runtime differences matter; current executable cases explicitly use Node.js 24 ESM.
- Review the imported answer HTML for examples that are visible only in one language mode, and move them to shared prompts or equivalent bilingual answers.
- Validate market relevance from multiple dated sources; do not label one anecdote as a trend.
- HTML/CSS standards and broader documentation changes need a separate manual or future automated review process.

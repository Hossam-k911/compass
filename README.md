# Compass

**Your guide to developer interviews.**

[Open Compass](https://hossam-k911.github.io/compass/) · [Original study guide](https://hossam-k911.github.io/senior-angular-study-guide/)

A dark, responsive Angular application for focused interview preparation. The first track is Senior Angular and frontend engineering, with 238 Arabic/English questions across 13 topics. This is a new repository; the original `senior-angular-study-guide` site remains separate.

## What works in this first release

- Track overview and ordered learning path, from HTML and JavaScript to senior engineering scenarios.
- Searchable question index, topic filters, stable question links, and English / Arabic / both modes.
- Shared code prompts that remain visible in English mode; answers are revealed on demand.
- Practice sessions for all questions, output exercises, saved questions, or remaining questions. Assessment is explicitly self-reported.
- Saved questions, browser-local progress, and validated JSON export/import that merges progress across devices.
- An editorial workflow, public suggestion template, and weekly stable-release reports for Angular, NgRx, RxJS, and TypeScript. Reports never modify answers automatically.

React and Node.js cards are clearly marked as unavailable. No accounts, cross-device cloud sync, AI grading, live market scraping, or automatic editorial approval are implemented.

## Run

Use Node 24.15 or newer in the Node 24 line (or another Angular 22 compatible version).

```sh
npm ci
npm start
npm run check:content
npm run check:exercises
npm run build
```

## Structure

`src/app/` contains standalone Angular pages, shared answer UI, and a signal-based progress store. Pages load lazily. `public/content/angular-senior.json` is independent study data. `scripts/` validates content and produces release review reports. `content-ops/` holds the review policy and accepted release baseline.

The source is intentionally data-driven so future tracks can reuse the same learning experience. The first release loads one JSON track; adding a second needs a track registry and route parameter, not merely enabling a placeholder card.

## Publishing

GitHub Settings → Pages → Source: **GitHub Actions**. The Pages workflow builds with `/compass/` as its base and deploys on pushes to main. Hash routes let direct question links reload on static hosting.

## Content provenance and limitations

The original 107 answers were imported with their review status preserved. Phase 1 reviewed 20 of them, and the September frontend expansion added 130 reviewed questions with per-answer sources. The personal biography was excluded and replaced by a placeholder-based introduction template. See `content-ops/REVIEW.md` for the editorial workflow.

Progress is stored under `compass.progress.v1` in localStorage. No learner data is sent to a backend. Clearing browser storage loses progress unless it was exported. Google Fonts is an external typography dependency with local font fallbacks.

## Design

Charcoal and muted green surfaces, a restrained lime accent, a persistent desktop index, and mobile navigation. Manrope for English and IBM Plex Sans Arabic for Arabic. All key actions have visible focus states; motion respects reduced-motion preferences. 21st local design context was initialized; hosted catalog search was unavailable without authentication. UI was implemented locally using the UI/UX guidance.

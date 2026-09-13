import { Component } from '@angular/core';
import { Icon } from './icon';
@Component({
  imports: [Icon],
  template: `
    <div class="page-heading">
      <span class="eyebrow accent">BUILT TO KEEP LEARNING</span>
      <h1>Content with a paper trail.</h1>
      <p>
        A useful interview guide should explain where its answers come from, and when they need
        another look.
      </p>
    </div>
    <section class="panel update-banner">
      <span class="pill green">INITIAL RELEASE · 13 SEP 2026</span>
      <h2>A new home for the Angular guide.</h2>
      <p>
        107 existing bilingual questions, plus a customizable introduction template. Organized into
        a learning path, with focused practice, saved questions, and portable progress.
      </p>
      <p class="review-note">
        The original answers have been imported, not freshly reviewed one by one. Version-specific
        claims are pending editorial review. A topic’s documentation link is further reading, not a
        claim that every answer was verified against it.
      </p>
    </section>
    <div class="overview-bottom">
      <section class="panel">
        <span class="eyebrow">HOW AN UPDATE BECOMES AN ANSWER</span>
        <ol class="editorial-steps">
          <li>
            <strong>Watch the sources</strong>
            <p>
              The repository includes a weekly checker for Angular, NgRx, RxJS, and TypeScript
              releases.
            </p>
          </li>
          <li>
            <strong>Identify the impact</strong>
            <p>
              A change report links back to the release. It is a review candidate, not a new
              interview question.
            </p>
          </li>
          <li>
            <strong>Review the explanation</strong>
            <p>
              Check the source, reproduce the code, record version limits, and review both
              languages.
            </p>
          </li>
          <li>
            <strong>Publish deliberately</strong>
            <p>A reviewed pull request updates the content, review date, and change history.</p>
          </li>
        </ol>
      </section>
      <section class="panel">
        <span class="eyebrow">MARKET SIGNALS</span>
        <h2>Relevant beats “trending”.</h2>
        <p>
          Job requirements and voluntarily shared interview experiences can suggest gaps. They need
          dates, role context, and evidence before they affect the path.
        </p>
        <p>
          This release does not scrape job listings or claim to know which questions a company will
          ask. Use the content suggestion form to propose a topic with public sources.
        </p>
        <a
          class="text-link"
          href="https://github.com/Hossam-k911/compass/issues/new?template=content-suggestion.yml"
          target="_blank"
          rel="noopener"
          >Suggest a content update<c-icon name="external"
        /></a>
      </section>
    </div>
    <section class="panel sources-panel">
      <h2>Primary sources we follow</h2>
      <div class="source-grid">
        @for (source of sources; track source.url) {
          <a [href]="source.url" target="_blank" rel="noopener"
            >{{ source.title }}<c-icon name="external"
          /></a>
        }
      </div>
      <a
        href="https://github.com/Hossam-k911/compass/actions"
        class="text-link"
        target="_blank"
        rel="noopener"
        >See checker runs & reports<c-icon name="arrow"
      /></a>
    </section>
  `,
})
export class Updates {
  sources = [
    { title: 'Angular documentation & roadmap', url: 'https://angular.dev/roadmap' },
    { title: 'NgRx documentation', url: 'https://ngrx.io/docs' },
    { title: 'RxJS documentation', url: 'https://rxjs.dev/guide/overview' },
    {
      title: 'TypeScript handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    },
    { title: 'HTML Living Standard', url: 'https://html.spec.whatwg.org/multipage/' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/' },
  ];
}

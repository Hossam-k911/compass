import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from './study.store';
import { Icon } from './icon';
@Component({
  imports: [RouterLink, Icon],
  template: `
    <section class="welcome">
      <div>
        <span class="eyebrow accent">LESS SEARCHING. MORE UNDERSTANDING.</span>
        <h1>Your next chapter<br />starts with <em>direction.</em></h1>
        <p>
          A focused path from “where do I start?” to explaining<br class="desktop-only" />
          your decisions with confidence.
        </p>
        <a
          class="button primary"
          [routerLink]="
            store.progress().lastQuestion ? ['/study', store.progress().lastQuestion] : ['/roadmap']
          "
          >{{ store.progress().lastQuestion ? 'Continue learning' : 'Find your starting point'
          }}<c-icon name="arrow" /></a
        ><span class="hero-note">Built for depth. In English & Arabic.</span>
      </div>
      <div class="compass-art" aria-hidden="true">
        <span class="north">N</span><span class="south">S</span><span class="east">E</span
        ><span class="west">W</span>
        <div class="orbit outer"></div>
        <div class="orbit middle"></div>
        <div class="orbit inner"></div>
        <div class="cross horizontal"></div>
        <div class="cross vertical"></div>
        <div class="needle"><span></span><i></i></div>
        <div class="compass-center"></div>
        <span class="coordinate">30° 02′ N &nbsp; / &nbsp; YOUR NEXT MOVE</span>
      </div>
    </section>
    <div class="stat-strip">
      <div>
        <c-icon name="map" /><span><strong>01</strong> focused learning path</span>
      </div>
      <div>
        <c-icon name="book" /><span
          ><strong>{{ store.questions().length }}</strong> bilingual questions</span
        >
      </div>
      <div>
        <c-icon name="check" /><span
          ><strong>{{ store.percentage() }}%</strong> of your path explored</span
        >
      </div>
    </div>
    <section class="section-heading">
      <div>
        <span class="eyebrow">CHOOSE YOUR DIRECTION</span>
        <h2>Find your learning path</h2>
      </div>
      <span class="subtle">Start with one. Go deep.</span>
    </section>
    <div class="track-layout">
      <article class="track-card featured">
        <div class="track-card-top">
          <span class="angular-logo">A</span><span class="pill green">AVAILABLE NOW</span>
        </div>
        <h3>Angular</h3>
        <p>
          The complete frontend interview path.<br />Fundamentals, reactive thinking, and senior
          decisions.
        </p>
        <div class="tags"><span>Senior</span><span>13 topics</span><span>EN / عربي</span></div>
        <div class="track-bottom">
          <div>
            <strong>{{ store.questions().length }} questions</strong
            ><small>From foundations to production</small>
          </div>
          <a routerLink="/roadmap" class="round-link" aria-label="Explore Angular path"
            ><c-icon name="arrow"
          /></a>
        </div>
      </article>
      <article class="track-card future">
        <div class="track-card-top">
          <span class="tech-symbol">R</span><span class="pill">ON THE HORIZON</span>
        </div>
        <h3>React</h3>
        <p>
          Components, rendering, and the ecosystem.<br />A new direction, built with the same care.
        </p>
        <div class="tags"><span>Coming later</span></div>
        <div class="track-bottom">
          <small>Content is not available yet</small><c-icon name="compass" />
        </div>
      </article>
      <article class="track-card future">
        <div class="track-card-top">
          <span class="tech-symbol">N</span><span class="pill">ON THE HORIZON</span>
        </div>
        <h3>Node.js</h3>
        <p>
          The runtime, APIs, and backend engineering.<br />Another path to explore, when it’s ready.
        </p>
        <div class="tags"><span>Coming later</span></div>
        <div class="track-bottom">
          <small>Content is not available yet</small><c-icon name="compass" />
        </div>
      </article>
    </div>
    <div class="overview-bottom">
      <section class="panel next-steps">
        <div class="section-heading compact">
          <h2>A path, not a pile of links.</h2>
          <c-icon name="map" />
        </div>
        @for (step of steps; track step.n) {
          <div class="step-row">
            <span class="step-number">{{ step.n }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </div>
        }
      </section>
      <section class="panel practice-promo">
        <span class="eyebrow accent">THINK BEFORE YOU REVEAL</span>
        <h2>Knowing it is one thing.<br />Explaining it is another.</h2>
        <p>
          Predict the output. Walk through a trade-off. Say your answer out loud, then compare in
          either language.
        </p>
        <a routerLink="/practice" class="text-link">Enter practice mode <c-icon name="arrow" /></a>
        <div class="code-preview" aria-hidden="true">
          <span class="code-muted">// small question. deep understanding.</span><br /><span
            class="code-green"
            >Promise</span
          >.resolve().then(() => &#123;<br />&nbsp; console.log(<span class="code-string"
            >'your next step'</span
          >);<br />&#125;);
        </div>
      </section>
    </div>
  `,
})
export class Home {
  store = inject(StudyStore);
  steps = [
    {
      n: '01',
      title: 'Build the foundation',
      text: 'Follow the topic order, or jump to the gap you want to close.',
    },
    {
      n: '02',
      title: 'Connect the dots',
      text: 'Study the reasoning in Arabic and practise the explanation in English.',
    },
    {
      n: '03',
      title: 'Make it stick',
      text: 'Recall before revealing. Save the tricky questions and revisit them.',
    },
  ];
}

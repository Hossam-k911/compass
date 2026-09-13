import { Component, computed, inject, signal } from '@angular/core';
import { StudyStore } from './study.store';
import { Icon } from './icon';
import { QuestionView } from './question-view';
import { LanguageSwitch } from './language-switch';
@Component({
  imports: [Icon, QuestionView, LanguageSwitch],
  template: `
    <div class="page-heading row">
      <div>
        <span class="eyebrow accent">RECALL. EXPLAIN. REFLECT.</span>
        <h1>Make the answer yours.</h1>
        <p>A quiet space to practise. No countdown. No guessed AI score.</p>
      </div>
      <language-switch />
    </div>
    <div class="practice-toolbar">
      <label
        >Practise<select
          aria-label="Practice question type"
          [value]="mode()"
          (change)="changeMode($any($event.target).value)"
        >
          <option value="all">All questions</option>
          <option value="output">Predict the output</option>
          <option value="saved">Saved questions</option>
          <option value="remaining">Not yet understood</option>
        </select></label
      ><span>{{ pool().length }} questions in this session</span>
    </div>
    @if (question(); as q) {
      <article class="practice-card panel">
        <div class="question-meta">
          <span class="pill green">{{
            q.kind === 'output' ? 'CODE REASONING' : 'INTERVIEW DISCUSSION'
          }}</span
          ><span class="subtle">{{ index() + 1 }} / {{ pool().length }}</span>
        </div>
        <question-view [question]="q" [revealed]="revealed()" />
        @if (!revealed()) {
          <label class="scratch-label" for="scratch"
            >Your reasoning <span>Optional · stays in this session</span></label
          ><textarea
            id="scratch"
            rows="5"
            placeholder="Write the output or outline your answer. Explain why, not just what."
            [value]="draft()"
            (input)="draft.set($any($event.target).value)"
          ></textarea>
          <div class="practice-hint">
            <c-icon name="clock" /><span
              >Try a 60–90 second explanation out loud, then compare.</span
            >
          </div>
          <button class="button primary" (click)="revealed.set(true)">
            Reveal & compare <c-icon name="arrow" />
          </button>
        } @else {
          <div class="self-review">
            <h3>How did that feel?</h3>
            <p>This is your own assessment, not an automated grade.</p>
            <div class="button-row">
              <button class="button primary" (click)="assess(true)">
                <c-icon name="check" />I can explain this</button
              ><button class="button" (click)="assess(false)">
                <c-icon name="bookmark" />Revisit later
              </button>
            </div>
          </div>
        }
      </article>
      <div class="question-navigation">
        <span>{{ assessed() }} reflected on this session</span
        ><button class="text-link" (click)="next()">Skip to next <c-icon name="arrow" /></button>
      </div>
    } @else {
      <div class="empty-state">
        <h2>No questions in this set.</h2>
        <p>Save a question, or choose another practice mode.</p>
        <button class="button primary" (click)="changeMode('all')">Practise all questions</button>
      </div>
    }
  `,
})
export class Practice {
  store = inject(StudyStore);
  mode = signal('all');
  index = signal(0);
  revealed = signal(false);
  draft = signal('');
  assessed = signal(0);
  // Snapshot the session so marking a question does not silently reshuffle it.
  sessionIds = signal(this.store.questions().map((q) => q.id));
  pool = computed(() =>
    this.sessionIds()
      .map((id) => this.store.questions().find((q) => q.id === id)!)
      .filter(Boolean),
  );
  question = computed(() => this.pool()[this.index()]);
  changeMode(mode: string) {
    this.mode.set(mode);
    this.sessionIds.set(
      this.store
        .questions()
        .filter(
          (q) =>
            mode === 'all' ||
            (mode === 'output' && q.kind === 'output') ||
            (mode === 'saved' && this.store.progress().saved.includes(q.id)) ||
            (mode === 'remaining' && !this.store.progress().learned.includes(q.id)),
        )
        .map((q) => q.id),
    );
    this.index.set(0);
    this.assessed.set(0);
    this.revealed.set(false);
    this.draft.set('');
  }
  next() {
    this.index.update((i) => (this.pool().length ? (i + 1) % this.pool().length : 0));
    this.revealed.set(false);
    this.draft.set('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  assess(understood: boolean) {
    const q = this.question();
    if (!q) return;
    if (understood && !this.store.progress().learned.includes(q.id))
      this.store.toggle(q.id, 'learned');
    if (!understood) {
      if (this.store.progress().learned.includes(q.id)) this.store.toggle(q.id, 'learned');
      if (!this.store.progress().saved.includes(q.id)) this.store.toggle(q.id, 'saved');
    }
    this.assessed.update((n) => n + 1);
    this.next();
  }
}

import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudyStore } from './study.store';
import { Icon } from './icon';
import { LanguageSwitch } from './language-switch';
import { QuestionView } from './question-view';
import { Question } from './models';
@Component({
  imports: [RouterLink, Icon, LanguageSwitch, QuestionView],
  template: `
    <div class="page-heading row">
      <div>
        <span class="eyebrow accent">ANGULAR · SENIOR</span>
        <h1>{{ savedOnly ? 'Your second-look list.' : 'A little more clarity.' }}</h1>
        <p>
          {{
            savedOnly
              ? 'The questions you want to come back to.'
              : 'Understand the why. Practise how you would explain it.'
          }}
        </p>
      </div>
      <language-switch />
    </div>
    <div class="study-tools">
      <label class="search-box"
        ><c-icon name="search" /><input
          type="search"
          aria-label="Search questions"
          placeholder="Search a concept, question, or keyword…"
          [value]="search()"
          (input)="search.set($any($event.target).value)" /></label
      ><label class="select-field"
        ><span class="sr-only">Filter by topic</span
        ><select
          aria-label="Filter by topic"
          [value]="topic()"
          (change)="setTopic($any($event.target).value)"
        >
          <option value="">All topics</option>
          @for (t of store.track()?.topics; track t.id) {
            <option [value]="t.id">{{ t.title }}</option>
          }
        </select></label
      >
    </div>
    <div class="study-layout">
      <aside class="question-index">
        <div class="index-heading">
          <span>QUESTION INDEX</span><span role="status">{{ filtered().length }}</span>
        </div>
        <div class="question-list">
          @for (q of filtered(); track q.id; let i = $index) {
            <a
              [routerLink]="savedOnly ? ['/saved'] : ['/study', q.id]"
              [queryParams]="
                savedOnly
                  ? { q: q.id, search: search() || null }
                  : { topic: topic() || null, search: search() || null }
              "
              [class.current]="current()?.id === q.id"
              [attr.aria-current]="current()?.id === q.id ? 'true' : null"
              (click)="choose(q.id)"
              ><span class="question-number">{{ i + 1 < 10 ? '0' : '' }}{{ i + 1 }}</span
              ><span>{{ q.prompt.en }}</span>
              @if (store.progress().learned.includes(q.id)) {
                <c-icon name="check" />
              }
            </a>
          }
        </div>
      </aside>
      <section class="study-detail">
        @if (current(); as q) {
          <article class="question-card">
            <div class="question-meta">
              <span class="pill">{{ currentTopic()?.title }}</span
              ><button
                class="icon-button"
                [class.accent]="store.progress().saved.includes(q.id)"
                [attr.aria-pressed]="store.progress().saved.includes(q.id)"
                (click)="store.toggle(q.id, 'saved')"
                [attr.aria-label]="
                  store.progress().saved.includes(q.id) ? 'Unsave question' : 'Save question'
                "
              >
                <c-icon name="bookmark" />
              </button>
            </div>
            <question-view [question]="q" [revealed]="reveal()" /><button
              class="button answer-toggle"
              (click)="reveal.set(!reveal())"
              [attr.aria-expanded]="reveal()"
            >
              {{ reveal() ? 'Hide answer · حاول بنفسك' : 'Reveal answer · عرض الإجابة' }}
            </button>
            <div class="question-actions">
              <button
                class="button"
                [class.primary]="store.progress().learned.includes(q.id)"
                [attr.aria-pressed]="store.progress().learned.includes(q.id)"
                (click)="store.toggle(q.id, 'learned')"
              >
                <c-icon name="check" />{{
                  store.progress().learned.includes(q.id) ? 'Understood' : 'Mark as understood'
                }}</button
              ><button class="text-link" (click)="copyLink(q.id)">
                Copy question link <c-icon name="external" />
              </button>
            </div>
            <div class="review-note">
              Imported content · Version-specific details await editorial review.
              <a routerLink="/updates">How we maintain content</a>
            </div>
          </article>
          <div class="question-navigation">
            <button class="button" [disabled]="position() <= 0" (click)="move(-1)">
              ← Previous</button
            ><span>{{ position() + 1 }} of {{ filtered().length }}</span
            ><button
              class="button"
              [disabled]="position() >= filtered().length - 1"
              (click)="move(1)"
            >
              Next question <c-icon name="arrow" />
            </button>
          </div>
          @if (currentTopic()?.sources?.length) {
            <div class="reading">
              <span class="eyebrow">FURTHER READING</span>
              @for (source of currentTopic()?.sources; track source.url) {
                <a [href]="source.url" target="_blank" rel="noopener"
                  >{{ source.title }}<c-icon name="external"
                /></a>
              }
            </div>
          }
        } @else {
          <div class="empty-state">
            <c-icon name="bookmark" />
            <h2>{{ savedOnly ? 'Nothing saved here yet.' : 'No matching questions.' }}</h2>
            <p>
              {{
                savedOnly
                  ? 'Use the bookmark button on a question to keep it here.'
                  : 'Try a different keyword or choose another topic.'
              }}
            </p>
            <a routerLink="/study" class="button primary">Browse questions</a>
          </div>
        }
      </section>
    </div>
  `,
})
export class Study {
  store = inject(StudyStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  savedOnly = !!this.route.snapshot.data['saved'];
  search = signal('');
  topic = signal('');
  selectedId = signal('');
  reveal = signal(false);
  filtered = computed(() => {
    const text = this.search().trim().toLowerCase();
    return (this.store.track()?.topics ?? [])
      .filter((t) => !this.topic() || t.id === this.topic())
      .flatMap((t) => t.questions)
      .filter(
        (q) =>
          (!this.savedOnly || this.store.progress().saved.includes(q.id)) &&
          (!text ||
            `${q.prompt.en} ${q.prompt.ar} ${q.answer.en} ${q.answer.ar}`
              .toLowerCase()
              .includes(text)),
      );
  });
  current = computed<Question | undefined>(
    () => this.filtered().find((q) => q.id === this.selectedId()) ?? this.filtered()[0],
  );
  position = computed(() => this.filtered().findIndex((q) => q.id === this.current()?.id));
  currentTopic = computed(() =>
    this.store.track()?.topics.find((t) => t.questions.some((q) => q.id === this.current()?.id)),
  );
  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.selectedId.set(p.get('id') ?? ''));
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((p) => {
      this.topic.set(p.get('topic') ?? '');
      this.search.set(p.get('search') ?? '');
      if (this.savedOnly) this.selectedId.set(p.get('q') ?? '');
    });
    effect(() => {
      const q = this.current();
      this.reveal.set(false);
      if (q) untracked(() => this.store.visit(q));
    });
  }
  choose(id: string) {
    this.selectedId.set(id);
    this.reveal.set(false);
  }
  setTopic(id: string) {
    this.search.set('');
    void this.router.navigate([this.savedOnly ? '/saved' : '/study'], {
      queryParams: { topic: id || null },
    });
  }
  move(delta: number) {
    const next = this.filtered()[this.position() + delta];
    if (next) {
      this.choose(next.id);
      void this.router.navigate(this.savedOnly ? ['/saved'] : ['/study', next.id], {
        queryParams: {
          topic: this.topic() || null,
          search: this.search() || null,
          ...(this.savedOnly ? { q: next.id } : {}),
        },
      });
    }
  }
  async copyLink(id: string) {
    try {
      await navigator.clipboard.writeText(
        `${location.href.split('#')[0]}#/study/${encodeURIComponent(id)}`,
      );
      this.store.notice.set('Question link copied.');
    } catch {
      this.store.notice.set('Copy the question address from your browser to share it.');
    }
  }
}

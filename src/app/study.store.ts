import { Injectable, computed, signal } from '@angular/core';
import { Language, Progress, Track, Question } from './models';
const blank = (): Progress => ({
  version: 1,
  learned: [],
  saved: [],
  lastQuestion: null,
  language: 'both',
});
@Injectable({ providedIn: 'root' })
export class StudyStore {
  readonly track = signal<Track | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly notice = signal('');
  readonly progress = signal<Progress>(this.readProgress());
  readonly questions = computed(() => this.track()?.topics.flatMap((t) => t.questions) ?? []);
  readonly learnedCount = computed(
    () => this.questions().filter((q) => this.progress().learned.includes(q.id)).length,
  );
  readonly percentage = computed(() =>
    this.questions().length ? Math.round((this.learnedCount() / this.questions().length) * 100) : 0,
  );
  constructor() {
    void this.load();
  }
  async load() {
    this.loading.set(true);
    this.error.set('');
    try {
      const res = await fetch('content/angular-senior.json');
      if (!res.ok) throw new Error('Unavailable');
      const data = (await res.json()) as Track;
      if (data.schemaVersion !== 1 || !Array.isArray(data.topics))
        throw new Error('Invalid content');
      this.track.set(data);
    } catch {
      this.error.set('We could not load the learning path. Check your connection and try again.');
    } finally {
      this.loading.set(false);
    }
  }
  private valid(value: unknown): value is Progress {
    if (!value || typeof value !== 'object') return false;
    const p = value as Progress;
    return (
      p.version === 1 &&
      Array.isArray(p.learned) &&
      p.learned.length <= 10000 &&
      p.learned.every((x) => typeof x === 'string') &&
      Array.isArray(p.saved) &&
      p.saved.length <= 10000 &&
      p.saved.every((x) => typeof x === 'string') &&
      (p.lastQuestion === null || typeof p.lastQuestion === 'string') &&
      ['en', 'ar', 'both'].includes(p.language)
    );
  }
  private readProgress(): Progress {
    try {
      const p = JSON.parse(localStorage.getItem('compass.progress.v1') ?? 'null');
      return this.valid(p) ? p : blank();
    } catch {
      return blank();
    }
  }
  private persist(next: Progress) {
    this.progress.set(next);
    try {
      localStorage.setItem('compass.progress.v1', JSON.stringify(next));
    } catch {
      this.notice.set('Browser storage is unavailable. Export progress before closing this tab.');
    }
  }
  toggle(id: string, key: 'learned' | 'saved') {
    const p = this.progress();
    this.persist({
      ...p,
      [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id],
    });
  }
  language(language: Language) {
    this.persist({ ...this.progress(), language });
  }
  visit(q: Question) {
    this.persist({ ...this.progress(), lastQuestion: q.id });
  }
  topicCount(id: string) {
    return (
      this.track()
        ?.topics.find((t) => t.id === id)
        ?.questions.filter((q) => this.progress().learned.includes(q.id)).length ?? 0
    );
  }
  exportProgress() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(this.progress(), null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compass-progress.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.notice.set('Progress exported. Keep the file to restore it on another device.');
  }
  async importProgress(file: File) {
    try {
      if (file.size > 1000000) throw new Error();
      const p: unknown = JSON.parse(await file.text());
      if (!this.valid(p)) throw new Error();
      const current = this.progress();
      this.persist({
        ...current,
        learned: [...new Set([...current.learned, ...p.learned])],
        saved: [...new Set([...current.saved, ...p.saved])],
        language: p.language,
        lastQuestion: p.lastQuestion ?? current.lastQuestion,
      });
      this.notice.set('Progress imported and merged with this device.');
    } catch {
      this.notice.set('That file is not a valid Compass progress backup. Your progress was kept.');
    }
  }
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from './study.store';
import { Icon } from './icon';
@Component({
  imports: [RouterLink, Icon],
  template: `
    <div class="page-heading">
      <span class="eyebrow accent">SMALL STEPS ADD UP</span>
      <h1>Your progress, your pace.</h1>
      <p>
        Track what you can explain. These are self-assessments, not a prediction of interview
        success.
      </p>
    </div>
    <div class="progress-stats">
      <div class="panel">
        <span class="eyebrow">UNDERSTOOD</span
        ><strong
          >{{ store.learnedCount() }}<small> / {{ store.questions().length }}</small></strong
        >
      </div>
      <div class="panel">
        <span class="eyebrow">PATH COMPLETION</span
        ><strong>{{ store.percentage() }}<small>%</small></strong>
      </div>
      <div class="panel">
        <span class="eyebrow">SAVED FOR LATER</span
        ><strong>{{ store.progress().saved.length }}</strong>
      </div>
    </div>
    <section class="panel progress-topics">
      <h2>Where you are on the path</h2>
      @for (t of store.track()?.topics; track t.id) {
        <a class="progress-topic" [routerLink]="['/study']" [queryParams]="{ topic: t.id }"
          ><div>
            <strong>{{ t.title }}</strong
            ><small>{{ store.topicCount(t.id) }} / {{ t.questions.length }}</small>
          </div>
          <div class="meter">
            <span [style.width.%]="(store.topicCount(t.id) / t.questions.length) * 100"></span></div
        ></a>
      }
    </section>
    <section class="panel backup">
      <div>
        <h2>Take your progress with you.</h2>
        <p>
          Progress is saved in this browser. Export a backup to continue on another device;
          importing merges it with what is already here.
        </p>
      </div>
      <div class="button-row">
        <button class="button primary" (click)="store.exportProgress()">
          <c-icon name="download" />Export progress</button
        ><label class="button import-button"
          >Import backup<input
            type="file"
            accept="application/json,.json"
            aria-label="Import progress backup"
            (change)="importFile($event)"
        /></label>
      </div>
    </section>
  `,
})
export class ProgressPage {
  store = inject(StudyStore);
  importFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) void this.store.importProgress(file);
    input.value = '';
  }
}

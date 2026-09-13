import { Component, inject } from '@angular/core';
import { StudyStore } from './study.store';
@Component({
  selector: 'language-switch',
  template: `<div class="segmented" role="group" aria-label="Answer language">
    <button
      [class.selected]="store.progress().language === 'en'"
      [attr.aria-pressed]="store.progress().language === 'en'"
      (click)="store.language('en')"
    >
      English</button
    ><button
      [class.selected]="store.progress().language === 'ar'"
      [attr.aria-pressed]="store.progress().language === 'ar'"
      (click)="store.language('ar')"
      lang="ar"
    >
      عربي</button
    ><button
      [class.selected]="store.progress().language === 'both'"
      [attr.aria-pressed]="store.progress().language === 'both'"
      (click)="store.language('both')"
    >
      Both
    </button>
  </div>`,
})
export class LanguageSwitch {
  store = inject(StudyStore);
}

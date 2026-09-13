import { Component, inject, input } from '@angular/core';
import { StudyStore } from './study.store';
import { Question } from './models';
@Component({
  selector: 'question-view',
  template: `
    <div class="question-prompt">
      @if (store.progress().language !== 'ar') {
        <h2 lang="en">{{ question().prompt.en }}</h2>
      }
      @if (store.progress().language !== 'en') {
        <h2 lang="ar" dir="rtl" class="arabic-question">{{ question().prompt.ar }}</h2>
      }
    </div>
    @if (question().codeHtml) {
      <div class="shared-code">
        <div class="code-heading">
          PREDICT THE OUTPUT <span>Read the code before revealing the answer</span>
        </div>
        <div [innerHTML]="question().codeHtml" dir="ltr"></div>
      </div>
    }
    @if (revealed()) {
      <div class="answers">
        @if (store.progress().language !== 'ar') {
          <section class="answer-panel" lang="en">
            <div class="answer-label">
              <span class="status-dot"></span> INTERVIEW ANSWER · ENGLISH
            </div>
            <div class="prose" [innerHTML]="question().answer.en"></div>
          </section>
        }
        @if (store.progress().language !== 'en') {
          <section class="answer-panel" lang="ar" dir="rtl">
            <div class="answer-label">الشرح بالعربي</div>
            <div class="prose" [innerHTML]="question().answer.ar"></div>
          </section>
        }
      </div>
    }
  `,
})
export class QuestionView {
  store = inject(StudyStore);
  question = input.required<Question>();
  revealed = input(true);
}

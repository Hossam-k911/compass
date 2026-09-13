import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudyStore } from './study.store';
import { Icon } from './icon';
@Component({
  imports: [RouterLink, Icon],
  template: `
    <div class="page-heading">
      <span class="eyebrow accent">YOUR ANGULAR LEARNING PATH</span>
      <h1>Start solid. Build depth.</h1>
      <p>A sequence from web foundations to the conversations that define a senior engineer.</p>
    </div>
    <div class="path-summary panel">
      <span class="angular-logo">A</span>
      <div>
        <h2>Angular · Senior</h2>
        <p>
          {{ store.track()?.topics?.length }} topics · {{ store.questions().length }} questions ·
          English & Arabic
        </p>
      </div>
      <div class="path-progress">
        <strong>{{ store.percentage() }}%</strong><span>understood</span>
      </div>
    </div>
    <div class="roadmap">
      @for (stage of stages(); track stage.name; let index = $index) {
        <section class="stage">
          <div class="stage-marker">{{ index + 1 }}</div>
          <div class="stage-content">
            <span class="eyebrow">STAGE {{ index + 1 }}</span>
            <h2>{{ stage.name }}</h2>
            <div class="topic-grid">
              @for (topic of stage.topics; track topic.id) {
                <a class="topic-row" [routerLink]="['/study']" [queryParams]="{ topic: topic.id }"
                  ><div>
                    <h3>{{ topic.title }}</h3>
                    <p>{{ topic.titleAr }}</p>
                    <small
                      >{{ topic.questions.length }} questions ·
                      {{ store.topicCount(topic.id) }} understood</small
                    >
                  </div>
                  <c-icon
                    [name]="
                      store.topicCount(topic.id) === topic.questions.length ? 'check' : 'chevron'
                    "
                /></a>
              }
            </div>
          </div>
        </section>
      }
    </div>
  `,
})
export class Roadmap {
  store = inject(StudyStore);
  stages = computed(() => {
    const topics = this.store.track()?.topics ?? [];
    return [...new Set(topics.map((t) => t.stage))].map((name) => ({
      name,
      topics: topics.filter((t) => t.stage === name),
    }));
  });
}

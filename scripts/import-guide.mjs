import fs from 'node:fs';
import path from 'node:path';
// Explicit input; migration never writes to the original study guide.
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/import-guide.mjs path/to/data.js');
const source = JSON.parse(
  fs
    .readFileSync(input, 'utf8')
    .replace(/^window\.STUDY_DATA\s*=\s*/, '')
    .replace(/;\s*$/, ''),
);
const names = {
  'topic-1': [
    'HTML, CSS & Sass',
    'Web foundations',
    'https://developer.mozilla.org/en-US/docs/Learn_web_development',
  ],
  'topic-13': ['HTML in depth', 'Web foundations', 'https://html.spec.whatwg.org/multipage/'],
  'topic-2': [
    'JavaScript & the runtime',
    'Language essentials',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  ],
  'topic-3': [
    'TypeScript',
    'Language essentials',
    'https://www.typescriptlang.org/docs/handbook/intro.html',
  ],
  'topic-4': ['OOP, SOLID & patterns', 'Engineering fundamentals', 'https://angular.dev/guide/di'],
  'topic-5': [
    'Algorithms, Git & HTTP',
    'Engineering fundamentals',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP',
  ],
  'topic-6': [
    'Angular core & DI',
    'The Angular platform',
    'https://angular.dev/guide/di/hierarchical-dependency-injection',
  ],
  'topic-7': [
    'Routing, forms & authentication',
    'The Angular platform',
    'https://angular.dev/guide/routing',
  ],
  'topic-8': ['RxJS & async flows', 'Reactive applications', 'https://rxjs.dev/guide/operators'],
  'topic-9': ['Signals & NgRx', 'Reactive applications', 'https://ngrx.io/guide/store'],
  'topic-10': [
    'Performance, SSR & testing',
    'Production readiness',
    'https://angular.dev/best-practices/runtime-performance',
  ],
  'topic-11': [
    'Senior engineering scenarios',
    'Production readiness',
    'https://angular.dev/style-guide',
  ],
};
const topics = Object.entries(names).map(([id, [title, stage, url]]) => {
  const old = source.sections.find((s) => s.id === id);
  return {
    id,
    title,
    titleAr: old.shortTitle,
    stage,
    description: old.questions
      .slice(0, 2)
      .map((q) => q.enTitle)
      .join(' '),
    sources: [{ title: 'Official documentation', url }],
    questions: old.questions.map((q) => {
      const output =
        /output|log order|console order|print|logged/i.test(q.enTitle) ||
        /الناتج|الـ output|ترتيب.*console/i.test(q.arTitle);
      const code = output ? (q.arHtml.match(/<pre>[\s\S]*?<\/pre>/)?.[0] ?? '') : '';
      return {
        id: q.id,
        prompt: { ar: q.arTitle, en: q.enTitle },
        answer: { ar: code ? q.arHtml.replace(code, '') : q.arHtml, en: q.enHtml },
        codeHtml: code,
        kind: output && code ? 'output' : 'discussion',
        review: {
          status: 'imported',
          lastReviewedAt: null,
          versionNotes:
            'Imported from the original guide; version-specific answers await editorial review.',
        },
      };
    }),
  };
});
topics.push({
  id: 'introduction',
  title: 'Tell your story',
  titleAr: 'تقديم نفسك وخبرتك',
  stage: 'Interview preparation',
  description: 'A clear, honest introduction and a structured project story.',
  sources: [],
  questions: [
    {
      id: 'intro-1',
      prompt: {
        en: 'Tell me about yourself and a project you are proud of.',
        ar: 'عرّف نفسك واتكلم عن مشروع فخور بيه.',
      },
      kind: 'discussion',
      codeHtml: '',
      answer: {
        en: '<p>I am a frontend developer with [X years] of experience, focusing on [your main technologies]. In my current or most recent role at [company], I worked on [product and users], where I was responsible for [your actual scope].</p><p>One project I am proud of is [project]. We faced [specific challenge]. I chose [approach] because [reason and trade-off]. I implemented [your contribution] and validated the result using [measurement or feedback]. The outcome was [verified result].</p><p>I am looking for a role where I can contribute to [relevant engineering challenge] and continue growing in [specific area].</p><p><strong>Keep it to 60–90 seconds.</strong> Replace every placeholder with a true detail. If you do not have a measured result, describe an observable outcome instead of inventing a percentage. Prepare follow-ups about alternatives, testing, and what you would change.</p>',
        ar: '<p>أنا Frontend Developer عندي [عدد سنين خبرتك]، وتركيزي الأساسي على [التكنولوجيز]. في آخر شغل ليا في [الشركة] اشتغلت على [نوع المنتج ومين بيستخدمه]، وكنت مسؤول عن [دورك الفعلي].</p><p>من المشاريع اللي فخور بيها [المشروع]. واجهتنا مشكلة [محددة]، واخترت [الحل] بسبب [السبب والـ trade-off]. مساهمتي كانت [اللي نفذته بنفسك]، وتأكدنا من النتيجة عن طريق [قياس أو feedback]. النتيجة كانت [نتيجة حقيقية].</p><p>بدور على دور أقدر أضيف فيه في [احتياج مرتبط بالوظيفة] وأتطور في [مجال محدد].</p><p><strong>خلي الإجابة من دقيقة لدقيقة ونص.</strong> بدّل الأقواس ببيانات حقيقية. لو معندكش قياس، اذكر نتيجة لاحظتوها بدل ما تخترع نسبة. حضّر تفاصيل البدائل والاختبارات وإيه اللي هتعمله بشكل مختلف.</p>',
      },
      review: {
        status: 'draft',
        lastReviewedAt: null,
        versionNotes: 'Customizable template; not a personal biography.',
      },
    },
  ],
});
const data = {
  schemaVersion: 1,
  id: 'angular-senior',
  title: 'Angular',
  level: 'Senior',
  description: 'From web fundamentals to the decisions that matter in production.',
  topics,
};
fs.mkdirSync('public/content', { recursive: true });
fs.writeFileSync('public/content/angular-senior.json', JSON.stringify(data, null, 2) + '\n');
console.log(
  `Imported ${topics.reduce((n, t) => n + t.questions.length, 0)} questions in ${topics.length} topics. Personal introduction excluded and replaced with placeholders.`,
);

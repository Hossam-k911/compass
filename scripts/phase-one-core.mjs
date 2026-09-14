import fs from 'node:fs';
import assert from 'node:assert/strict';

const path = 'public/content/angular-senior.json';
const track = JSON.parse(fs.readFileSync(path, 'utf8'));
const questions = new Map(track.topics.flatMap((topic) => topic.questions).map((q) => [q.id, q]));
const angularDi = { title: 'Angular · Hierarchical injectors', url: 'https://angular.dev/guide/di/hierarchical-dependency-injection' };
const angularCleanup = { title: 'Angular · takeUntilDestroyed', url: 'https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed' };
const signals = { title: 'Angular · Signals', url: 'https://angular.dev/guide/signals' };
const ngrx = { title: 'NgRx · Store guide', url: 'https://ngrx.io/guide/store' };
const selectors = { title: 'NgRx · Selectors', url: 'https://ngrx.io/guide/store/selectors' };
const rxjs = (name) => ({ title: `RxJS · ${name}`, url: `https://rxjs.dev/api/operators/${name}` });
const evidence = {
  'q-25': [angularDi, angularCleanup],
  'q-33': ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'].map(rxjs),
  'q-36': [signals, ngrx],
  'q-37': [selectors, ngrx],
  'q-100': [rxjs('shareReplay')],
  'q-102': [signals, ngrx],
};
const duplicate = questions.get('q-102');
duplicate.prompt.en = 'Design state for a product search page and a shared shopping cart. Where would Signals and NgRx fit?';
duplicate.prompt.ar = 'صمّم الـstate لصفحة بحث منتجات وسلة مشتركة بين صفحات التطبيق. أين تستخدم Signals وأين تستخدم NgRx؟';
duplicate.answer.en = '<p>I would keep the search input, open filters, and local derived UI state in Signals near the search feature. I would model the shared cart with explicit commands and derived selectors in NgRx if multiple routes need to coordinate updates, persistence, pricing, and error handling. I would keep API calls in effects or services, not reducers. I would avoid duplicating the same cart state in a Signal and the Store; a Signal may present selected Store data to a component. The boundary can change with product complexity, so I would start with ownership and data flow, then measure the overhead.</p>';
duplicate.answer.ar = '<p>أضع نص البحث والفلاتر المفتوحة والـUI state المشتقة في Signals قريبة من feature البحث. السلة المشتركة قد تستفيد من NgRx عندما تحتاج صفحات كثيرة إلى تنسيق التحديثات والحفظ والأسعار والأخطاء؛ أستخدم actions وselectors واضحة، وأترك API calls للـeffects أو services وليس reducer. لا أحتفظ بنسختين مستقلتين من بيانات السلة في Signal وStore؛ يمكن للـSignal عرض بيانات مختارة من Store. القرار يعتمد على ملكية البيانات وتعقيد تدفقها.</p>';
for (const [id, sources] of Object.entries(evidence)) {
  const q = questions.get(id);
  assert.equal(q.review.status, 'imported', `Already audited: ${id}`);
  q.review = { status: 'reviewed', lastReviewedAt: '2026-09-14', versionNotes: 'Concept and trade-offs checked against current official documentation.', sources };
}
fs.writeFileSync(path, `${JSON.stringify(track, null, 2)}\n`);
console.log(`Updated ${Object.keys(evidence).length} Angular, RxJS, and NgRx questions.`);

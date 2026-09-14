import fs from 'node:fs';
import assert from 'node:assert/strict';

const path = 'public/content/angular-senior.json';
const track = JSON.parse(fs.readFileSync(path, 'utf8'));
const js = track.topics.find((topic) => topic.id === 'topic-2');
const byId = new Map(js.questions.map((question) => [question.id, question]));
const source = (title, slug) => ({ title, url: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/${slug}` });
const docs = {
  scope: source('MDN · let and temporal dead zone', 'Reference/Statements/let'),
  var: source('MDN · var', 'Reference/Statements/var'),
  this: source('MDN · this', 'Reference/Operators/this'),
  prototype: source('MDN · Prototype chain', 'Guide/Inheritance_and_the_prototype_chain'),
  closure: source('MDN · Closures', 'Guide/Closures'),
  event: source('MDN · JavaScript execution model', 'Reference/Execution_model'),
  async: source('MDN · async function', 'Reference/Statements/async_function'),
  promise: source('MDN · Promise', 'Reference/Global_Objects/Promise'),
  spread: source('MDN · Spread syntax', 'Reference/Operators/Spread_syntax'),
  observable: { title: 'RxJS · Observable guide', url: 'https://rxjs.dev/guide/observable' },
  bubbling: { title: 'MDN · Event bubbling', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling' },
};
const evidence = {
  'q-6': [docs.scope, docs.var], 'q-7': [docs.this], 'q-8': [docs.prototype],
  'q-9': [docs.closure], 'q-10': [docs.var, docs.closure], 'q-11': [docs.event],
  'q-12': [docs.async, docs.event], 'q-13': [docs.promise, docs.observable],
  'q-75': [docs.this], 'q-76': [docs.event], 'q-77': [docs.spread],
  'q-78': [docs.promise], 'q-79': [docs.closure], 'q-80': [docs.bubbling, docs.event],
};
function decodeCode(html) {
  return html.match(/<code[^>]*>([\s\S]*?)<\/code>/)?.[1]
    .replaceAll('&gt;', '>').replaceAll('&lt;', '<')
    .replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&amp;', '&').trim();
}
function exercise(id, stdout, options = {}) {
  const question = byId.get(id);
  const code = options.code ?? decodeCode(question.codeHtml);
  assert(code, `Missing code: ${id}`);
  question.kind = 'output';
  question.codeHtml = '';
  question.exercise = {
    runtime: 'Node.js 24 · ECMAScript module',
    cases: [{ label: { en: 'Predict the console', ar: 'توقع ترتيب الـ console' }, code, expected: { stdout, ...(options.error ? { error: options.error } : {}) } }],
  };
}
exercise('q-6', ['undefined', '2'], { code: 'console.log(a);\nvar a = 2;\nconsole.log(a);' });
byId.get('q-6').exercise.cases.push({
  label: { en: 'What happens with let?', ar: 'ماذا يحدث مع let؟' },
  code: 'console.log(b);\nlet b = 2;\nconsole.log(b);',
  expected: { stdout: [], error: 'ReferenceError' },
});
exercise('q-7', ['Mona'], { code: 'const user = {\n  name: "Mona",\n  say() {\n    const read = () => this.name;\n    return read();\n  },\n};\nconsole.log(user.say());' });
exercise('q-8', ['viewer false'], { code: 'const base = { role: "viewer" };\nconst user = Object.create(base);\nuser.name = "Ali";\nconsole.log(user.role, Object.hasOwn(user, "role"));' });
exercise('q-9', ['1 2 1 3']);
exercise('q-10', ['end', '3', '3', '3']);
exercise('q-11', ['A', 'B', 'P1', 'M', 'P2', 'T']);
exercise('q-12', ['3', '1', '5', '2', '4'], { code: 'async function task() {\n  console.log(1);\n  await Promise.resolve();\n  console.log(2);\n}\nconsole.log(3);\ntask().then(() => console.log(4));\nconsole.log(5);' });
exercise('q-75', ['Mona'], { code: 'const user = {\n  name: "Mona",\n  regular() { return this.name; },\n  arrow: () => this?.name,\n};\nconsole.log(user.regular());\nconsole.log(user.arrow());' });
byId.get('q-75').exercise.cases[0].expected.stdout.push('undefined');
byId.get('q-75').prompt.en = 'What prints in an ECMAScript module, and why does the arrow not use the object as this?';
byId.get('q-75').prompt.ar = 'ما الناتج داخل ECMAScript module، ولماذا لا تستخدم الـarrow الـobject كـthis؟';
byId.get('q-75').answer.en = '<p><code>Mona</code>, then <code>undefined</code>. The regular method receives <code>user</code> as its call receiver. The arrow captures the module’s top-level <code>this</code>, which is <code>undefined</code>; optional chaining makes the second read safe. The runtime is specified because a classic browser script or CommonJS wrapper has a different surrounding <code>this</code>.</p>';
byId.get('q-75').answer.ar = '<p>الناتج <code>Mona</code> ثم <code>undefined</code>. استدعاء الـmethod العادية يجعل <code>this</code> تشير إلى <code>user</code>، أما الـarrow فتأخذ <code>this</code> من نطاق الـmodule العلوي وقيمتها <code>undefined</code>. استخدمنا optional chaining حتى لا يحدث خطأ. تحديد بيئة التشغيل مهم لأن الـclassic script وCommonJS يختلفان.</p>';
exercise('q-76', ['A', 'E', 'C', 'D', 'B']);
exercise('q-77', ['Alex false true']);
exercise('q-79', ['2'], { code: 'function makeReader() {\n  let value = { count: 1 };\n  const read = () => value.count;\n  value = { count: 2 };\n  return read;\n}\nconsole.log(makeReader()());' });
byId.get('q-79').prompt.en = 'Does a closure capture a frozen value or a live binding? Predict the output.';
byId.get('q-79').prompt.ar = 'هل الـclosure تحفظ قيمة ثابتة أم الـbinding نفسها؟ توقع الناتج.';
byId.get('q-79').answer.en = '<p>It prints <code>2</code>. The arrow reads the <code>value</code> binding when called; it does not freeze the original object. Reassigning the binding before the call changes what the closure sees. A long-lived closure retains reachable state while the closure remains reachable, which matters when the retained graph is large or obsolete.</p>';
byId.get('q-79').answer.ar = '<p>الناتج <code>2</code>. الـarrow تقرأ الـbinding المسماة <code>value</code> عند الاستدعاء؛ لا تحتفظ بنسخة مجمدة من الـobject الأول. إعادة تعيين الـbinding قبل الاستدعاء تغير ما تراه الـclosure. احتفاظ callback طويل العمر ببيانات كبيرة غير مطلوبة قد يسبب نموًا في الذاكرة.</p>';
for (const [id, sources] of Object.entries(evidence)) {
  const question = byId.get(id);
  assert.equal(question.review.status, 'imported', `Already audited: ${id}`);
  question.review = { status: 'reviewed', lastReviewedAt: '2026-09-14', versionNotes: question.exercise ? 'ECMAScript behavior · output reproduced in Node.js 24 ESM.' : 'Concepts checked against linked documentation.', sources };
}
fs.writeFileSync(path, `${JSON.stringify(track, null, 2)}\n`);
console.log(`Updated ${Object.keys(evidence).length} JavaScript questions.`);

import fs from 'node:fs';
import assert from 'node:assert/strict';
const track = JSON.parse(fs.readFileSync('public/content/angular-senior.json', 'utf8'));
const ids = new Set();
assert.equal(track.schemaVersion, 1);
assert.equal(track.topics.length, 13);
for (const topic of track.topics) {
  assert(topic.title && topic.id && topic.questions.length);
  for (const q of topic.questions) {
    assert(!ids.has(q.id), `Duplicate id: ${q.id}`);
    ids.add(q.id);
    for (const lang of ['ar', 'en'])
      assert(q.prompt[lang]?.trim() && q.answer[lang]?.trim(), `Missing ${lang}: ${q.id}`);
    if (q.kind === 'output') assert(q.codeHtml.includes('<pre>'), `Missing shared code: ${q.id}`);
    assert(q.review.lastReviewedAt === null || /^\d{4}-\d{2}-\d{2}$/.test(q.review.lastReviewedAt));
    const html = JSON.stringify(q);
    assert(
      !/<script|javascript:|onerror\s*=|file:\/\/|C:\\\\Users/i.test(html),
      `Unsafe or private content: ${q.id}`,
    );
  }
}
assert.equal(ids.size, 108);
assert(!track.topics.some((t) => t.id === 'topic-12'), 'Personal biography must not be imported');
console.log(
  `Content checks passed: ${ids.size} bilingual questions, 13 topics, shared output prompts, no local file links.`,
);

import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const track = JSON.parse(fs.readFileSync('public/content/angular-senior.json', 'utf8'));
let checked = 0;
for (const topic of track.topics) {
  for (const question of topic.questions) {
    if (question.review.status !== 'reviewed') continue;
    for (const exercise of question.exercise?.cases ?? []) {
      const result = spawnSync(process.execPath, ['--input-type=module', '--eval', exercise.code], {
        encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024,
      });
      assert(!result.error, `${question.id}: ${result.error}`);
      const lines = result.stdout.trimEnd().split(/\r?\n/).filter(Boolean);
      assert.deepEqual(lines, exercise.expected.stdout, `${question.id}: stdout differs`);
      if (exercise.expected.error) {
        assert.notEqual(result.status, 0, `${question.id}: expected an error`);
        assert(result.stderr.includes(exercise.expected.error), `${question.id}: wrong error`);
      } else {
        assert.equal(result.status, 0, `${question.id}: ${result.stderr}`);
      }
      checked++;
    }
  }
}
console.log(`Exercise checks passed: ${checked} reviewed code cases executed in Node ESM.`);

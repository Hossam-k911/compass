import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.COMPASS_URL ?? 'http://127.0.0.1:8787/';
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
await fs.mkdir('work/screenshots', { recursive: true });
const errors = [];
try {
  for (const width of [1440, 768, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base);
    await page.getByRole('heading', { name: /Your next chapter/ }).waitFor();
    await page.getByText('238 bilingual questions', { exact: true }).waitFor();
    assert.equal(await page.locator('.track-card').count(), 3);
    await page.screenshot({ path: `work/screenshots/home-${width}.png`, fullPage: true });
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Home overflow ${width}`,
    );
    if (width === 390) {
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await page.locator('#sidebar').getByRole('link', { name: 'Learning path' }).click();
      assert.equal(await page.locator('.mobile-open').count(), 0);
    } else {
      await page.goto(base + '#/roadmap');
    }
    await page.getByRole('heading', { name: 'Start solid. Build depth.' }).waitFor();
    assert.equal(await page.locator('.topic-row').count(), 13);
    await page.goto(base + '#/study/q-9');
    await page.locator('.question-card').waitFor();
    await page.getByRole('button', { name: 'English', exact: true }).click();
    assert.equal(await page.locator('.answer-panel').count(), 0);
    assert.equal(await page.locator('.shared-code pre').count(), 1);
    await page.getByRole('button', { name: /Reveal answer/ }).click();
    assert.equal(await page.locator('.answer-panel[lang=en]').count(), 1);
    assert.equal(await page.locator('.answer-panel[lang=ar]').count(), 0);
    await page.getByRole('button', { name: 'Both', exact: true }).click();
    await expect(page.locator('.answer-panel')).toHaveCount(2);
    await page.getByRole('button', { name: 'Save question', exact: true }).click();
    await page.getByRole('button', { name: 'Mark as understood', exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `work/screenshots/study-${width}.png`, fullPage: true });
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Study overflow ${width}`,
    );
    await page.reload();
    await page.getByRole('button', { name: 'Understood', exact: true }).waitFor();
    assert.equal(
      await page.getByRole('button', { name: 'Unsave question', exact: true }).count(),
      1,
    );
    await page.goto(base + '#/saved');
    await page.locator('.question-list a').first().waitFor();
    assert.equal(await page.locator('.question-list a').count(), 1);
    await page.goto(base + '#/study?topic=topic-13');
    await page.locator('.question-list a').first().waitFor();
    assert.equal(await page.locator('.question-list a').count(), 32);
    await page.getByRole('searchbox', { name: 'Search questions' }).fill('zzzznotfound');
    await page.getByRole('heading', { name: 'No matching questions.' }).waitFor();
    await page.goto(base + '#/practice');
    await page.getByRole('combobox', { name: 'Practice question type' }).selectOption('output');
    await page.locator('.shared-code pre').first().waitFor();
    assert.equal(await page.locator('.answers').count(), 0);
    await page.getByRole('button', { name: 'Reveal & compare' }).click();
    await page.getByRole('button', { name: 'Revisit later' }).click();
    await expect(page.locator('.answers')).toHaveCount(0);
    await page.goto(base + '#/progress');
    await page.getByRole('heading', { name: 'Your progress, your pace.' }).waitFor();
    const before = await page.evaluate(() => localStorage.getItem('compass.progress.v1'));
    await page
      .getByLabel('Import progress backup')
      .setInputFiles({
        name: 'bad.json',
        mimeType: 'application/json',
        buffer: Buffer.from('{"version":99}'),
      });
    await page.getByRole('status').filter({ hasText: 'not a valid' }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('compass.progress.v1')), before);
    await page
      .getByLabel('Import progress backup')
      .setInputFiles({
        name: 'good.json',
        mimeType: 'application/json',
        buffer: Buffer.from(
          JSON.stringify({
            version: 1,
            learned: ['q-1'],
            saved: ['q-2'],
            language: 'en',
            lastQuestion: 'q-1',
          }),
        ),
      });
    await page.getByRole('status').filter({ hasText: 'imported and merged' }).waitFor();
    const merged = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('compass.progress.v1')),
    );
    assert(merged.learned.includes('q-1') && merged.learned.includes('q-9'));
    assert(merged.saved.includes('q-2') && merged.saved.includes('q-9'));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export progress' }).click();
    assert.equal((await downloadPromise).suggestedFilename(), 'compass-progress.json');
    await page.goto(base + '#/updates');
    await page.getByRole('heading', { name: 'Content with a paper trail.' }).waitFor();
    await page.getByRole('heading', { name: 'Frontend foundations and senior depth.' }).waitFor();
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Updates overflow ${width}`,
    );
    await context.close();
    console.log(
      `PASS ${width}px: navigation, code prompts, languages, saved/progress persistence, search, practice, backup validation & merge, export.`,
    );
  }
  assert.deepEqual(errors, []);
  console.log('No browser runtime errors.');
} finally {
  await browser.close();
}

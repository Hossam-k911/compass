import fs from 'node:fs/promises';
const sources = [
  { id: 'angular', repo: 'angular/angular' },
  { id: 'ngrx', repo: 'ngrx/platform' },
  { id: 'rxjs', repo: 'ReactiveX/rxjs' },
  { id: 'typescript', repo: 'microsoft/TypeScript' },
];
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'Compass-content-checker',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const current = {};
for (const source of sources) {
  const response = await fetch(`https://api.github.com/repos/${source.repo}/releases/latest`, {
    headers,
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 404) {
    const tagResponse = await fetch(
      `https://api.github.com/repos/${source.repo}/tags?per_page=100`,
      { headers, signal: AbortSignal.timeout(20000) },
    );
    if (!tagResponse.ok) throw new Error(`${source.id}: tags returned ${tagResponse.status}`);
    const tags = await tagResponse.json();
    const stable = tags
      .filter((t) => /^v?\d+\.\d+\.\d+$/.test(t.name))
      .sort((a, b) =>
        b.name
          .replace(/^v/, '')
          .localeCompare(a.name.replace(/^v/, ''), undefined, { numeric: true }),
      )[0];
    if (!stable) throw new Error(`${source.id}: no stable version tag found`);
    current[source.id] = {
      tag: stable.name,
      url: `https://github.com/${source.repo}/tree/${encodeURIComponent(stable.name)}`,
      publishedAt: null,
    };
    continue;
  }
  if (!response.ok)
    throw new Error(`${source.id}: GitHub returned ${response.status}; baseline kept unchanged.`);
  const release = await response.json();
  if (
    typeof release.tag_name !== 'string' ||
    !release.html_url?.startsWith(`https://github.com/${source.repo}/releases/`)
  )
    throw new Error(`Unexpected release metadata for ${source.id}`);
  current[source.id] = {
    tag: release.tag_name,
    url: release.html_url,
    publishedAt: release.published_at,
  };
}
const baselinePath = 'content-ops/release-baseline.json';
let baseline = {};
try {
  baseline = JSON.parse(await fs.readFile(baselinePath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const changed = sources.filter((source) => baseline[source.id]?.tag !== current[source.id].tag);
const lines = [
  '# Compass release review report',
  '',
  `Checked at: ${new Date().toISOString()}`,
  '',
  'These are source changes, not verified interview questions. A human must assess relevance, test examples, and review both languages before publishing.',
  '',
];
for (const source of sources) {
  const item = current[source.id];
  lines.push(
    `- ${source.id}: ${item.tag}${changed.includes(source) ? ' — review candidate' : ' — unchanged'} (${item.url})`,
  );
}
if (!changed.length)
  lines.push('', 'No new stable release tags compared with the accepted baseline.');
lines.push(
  '',
  'This checker watches stable GitHub release tags only. It does not monitor every documentation edit, prerelease, job posting, or interview report.',
);
await fs.mkdir('work', { recursive: true });
await fs.writeFile('work/release-review.md', lines.join('\n') + '\n');
await fs.writeFile('work/release-snapshot.json', JSON.stringify(current, null, 2) + '\n');
if (process.argv.includes('--accept-baseline')) {
  await fs.mkdir('content-ops', { recursive: true });
  await fs.writeFile(baselinePath, JSON.stringify(current, null, 2) + '\n');
}
if (process.env.GITHUB_STEP_SUMMARY)
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
console.log(
  `${changed.length} source changes. Report: work/release-review.md. Content was not modified.`,
);

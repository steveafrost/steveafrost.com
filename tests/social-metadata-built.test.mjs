import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
function metadata(route) {
  const html = fs.readFileSync(`dist/${route}/index.html`.replace('dist//', 'dist/'), 'utf8');
  const head = html.split('</head>')[0];
  const values = new Map();
  for (const tag of head.matchAll(/<meta\s+[^>]*>/g)) {
    const key = tag[0].match(/(?:property|name)="([^"]+)"/)?.[1];
    const value = tag[0].match(/content="([^"]*)"/)?.[1];
    if (key) { assert.equal(values.has(key), false, `duplicate ${key}`); values.set(key, value); }
  }
  values.set('canonical', head.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);
  return values;
}
for (const route of ['', 'about', 'projects', 'articles']) {
  test(`${route || 'home'} sends the landscape to crawlers without scripts`, () => {
    const meta = metadata(route);
    assert.equal(meta.get('og:image'), 'https://steveafrost.com/river-assets/river-full-bleed.png');
    assert.equal(meta.get('twitter:image'), meta.get('og:image'));
    assert.equal(meta.get('og:image:type'), 'image/png');
    assert.equal(meta.get('og:image:width'), '2172'); assert.equal(meta.get('og:image:height'), '724');
    assert.equal(meta.get('og:type'), 'website'); assert.equal(meta.get('twitter:card'), 'summary_large_image');
    assert.ok(meta.get('og:image:alt')); assert.equal(meta.get('og:url'), meta.get('canonical'));
  });
}
test('article with configured artwork uses its own image and article metadata', () => {
  const meta = metadata('articles/building-a-nightly-newspaper-for-my-kindle');
  assert.equal(meta.get('og:image'), 'https://steveafrost.com/river-assets/kindle.png');
  assert.equal(meta.get('twitter:image'), meta.get('og:image')); assert.equal(meta.get('og:type'), 'article');
  assert.equal(meta.get('og:image:width'), '1536'); assert.equal(meta.get('og:image:height'), '1024');
  assert.equal(meta.get('og:url'), meta.get('canonical')); assert.ok(meta.get('twitter:image:alt'));
});
test('article without artwork uses the landscape without inheriting another article image', () => {
  const meta = metadata('articles/turning-repeated-agent-workflows-into-skills-worth-keeping');
  assert.equal(meta.get('og:image'), 'https://steveafrost.com/river-assets/river-full-bleed.png');
  assert.equal(meta.get('og:type'), 'article'); assert.equal(meta.get('og:url'), meta.get('canonical'));
});

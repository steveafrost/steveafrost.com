import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const slugs = ['kindle-newspaper','tiny-gifs','parcelrouter','pi-skill-recommender','message-relay','the-ride-bus-schedule','tip-track','plex-watchdog','parcel-tracker','leon-bridges','caamp','sesame-street-live','drew-aichele','cocomelon','phillips-nyc'];
const work = fs.readFileSync('dist/projects/index.html', 'utf8');
const header = html => html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
for (const slug of slugs) {
  test(`${slug} retains hero artwork, title, story link and single related row beneath shared overlay header`, () => {
    const html = fs.readFileSync(`dist/projects/${slug}/index.html`, 'utf8');
    assert.equal(header(html), header(work));
    const hero = html.match(/<section class="project-hero"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(hero);
    assert.ok(hero.includes('class="project-art"'));
    assert.ok(hero.includes('id="project-title"'));
    assert.ok(hero.includes('class="project-story"'));
    const nav = hero.match(/<nav class="project-selection"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.equal([...nav.matchAll(/<a\b/g)].length, 3);
    assert.ok(html.includes('mobile-menu.js?v=unfold-2'));
    assert.ok(html.includes('production.css?v=featurette-viewport-1'));
  });
}
test('global legacy featurette sizing no longer overrides viewport layout', () => {
  const css = fs.readFileSync('public/river-assets/production.css', 'utf8');
  assert.ok(!css.includes('.river-inner:has(.editorial-header) .project-hero'));
  assert.ok(!css.includes('.river-inner:has(.editorial-header) .project-hero-copy'));
});

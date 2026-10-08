import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { personalProjects, newestPersonalProjects, personalProjectHref, personalProjectSelection } from '../src/data/personal-projects.mjs';

test('newest three sort by recorded portfolio date without mutating inventory', () => {
  const projects = [
    { slug: 'old', featuredDate: '2020-01-01' },
    { slug: 'middle', featuredDate: '2026-06-01' },
    { slug: 'newest', featuredDate: '2026-09-01' },
    { slug: 'recent', featuredDate: '2026-08-01' },
  ];
  assert.deepEqual(newestPersonalProjects(projects).map(p => p.slug), ['newest', 'recent', 'middle']);
  assert.deepEqual(projects.map(p => p.slug), ['old', 'middle', 'newest', 'recent']);
});
test('equal dates use stable slug order independent of input order', () => {
  const projects = ['zebra', 'beta', 'alpha', 'omega'].map(slug => ({ slug, featuredDate: '2026-01-01' }));
  assert.deepEqual(newestPersonalProjects(projects).map(p => p.slug), ['alpha', 'beta', 'omega']);
  assert.deepEqual(newestPersonalProjects(projects.reverse()).map(p => p.slug), ['alpha', 'beta', 'omega']);
});
test('older featurette is retained but falls out of current navigation', () => {
  const old = { ...personalProjects[0], slug: 'older-featurette', featuredDate: '2020-01-01' };
  const inventory = [...personalProjects, old];
  assert.equal(personalProjectHref(old), '/projects/older-featurette');
  assert.equal(inventory.find(p => p.slug === old.slug), old);
  const links = personalProjectSelection(old.slug, inventory);
  assert.equal(links.length, 3); assert.ok(links.every(link => !link.current));
  assert.ok(links.every(link => link.href.startsWith('/projects/') && !link.href.startsWith('/articles/')));
});

function selection(html) {
  const section = html.match(/<nav class="project-selection"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(section, 'featurette navigation exists');
  return [...section.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>/g)].map(m => m[1]);
}
for (const project of personalProjects) {
  test(`${project.slug} builds with its own hero, canonical, metadata, and three featurette links`, () => {
    const html = fs.readFileSync(`dist/projects/${project.slug}/index.html`, 'utf8');
    const wanted = newestPersonalProjects().map(personalProjectHref);
    assert.deepEqual(selection(html), wanted);
    assert.ok(html.includes(`href="https://steveafrost.com/projects/${project.slug}/"`));
    assert.ok(html.includes(`property="og:image" content="https://steveafrost.com${project.hero}"`));
    assert.ok(html.includes(`name="twitter:image" content="https://steveafrost.com${project.hero}"`));
    if (project.sourceExcerpt) { assert.ok(html.includes(project.sourceLabel)); assert.ok(html.includes("/skill-recommender-candidates")); }
    else assert.ok(html.includes(`src="${project.hero}"`));
    assert.ok(fs.existsSync(`public${project.hero}`));
    assert.ok(html.includes('aria-current="page"')); assert.ok(html.includes(project.story));
  });
}
test('homepage postcards link to the same newest three featurettes', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const section = html.match(/<section class="postcards wrap"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section);
  const links = [...section.matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(links, newestPersonalProjects().map(personalProjectHref));
});
test('professional catalog and existing article routes stay available', () => {
  for (const slug of ['leon-bridges', 'caamp', 'sesame-street-live', 'drew-aichele', 'cocomelon', 'tip-track', 'phillips-nyc', 'message-relay', 'the-ride-bus-schedule', 'parcel-tracker', 'plex-watchdog']) {
    const html = fs.readFileSync(`dist/projects/${slug}/index.html`, 'utf8');
    assert.ok(html.includes(`/projects/mock/${slug}`));
  }
  for (const project of personalProjects) assert.ok(fs.existsSync(`dist${project.story}/index.html`));
});

test('personal featurettes reuse the Work glass header, menu and active context', () => {
  const work = fs.readFileSync('dist/projects/index.html', 'utf8');
  const header = html => html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.ok(header(work).includes('glass-navigation'));
  for (const project of personalProjects) {
    const html = fs.readFileSync(`dist/projects/${project.slug}/index.html`, 'utf8');
    assert.equal(header(html), header(work));
    assert.ok(html.includes('river-glass-inner'));
    assert.ok(html.includes('/river-assets/sticky-glass.js?v=mobile-stable-1'));
    assert.ok(html.includes('/river-assets/mobile-menu.js?v=unfold-2'));
  }
});

test('batch two reuses existing routes and updates latest-three without deleting old featurettes', () => {
  assert.deepEqual(newestPersonalProjects().map(p => p.slug), ['kindle-newspaper', 'tiny-gifs', 'pi-skill-recommender']);
  for (const slug of ['message-relay', 'the-ride-bus-schedule', 'tip-track']) {
    const project = personalProjects.find(p => p.slug === slug);
    const html = fs.readFileSync(`dist/projects/${slug}/index.html`, 'utf8');
    assert.ok(html.includes(project.story));
    assert.ok(html.includes(project.demo));
    assert.ok(html.includes(project.artworkCaption));
  }
  const older = fs.readFileSync('dist/projects/parcelrouter/index.html', 'utf8');
  assert.deepEqual(selection(older), newestPersonalProjects().map(personalProjectHref));
  assert.ok(!selection(older).includes('/projects/parcelrouter'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { featuredPersonalProjects, personalProjects } from '../src/data/personal-projects.mjs';

test('editable selection supplies exactly three known IDs in file order', () => {
  const ids = JSON.parse(fs.readFileSync('src/data/featured-projects.json', 'utf8'));
  assert.equal(ids.length, 3);
  assert.deepEqual(featuredPersonalProjects().map(p => p.slug), ids);
});
test('author ordering overrides story dates without mutating records', () => {
  const ids = ['tip-track', 'parcelrouter', 'kindle-newspaper'];
  const before = structuredClone(personalProjects);
  assert.deepEqual(featuredPersonalProjects(ids).map(p => p.slug), ids);
  assert.deepEqual(personalProjects, before);
  assert.deepEqual(ids, ['tip-track', 'parcelrouter', 'kindle-newspaper']);
});
test('selection rejects any count other than three and non-array values', () => {
  for (const ids of [[], ['kindle-newspaper'], ['kindle-newspaper', 'tiny-gifs'], ['kindle-newspaper', 'tiny-gifs', 'parcelrouter', 'tip-track'], null, {}]) {
    assert.throws(() => featuredPersonalProjects(ids), /featured-projects.json: choose exactly three/);
  }
});
test('selection rejects duplicates', () => {
  assert.throws(() => featuredPersonalProjects(['kindle-newspaper', 'tiny-gifs', 'tiny-gifs']), /must be unique/);
});
test('selection rejects unknown IDs with valid choices in error', () => {
  assert.throws(() => featuredPersonalProjects(['kindle-newspaper', 'tiny-gifs', 'missing']), /unknown project ID "missing".*parcelrouter/);
});
test('selection rejects empty and non-string IDs', () => {
  for (const bad of ['', ' ', 3, null]) assert.throws(() => featuredPersonalProjects(['kindle-newspaper', 'tiny-gifs', bad]), /nonempty string/);
});
test('unfeatured personal project routes remain built', () => {
  const selected = new Set(featuredPersonalProjects().map(p => p.slug));
  for (const project of personalProjects.filter(p => !selected.has(p.slug))) {
    assert.ok(fs.existsSync(`dist/projects/${project.slug}/index.html`));
  }
});

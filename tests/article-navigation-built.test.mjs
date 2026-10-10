import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const writing = fs.readFileSync('dist/articles/index.html', 'utf8');
const navigation = html => html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
function articleFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? articleFiles(file) : entry.name === 'index.html' && directory !== 'dist/articles' ? [file] : [];
  });
}
const files = articleFiles('dist/articles');
test('every article shares the Writing header, active navigation and lifecycle assets', () => {
  assert.ok(files.length > 0);
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    assert.equal(navigation(html), navigation(writing), file);
    assert.match(html, /river-glass-inner/, file);
    assert.match(html, /astro-view-transitions-enabled/, file);
    assert.match(html, /navigation-lifecycle\.js\?v=router-1/, file);
    assert.match(html, /sticky-glass\.js\?v=mobile-stable-1-router-1/, file);
  }
});
test('article reading structure and usable navigation remain present without JavaScript', () => {
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<article class="py-8">/, file);
    assert.match(html, /<time[^>]+datetime=/, file);
    assert.match(html, /class="prose /, file);
    assert.match(html, /href="#main">Skip to content/, file);
    const panel = html.match(/<div id="header-menu"[^>]*>/)?.[0];
    assert.ok(panel && !/hidden|inert|aria-hidden/.test(panel), file);
  }
});

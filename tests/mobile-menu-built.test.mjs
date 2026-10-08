import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

for (const route of ['', 'about', 'projects', 'articles']) {
  test(`${route || 'home'} preserves no-JS navigation and serves the motion asset versions`, () => {
    const html = fs.readFileSync(`dist/${route}/index.html`.replace('dist//', 'dist/'), 'utf8');
    const button = html.match(/<button class="mobile-menu-toggle"[^>]*>/)?.[0];
    assert.ok(button?.includes('hidden'));
    assert.ok(button.includes('aria-expanded="false"'));
    assert.ok(button.includes('aria-controls="header-menu"'));
    const panel = html.match(/<div id="header-menu"[^>]*>/)?.[0];
    assert.ok(panel); assert.ok(!/hidden|inert|aria-hidden/.test(panel));
    assert.ok(html.includes('mobile-menu.js?v=unfold-2'));
    assert.ok(html.includes('production.css?v=featurette-viewport-1'));
    assert.ok(html.includes('<nav aria-label="Primary">'));
    assert.ok(!html.includes('role="menu"'));
  });
}

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('public/river-assets/sticky-glass.js', 'utf8');
function fixture(mobile) {
  const media = new Map(); let measurements = 0;
  const header = { classList: { remove() {}, add() {} } };
  const node = () => ({ style: {}, setAttribute() {}, append() {} });
  const context = {
    document: { querySelector: () => header, createElementNS: node, body: { append() {} } },
    navigator: { userAgent: 'Chrome/130' }, CSS: { supports: () => true },
    matchMedia(query) { const m = { matches: query === '(max-width: 760px)' && mobile, addEventListener(_, listener) { this.change = listener; } }; media.set(query, m); return m; },
    getComputedStyle() { measurements++; return { width: '0', height: '0' }; },
    ResizeObserver: class { constructor(fn) { this.fn = fn; } observe() { this.fn(); } },
    addEventListener() {},
  };
  vm.runInNewContext(source, context);
  return { media, measurements: () => measurements };
}
test('mobile never generates the SVG lens, including after preference changes', () => {
  const f = fixture(true); assert.equal(f.measurements(), 0);
  f.media.get('(prefers-reduced-motion: reduce)').change(); assert.equal(f.measurements(), 0);
});
test('desktop lens eligibility returns when mobile breakpoint clears', () => {
  const f = fixture(true); const m = f.media.get('(max-width: 760px)'); m.matches = false; m.change();
  assert.equal(f.measurements(), 1);
  m.matches = true; m.change(); assert.equal(f.measurements(), 1);
});
test('desktop continues to reach the lens measurement path', () => {
  assert.equal(fixture(false).measurements(), 1);
});

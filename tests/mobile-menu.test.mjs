import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/river-assets/mobile-menu.js', import.meta.url), 'utf8');
function fixture(isMobile = true) {
  const events = new Map();
  function element(parent = null) {
    const handlers = new Map(), attributes = new Map(), classes = new Set();
    return {
      parent, hidden: false, attributes, classes,
      classList: { add: name => classes.add(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
      setAttribute: (name, value) => attributes.set(name, value),
      addEventListener: (name, handler) => handlers.set(name, handler),
      dispatch: (name, event = {}) => handlers.get(name)?.(event),
      contains(node) { return node === this || Boolean(node?.parent && this.contains(node.parent)); },
      focus() { document.activeElement = this; },
    };
  }
  const header = element(), toggle = element(header), panel = element(header), link = element(panel), theme = element(panel), outside = element();
  link.closest = query => query === 'a' ? link : null;
  theme.closest = () => null;
  header.querySelector = query => query === '.mobile-menu-toggle' ? toggle : panel;
  const document = { activeElement: outside, querySelector: () => header, addEventListener: (name, handler) => events.set(name, handler) };
  const media = { matches: isMobile, addEventListener: (_, handler) => { media.change = handler; } };
  const windowEvents = new Map();
  vm.runInNewContext(source, { document, matchMedia: () => media, addEventListener: (name, handler) => windowEvents.set(name, handler) });
  return { header, toggle, panel, link, theme, outside, document, media, events, windowEvents };
}

test('mobile starts closed and disclosure synchronizes native hidden and ARIA state', () => {
  const f = fixture();
  assert.equal(f.toggle.hidden, false); assert.equal(f.panel.hidden, true);
  assert.equal(f.toggle.attributes.get('aria-expanded'), 'false');
  f.toggle.dispatch('click');
  assert.equal(f.panel.hidden, false); assert.equal(f.toggle.attributes.get('aria-expanded'), 'true');
  assert.equal(f.toggle.attributes.get('aria-label'), 'Close navigation');
  assert.equal(f.header.classes.has('menu-is-open'), true);
  f.toggle.dispatch('click'); assert.equal(f.panel.hidden, true);
});
test('Escape closes and restores focus; outside click releases hidden-panel focus', () => {
  const f = fixture(); f.toggle.dispatch('click'); f.document.activeElement = f.link;
  let prevented = false;
  f.events.get('keydown')({ key: 'Escape', preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true); assert.equal(f.panel.hidden, true); assert.equal(f.document.activeElement, f.toggle);
  f.toggle.dispatch('click'); f.document.activeElement = f.theme;
  f.events.get('click')({ target: f.outside });
  assert.equal(f.panel.hidden, true); assert.equal(f.document.activeElement, f.toggle);
});
test('theme control keeps menu open; social and navigation links close it', () => {
  const f = fixture(); f.toggle.dispatch('click');
  f.panel.dispatch('click', { target: f.theme }); assert.equal(f.panel.hidden, false);
  f.panel.dispatch('click', { target: f.link }); assert.equal(f.panel.hidden, true);
});
test('desktop always exposes navigation; returning to mobile closes and removes hidden focus', () => {
  const f = fixture(false); assert.equal(f.toggle.hidden, true); assert.equal(f.panel.hidden, false);
  f.document.activeElement = f.link; f.media.matches = true; f.media.change();
  assert.equal(f.panel.hidden, true); assert.equal(f.document.activeElement, f.toggle);
  f.toggle.dispatch('click'); f.media.matches = false; f.media.change();
  assert.equal(f.panel.hidden, false); assert.equal(f.toggle.hidden, true);
  assert.equal(f.toggle.attributes.get('aria-expanded'), 'false');
});
test('page history restore resets mobile disclosure', () => {
  const f = fixture(); f.toggle.dispatch('click'); f.windowEvents.get('pagehide')();
  assert.equal(f.panel.hidden, true);
  f.toggle.dispatch('click'); f.windowEvents.get('pageshow')(); assert.equal(f.panel.hidden, true);
});

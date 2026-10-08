import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/river-assets/mobile-menu.js', import.meta.url), 'utf8');
function fixture(isMobile = true, { animate = false, reduced = false, failAt = 0 } = {}) {
  const events = new Map();
  const effects = [];
  function element(parent = null) {
    const handlers = new Map(), attributes = new Map(), classes = new Set();
    return {
      parent, hidden: false, inert: false, attributes, classes,
      computed: { clipPath: 'none', borderRadius: '28px', transform: 'none', opacity: '1' },
      classList: { add: name => classes.add(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
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
  Object.defineProperty(header, 'offsetHeight', { get: () => panel.hidden ? 66 : 266 });
  if (animate) {
    for (const target of [header, panel]) target.animate = (keyframes, timing) => {
      if (effects.length + 1 === failAt) throw new Error('unsupported animation');
      let finish, reject;
      const effect = {
        target, keyframes, timing, cancelled: false,
        finished: new Promise((resolve, fail) => { finish = resolve; reject = fail; }),
        finish: () => finish(),
        cancel() { this.cancelled = true; reject(new Error('cancelled')); },
      };
      effects.push(effect);
      return effect;
    };
  }
  const document = { activeElement: outside, querySelector: () => header, addEventListener: (name, handler) => events.set(name, handler) };
  const media = { matches: isMobile, addEventListener: (_, handler) => { media.change = handler; } };
  const motion = { matches: reduced, addEventListener: (_, handler) => { motion.change = handler; } };
  const windowEvents = new Map();
  const context = { document, innerWidth: isMobile ? 390 : 1024,
    getComputedStyle: node => ({ height: `${node.offsetHeight || 0}px`, ...node.computed }),
    matchMedia: query => query.includes('reduced-motion') ? motion : media,
    addEventListener: (name, handler) => windowEvents.set(name, handler) };
  vm.runInNewContext(source, context);
  return { header, toggle, panel, link, theme, outside, document, media, motion, events, windowEvents, effects, context };
}

async function finishMotion(f) {
  f.effects.filter(effect => !effect.cancelled).forEach(effect => effect.finish());
  await new Promise(resolve => setImmediate(resolve));
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

test('opening unfolds rounded glass and slides content, then releases every animation', async () => {
  const f = fixture(true, { animate: true });
  f.toggle.dispatch('click');
  assert.equal(f.panel.hidden, false); assert.equal(f.panel.inert, false);
  assert.equal(f.panel.attributes.has('aria-hidden'), false);
  assert.equal(f.effects.length, 2);
  const [surface, content] = f.effects;
  assert.equal(surface.keyframes[0].height, '66px');
  assert.ok(surface.keyframes.every(frame => !('clipPath' in frame) && !('opacity' in frame) && !('transform' in frame)));
  assert.equal(surface.keyframes[1].height, '266px');
  assert.equal(content.keyframes[0].transform, 'translateY(-8px)');
  assert.equal(content.keyframes[0].opacity, '0');
  assert.equal(surface.timing.duration, 280); assert.equal(content.timing.duration, 280);
  assert.equal(surface.timing.easing, 'cubic-bezier(.22,1,.36,1)');
  await finishMotion(f);
  assert.equal(f.panel.hidden, false); assert.ok(f.effects.every(effect => effect.cancelled));
});

test('closing is inert and aria-hidden immediately; native hidden follows the 180ms exit', async () => {
  const f = fixture(true, { animate: true }); f.toggle.dispatch('click'); await finishMotion(f);
  f.document.activeElement = f.link;
  f.toggle.dispatch('click');
  assert.equal(f.panel.hidden, false); assert.equal(f.panel.inert, true);
  assert.equal(f.panel.attributes.get('aria-hidden'), 'true');
  assert.equal(f.toggle.attributes.get('aria-expanded'), 'false');
  assert.equal(f.document.activeElement, f.toggle);
  assert.equal(f.effects.at(-1).timing.duration, 180);
  await finishMotion(f);
  assert.equal(f.panel.hidden, true); assert.ok(f.effects.every(effect => effect.cancelled));
});

test('rapid open/close/open resumes the painted frame and stale completion cannot hide reopened links', async () => {
  const f = fixture(true, { animate: true }); f.toggle.dispatch('click');
  f.header.computed.height = '156px';
  f.panel.computed.transform = 'matrix(1, 0, 0, 1, 0, -4)'; f.panel.computed.opacity = '0.5';
  f.toggle.dispatch('click');
  assert.equal(f.effects[2].keyframes[0].height, f.header.computed.height);
  assert.equal(f.effects[3].keyframes[0].transform, f.panel.computed.transform);
  assert.equal(f.effects[3].keyframes[0].opacity, '0.5');
  const stale = f.effects.slice();
  f.toggle.dispatch('click');
  assert.equal(f.panel.inert, false); assert.equal(f.panel.attributes.has('aria-hidden'), false);
  stale.forEach(effect => effect.finish());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.panel.hidden, false); assert.equal(f.toggle.attributes.get('aria-expanded'), 'true');
  assert.ok(stale.every(effect => effect.cancelled));
  await finishMotion(f); assert.equal(f.panel.hidden, false);
});

test('twenty alternating clicks leave only the last exit alive and settle closed', async () => {
  const f = fixture(true, { animate: true });
  for (let i = 0; i < 20; i++) f.toggle.dispatch('click');
  assert.equal(f.effects.filter(effect => !effect.cancelled).length, 2);
  assert.equal(f.toggle.attributes.get('aria-expanded'), 'false');
  await finishMotion(f); assert.equal(f.panel.hidden, true);
});

test('Escape, outside click, and navigation retain closing semantics during animation', async () => {
  for (const reason of ['escape', 'outside', 'navigation']) {
    const f = fixture(true, { animate: true }); f.toggle.dispatch('click'); f.document.activeElement = f.link;
    if (reason === 'escape') f.events.get('keydown')({ key: 'Escape', preventDefault() {} });
    if (reason === 'outside') f.events.get('click')({ target: f.outside });
    if (reason === 'navigation') f.panel.dispatch('click', { target: f.link });
    assert.equal(f.panel.inert, true); assert.equal(f.document.activeElement, f.toggle);
    await finishMotion(f); assert.equal(f.panel.hidden, true);
  }
});

test('an outside target that owns focus keeps that focus', async () => {
  const f = fixture(true, { animate: true }); f.toggle.dispatch('click'); f.document.activeElement = f.outside;
  f.events.get('click')({ target: f.outside });
  assert.equal(f.document.activeElement, f.outside);
  await finishMotion(f); assert.equal(f.panel.hidden, true);
});

test('desktop resize and page lifecycle cancel pending effects immediately', async () => {
  for (const reason of ['desktop', 'width', 'pageshow', 'pagehide']) {
    const f = fixture(true, { animate: true }); f.toggle.dispatch('click'); f.document.activeElement = f.link;
    if (reason === 'desktop') { f.media.matches = false; f.media.change(); }
    if (reason === 'width') { f.context.innerWidth = 430; f.windowEvents.get('resize')(); }
    if (reason === 'pageshow' || reason === 'pagehide') f.windowEvents.get(reason)();
    assert.ok(f.effects.every(effect => effect.cancelled));
    assert.equal(f.panel.hidden, reason !== 'desktop');
    assert.equal(f.panel.inert, reason !== 'desktop');
    await finishMotion(f); assert.equal(f.panel.hidden, reason !== 'desktop');
  }
});

test('mobile browser-chrome height changes do not dismiss an open menu', () => {
  const f = fixture(true, { animate: true }); f.toggle.dispatch('click');
  f.windowEvents.get('resize')();
  assert.equal(f.toggle.attributes.get('aria-expanded'), 'true');
  assert.equal(f.effects.filter(effect => !effect.cancelled).length, 2);
});

test('reduced motion switches immediately and a changed preference cancels ongoing motion', async () => {
  const f = fixture(true, { animate: true, reduced: true });
  f.toggle.dispatch('click'); assert.equal(f.panel.hidden, false);
  f.toggle.dispatch('click'); assert.equal(f.panel.hidden, true); assert.equal(f.effects.length, 0);
  f.motion.matches = false; f.toggle.dispatch('click');
  f.motion.matches = true; f.motion.change();
  assert.equal(f.panel.hidden, true); assert.ok(f.effects.every(effect => effect.cancelled));
  await finishMotion(f); assert.equal(f.panel.hidden, true);
});

test('unsupported or partially failing animation API preserves immediate working navigation', async () => {
  for (const failAt of [1, 2]) {
    const f = fixture(true, { animate: true, failAt });
    f.toggle.dispatch('click'); assert.equal(f.panel.hidden, false); assert.equal(f.panel.inert, false);
    f.toggle.dispatch('click'); assert.equal(f.panel.hidden, true); assert.equal(f.panel.inert, true);
    assert.ok(f.effects.every(effect => effect.cancelled));
    await finishMotion(f);
  }
});

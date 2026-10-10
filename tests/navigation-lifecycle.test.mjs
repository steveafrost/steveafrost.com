import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = name => fs.readFileSync(`public/river-assets/${name}`, 'utf8');
function target() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type, event = {}) { for (const fn of [...(listeners.get(type) || [])]) fn(event); },
    count(type) { return listeners.get(type)?.size || 0; },
  };
}
function documentFixture() {
  const picture = { dataset: { day: '/day.png', night: '/night.png' }, setAttribute(key, value) { this[key] = value; } };
  return Object.assign(target(), { documentElement: { dataset: { theme: 'day' } }, querySelector: () => picture, querySelectorAll: () => [], picture });
}
function fixture() {
  const document = documentFixture();
  const errors = [];
  const context = vm.createContext({ ...target(), document, localStorage: { getItem: () => 'night' }, console: { error: (...args) => errors.push(args) } });
  vm.runInContext(read('navigation-lifecycle.js'), context);
  return { context, document, errors };
}
test('initializers run once per page, dispose in reverse order, and recover on Back/Forward', () => {
  const f = fixture(), calls = [];
  for (const name of ['river', 'pixi']) f.context.riverLifecycle.register(name, () => { calls.push(`start:${name}`); return () => calls.push(`stop:${name}`); });
  f.context.riverLifecycle.register('river', () => assert.fail('duplicate registration'));
  f.document.dispatch('astro:page-load');
  assert.deepEqual(calls, ['start:river', 'start:pixi']);
  for (let visit = 0; visit < 4; visit++) {
    f.document.dispatch('astro:before-swap', { newDocument: documentFixture() });
    assert.deepEqual(calls.slice(-2), ['stop:pixi', 'stop:river']);
    f.document.dispatch('astro:page-load');
    assert.deepEqual(calls.slice(-2), ['start:river', 'start:pixi']);
  }
  assert.equal(f.document.count('astro:page-load'), 1);
  assert.equal(f.errors.length, 0);
});
test('theme and homepage artwork are applied to incoming DOM before paint', () => {
  const f = fixture(), incoming = documentFixture();
  f.document.dispatch('astro:before-swap', { newDocument: incoming });
  assert.equal(incoming.documentElement.dataset.theme, 'night');
  assert.equal(incoming.picture.src, '/night.png');
  f.document.dispatch('astro:after-swap');
  assert.equal(f.document.documentElement.dataset.theme, 'night');
  assert.equal(f.document.picture.src, '/night.png');
});
test('bfcache retains resources; real unload disposes them once', () => {
  const f = fixture(); let stops = 0;
  f.context.riverLifecycle.register('resource', () => () => stops++);
  f.context.dispatch('pagehide', { persisted: true }); assert.equal(stops, 0);
  f.context.dispatch('pagehide', { persisted: false }); assert.equal(stops, 1);
  f.context.dispatch('pagehide', { persisted: false }); assert.equal(stops, 1);
});
test('one failed resource does not prevent other cleanup or next-page setup', () => {
  const f = fixture(); let runs = 0;
  f.context.riverLifecycle.register('healthy', () => { runs++; return () => {}; });
  f.context.riverLifecycle.register('broken', () => () => { throw Error('cleanup'); });
  f.document.dispatch('astro:before-swap', { newDocument: documentFixture() });
  f.document.dispatch('astro:page-load');
  assert.equal(runs, 2); assert.equal(f.errors.length, 1);
});
test('actual menu listeners are removed and new controls work after repeated page swaps', () => {
  const f = fixture();
  function element(parent) {
    const el = Object.assign(target(), { parent, hidden: false, inert: false, attrs: {}, classList: { add() {}, toggle() {} }, setAttribute(key, value) { this.attrs[key] = value; }, removeAttribute(key) { delete this.attrs[key]; }, focus() { f.document.activeElement = this; }, contains(node) { return node === this || (node?.parent && this.contains(node.parent)); } });
    return el;
  }
  function headerFixture() {
    const header = element(), toggle = element(header), panel = element(header);
    header.querySelector = query => query === '.mobile-menu-toggle' ? toggle : panel;
    return { header, toggle, panel };
  }
  let nodes = headerFixture();
  f.document.querySelector = query => query === '.editorial-header' ? nodes.header : null;
  f.context.innerWidth = 390;
  const media = new Map();
  f.context.matchMedia = query => { if (!media.has(query)) media.set(query, Object.assign(target(), { matches: query.includes('max-width') })); return media.get(query); };
  vm.runInContext(read('mobile-menu.js'), f.context);
  for (let visit = 0; visit < 4; visit++) {
    nodes.toggle.dispatch('click'); assert.equal(nodes.toggle.attrs['aria-expanded'], 'true');
    f.document.dispatch('keydown', { key: 'Escape', preventDefault() {} }); assert.equal(nodes.panel.hidden, true);
    const old = nodes;
    f.document.dispatch('astro:before-swap', { newDocument: documentFixture() });
    assert.equal(old.toggle.count('click'), 0); assert.equal(f.document.count('keydown'), 0);
    nodes = headerFixture(); f.document.dispatch('astro:page-load');
    assert.equal(nodes.toggle.count('click'), 1); assert.equal(f.document.count('keydown'), 1);
    assert.equal(media.get('(max-width: 760px)').count('change'), 1);
  }
});
test('built shared routes include router; standalone demos retain a document boundary', () => {
  for (const route of ['index.html', 'about/index.html', 'projects/index.html', 'articles/index.html', 'projects/kindle-newspaper/index.html']) {
    const html = fs.readFileSync(`dist/${route}`, 'utf8');
    assert.match(html, /name="astro-view-transitions-enabled"/);
    assert.match(html, /navigation-lifecycle\.js\?v=router-email-2/);
  }
  const mock = fs.readFileSync('dist/projects/mock/tip-track/index.html', 'utf8');
  assert.doesNotMatch(mock, /name="astro-view-transitions-enabled"/);
  const feature = fs.readFileSync('dist/projects/tip-track/index.html', 'utf8');
  assert.match(feature, /href="\/projects\/mock\/tip-track" data-astro-reload/);
});
test('actual river releases WebGL resources and observers; pause survives re-entry', () => {
  const f = fixture(); let disconnected = 0, lost = 0, raf = 0;
  const deleted = { Texture: 0, Program: 0, Buffer: 0, Shader: 0 };
  const gl = new Proxy({}, { get(_, key) {
    if (key === 'getExtension') return () => ({ loseContext() { lost++; } });
    if (String(key).startsWith('delete')) return () => { deleted[String(key).slice(6)]++; };
    if (key === 'getShaderParameter' || key === 'getProgramParameter') return () => true;
    if (String(key).startsWith('create')) return () => ({});
    return () => {};
  } });
  const media = Object.assign(target(), { matches: false });
  f.context.matchMedia = () => media; f.context.window = f.context;
  f.context.location = { search: '' }; f.context.URLSearchParams = URLSearchParams;
  f.context.Image = class { constructor() { return Object.assign(target(), { complete: true, naturalWidth: 1 }); } };
  f.context.requestAnimationFrame = () => ++raf; f.context.cancelAnimationFrame = () => { raf = 0; };
  f.context.devicePixelRatio = 1; f.context.getComputedStyle = () => ({ objectPosition: '50% 50%' });
  f.context.IntersectionObserver = class { observe() {} disconnect() { disconnected++; } };
  const canvas = Object.assign(target(), { clientWidth: 2172, clientHeight: 724, getContext: () => gl, classList: { add() {}, remove() {} } });
  const photo = Object.assign(target(), { complete: true, naturalWidth: 2172, naturalHeight: 724 });
  const toggle = Object.assign(target(), { dataset: {}, setAttribute() {} });
  const scene = { clientWidth: 2172, clientHeight: 724, querySelector(query) {
    return query === 'canvas' ? canvas : query === '.river-picture' ? photo : query === '.theme-sun' ? { style: {} } : query === '[data-motion-status]' ? {} : { setAttribute() {} };
  }, querySelectorAll: () => [] };
  f.document.querySelector = query => query === '.landscape' ? scene : query === '.motion-toggle' ? toggle : null;
  vm.runInContext(read('river.js'), f.context);
  assert.equal(f.context.riverMotion.ready, true);
  toggle.dispatch('click'); assert.equal(f.context.riverMotionPaused, true);
  f.document.dispatch('astro:before-swap', { newDocument: documentFixture() });
  assert.equal(raf, 0); assert.equal(disconnected, 1); assert.equal(lost, 1);
  assert.deepEqual(deleted, { Texture: 2, Program: 1, Buffer: 1, Shader: 2 });
  assert.equal(toggle.count('click'), 0); assert.equal(media.count('change'), 0);
  assert.equal(f.context.riverMotion, undefined);
  f.document.dispatch('astro:page-load');
  assert.equal(f.context.riverMotion.ready, true); assert.equal(f.context.riverMotion.running, false);
  assert.equal(toggle.dataset.paused, 'true'); assert.equal(toggle.count('click'), 1);
  assert.equal(f.errors.length, 0);
});

test('each incoming Cloudflare email decoder reruns; other scripts remain untouched', () => {
  const f = fixture();
  for (let visit = 0; visit < 5; visit++) {
    const incoming = documentFixture();
    const sources = ['/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js', '/river-assets/theme.js', 'https://example.com/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js', '/cdn-cgi/scripts/abc123/cloudflare-static/email-decode.min.js?v=1'];
    const scripts = sources.map(src => ({ attributes: { src }, getAttribute(key) { return this.attributes[key]; }, setAttribute(key, value) { this.attributes[key] = value; } }));
    incoming.querySelectorAll = () => scripts;
    f.document.dispatch('astro:before-swap', { newDocument: incoming });
    assert.equal(scripts[0].attributes['data-astro-rerun'], '');
    assert.equal(scripts[3].attributes['data-astro-rerun'], '');
    assert.equal(scripts[1].attributes['data-astro-rerun'], undefined);
    assert.equal(scripts[2].attributes['data-astro-rerun'], undefined);
  }
  assert.equal(f.errors.length, 0);
});

test('the deployed Cloudflare decoder restores menu links and body email text on every swap', () => {
  const f = fixture();
  const decoder = fs.readFileSync('tests/fixtures/cloudflare-email-decode.snapshot.js', 'utf8');
  // Snapshot fetched from the live Cloudflare script; executed only in the test VM.
  for (const key of [0x12, 0xdb, 0x71, 0x4a]) {
    const email = 'hello@steveafrost.com';
    const encoded = key.toString(16).padStart(2, '0') + [...email].map(c => (c.charCodeAt(0) ^ key).toString(16).padStart(2, '0')).join('');
    const menuLink = { href: 'https://steveafrost.com/cdn-cgi/l/email-protection#' + encoded };
    const bodyLink = { href: menuLink.href };
    const text = { value: '[email protected]' };
    const span = { getAttribute: () => encoded, parentNode: { replaceChild(node) { text.value = node.textContent; } } };
    const script = { attributes: { src: '/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js' }, getAttribute(key) { return this.attributes[key]; }, setAttribute(key, value) { this.attributes[key] = value; }, parentNode: { removeChild() {} } };
    const incoming = documentFixture(); incoming.querySelectorAll = () => [script];
    f.document.dispatch('astro:before-swap', { newDocument: incoming });
    assert.equal(script.attributes['data-astro-rerun'], '');
    const decodedDocument = {
      currentScript: script,
      querySelectorAll(query) { return query === 'a' ? [menuLink, bodyLink] : query === '.__cf_email__' ? [span] : []; },
      createTextNode: textContent => ({ textContent }),
      createElement() { return { set innerHTML(html) { this.childNodes = [{ getAttribute: () => html.match(/href="([^"]*)"/)[1] }]; } }; },
    };
    vm.runInNewContext(decoder, { document: decodedDocument, console });
    assert.equal(menuLink.href, 'mailto:' + email);
    assert.equal(bodyLink.href, 'mailto:' + email);
    assert.equal(text.value, email);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function target() {
  const listeners = new Map();
  return { addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type, event = {}) { for (const fn of [...(listeners.get(type) || [])]) fn(event); },
    dispatchEvent(event) { this.dispatch(event.type, event); }, count(type) { return listeners.get(type)?.size || 0; } };
}
function windowFixture(storage, day, night, home = false) {
  const control = Object.assign(target(), { attrs: {}, classList: { contains: name => name === 'theme-header' }, setAttribute(key, value) { this.attrs[key] = value; }, removeAttribute(key) { delete this.attrs[key]; } });
  const controls = [control, ...[0, 1].map(() => Object.assign(target(), { attrs: {}, classList: control.classList, setAttribute: control.setAttribute, removeAttribute: control.removeAttribute }))];
  const metas = { 'theme-color': { content: day }, 'color-scheme': { content: 'light' }, viewport: { content: '' } };
  for (const meta of Object.values(metas)) meta.setAttribute = (key, value) => { meta[key] = value; };
  const picture = home ? { dataset: { day: '/day.png', night: '/night.png' }, src: '/day.png', getAttribute(key) { return this[key]; }, setAttribute(key, value) { this[key] = value; } } : null;
  const document = Object.assign(target(), { documentElement: { dataset: { chromeDay: day, chromeNight: night, browserTemplate: home ? 'home' : 'featurette' }, style: { setProperty(key, value) { this[key] = value; } } },
    querySelector(query) { return query === '.river-picture' ? picture : metas[query.match(/meta\[name="([^"]+)"\]/)?.[1]] || null; },
    querySelectorAll(query) { return query === '.theme-toggle' ? controls : []; } });
  const context = vm.createContext({ ...target(), Event, document, localStorage: { getItem: () => { if (storage.denied) throw Error('storage blocked'); return storage.theme; }, setItem: (_, value) => { storage.theme = value; } }, console,
    Image: class { set src(value) { this.onload?.(); } } });
  for (const file of ['browser-chrome.js','navigation-lifecycle.js','theme.js']) vm.runInContext(fs.readFileSync('public/river-assets/'+file, 'utf8'), context);
  return { context, document, control, controls, metas, picture };
}
test('Home night → Kindle day → article night: native Back/Forward retains latest global appearance', () => {
  const storage = { theme: 'day' };
  const home = windowFixture(storage, '#c2dcd3', '#001b32', true); home.control.dispatch('click'); assert.equal(storage.theme, 'night');
  const kindle = windowFixture(storage, '#f4e9d6', '#f4e9d6'); kindle.control.dispatch('click'); assert.equal(storage.theme, 'day');
  const article = windowFixture(storage, '#f7f4eb', '#10222d'); article.control.dispatch('click'); assert.equal(storage.theme, 'night');
  kindle.context.dispatch('pagehide', { persisted: true });
  kindle.context.dispatch('pageshow', { persisted: true });
  assert.equal(kindle.document.documentElement.dataset.theme, 'night');
  assert.equal(kindle.metas['theme-color'].content, '#f4e9d6'); assert.equal(kindle.metas['color-scheme'].content, 'dark');
  assert.equal(kindle.control.attrs['aria-pressed'], 'true'); assert.equal(kindle.control.attrs['aria-label'], 'Switch to light mode');
  article.context.dispatch('pageshow', { persisted: true });
  assert.equal(article.document.documentElement.dataset.theme, 'night'); assert.equal(article.metas['theme-color'].content, '#10222d');
  const reload = windowFixture(storage, '#f4e9d6', '#f4e9d6'); assert.equal(reload.document.documentElement.dataset.theme, kindle.document.documentElement.dataset.theme);
  assert.equal(storage.theme, 'night');
});
test('cached homepage restoration updates artwork and preserves one controller per control', () => {
  const storage = { theme: 'day' }; const f = windowFixture(storage, '#c2dcd3', '#001b32', true);
  let stops = 0; f.document.addEventListener('river-artwork-changing', () => stops++);
  storage.theme = 'night';
  for (let visit = 0; visit < 4; visit++) f.context.dispatch('pageshow', { persisted: true });
  assert.equal(f.picture.src, '/night.png'); assert.equal(stops, 1);
  assert.equal(f.metas['theme-color'].content, '#001b32'); assert.equal(f.document.documentElement.style.backgroundColor, '#001b32');
  for (const control of f.controls) assert.equal(control.count('click'), 1); assert.equal(f.document.count('river-theme-restored'), 1);
});
test('ordinary first-load pageshow does not perform another theme/artwork restoration', () => {
  const storage = { theme: 'day' }; const f = windowFixture(storage, '#c2dcd3', '#001b32', true);
  let restores = 0; f.document.addEventListener('river-theme-restored', () => restores++);
  f.context.dispatch('pageshow', { persisted: false }); assert.equal(restores, 0); assert.equal(f.picture.src, '/day.png');
});

test('first load and cached Back/Forward synchronize header, menu and minimalist-footer controls', () => {
  const storage = { theme: 'night' };
  const f = windowFixture(storage, '#f7f4eb', '#10222d');
  for (const control of f.controls) {
    assert.equal(control.attrs['aria-pressed'], 'true');
    assert.equal(control.attrs['aria-label'], 'Switch to light mode');
  }
  for (const theme of ['day', 'night', 'day', 'night']) {
    storage.theme = theme;
    f.context.dispatch('pagehide', { persisted: true });
    f.context.dispatch('pageshow', { persisted: true });
    assert.equal(f.document.documentElement.dataset.theme, theme);
    assert.equal(f.metas['theme-color'].content, theme === 'night' ? '#10222d' : '#f7f4eb');
    for (const control of f.controls) {
      assert.equal(control.attrs['aria-pressed'], String(theme === 'night'));
      assert.equal(control.attrs['aria-label'], theme === 'night' ? 'Switch to light mode' : 'Switch to dark mode');
      assert.equal(control.count('click'), 1);
    }
  }
  assert.equal(f.document.count('river-theme-restored'), 1);
  assert.equal(f.context.count('pageshow'), 1);
});

test('Astro swaps dispose old theme listeners and keep exactly one restored-page listener', () => {
  const storage = { theme: 'day' };
  const f = windowFixture(storage, '#f7f4eb', '#10222d');
  let controls = f.controls;
  for (let visit = 0; visit < 4; visit++) {
    storage.theme = visit % 2 ? 'day' : 'night';
    const incoming = windowFixture(storage, '#f4e9d6', '#f4e9d6').document;
    f.document.dispatch('astro:before-swap', { newDocument: incoming });
    for (const control of controls) assert.equal(control.count('click'), 0);
    assert.equal(f.document.count('river-theme-restored'), 0);
    assert.equal(incoming.documentElement.dataset.theme, storage.theme);
    const replacement = windowFixture(storage, '#f7f4eb', '#10222d');
    replacement.context.dispatch('pagehide', { persisted: false });
    controls = replacement.controls;
    f.document.querySelectorAll = query => query === '.theme-toggle' ? controls : [];
    f.document.dispatch('astro:after-swap');
    f.document.dispatch('astro:page-load');
    f.document.dispatch('astro:page-load');
    assert.equal(f.document.documentElement.dataset.theme, storage.theme);
    for (const control of controls) {
      assert.equal(control.count('click'), 1);
      assert.equal(control.attrs['aria-pressed'], String(storage.theme === 'night'));
    }
    assert.equal(f.document.count('river-theme-restored'), 1);
  }
});

test('repeated scripts and cached restores do not restart retained resources or replace unchanged artwork', () => {
  const storage = { theme: 'day' };
  const f = windowFixture(storage, '#c2dcd3', '#001b32', true);
  let starts = 0, stops = 0, artworkChanges = 0;
  f.context.riverLifecycle.register('retained-resource', () => { starts++; return () => stops++; });
  f.document.addEventListener('river-artwork-changing', () => artworkChanges++);
  vm.runInContext(fs.readFileSync('public/river-assets/navigation-lifecycle.js', 'utf8'), f.context);
  vm.runInContext(fs.readFileSync('public/river-assets/theme.js', 'utf8'), f.context);
  for (let visit = 0; visit < 5; visit++) {
    f.context.dispatch('pagehide', { persisted: true });
    f.context.dispatch('pageshow', { persisted: true });
  }
  assert.equal(starts, 1); assert.equal(stops, 0); assert.equal(artworkChanges, 0);
  assert.equal(f.context.count('pageshow'), 1);
  assert.equal(f.document.count('river-theme-restored'), 1);
  for (const control of f.controls) assert.equal(control.count('click'), 1);
  f.context.dispatch('pagehide', { persisted: false });
  assert.equal(stops, 1);
  assert.equal(f.document.count('river-theme-restored'), 0);
  for (const control of f.controls) assert.equal(control.count('click'), 0);
});

test('blocked storage keeps restored DOM appearance and updates control ARIA without throwing', () => {
  const storage = { theme: 'day' };
  const f = windowFixture(storage, '#f7f4eb', '#10222d');
  storage.denied = true;
  f.document.documentElement.dataset.theme = 'night';
  assert.doesNotThrow(() => f.context.dispatch('pageshow', { persisted: true }));
  assert.equal(f.document.documentElement.dataset.theme, 'night');
  assert.equal(f.metas['theme-color'].content, '#10222d');
  for (const control of f.controls) assert.equal(control.attrs['aria-pressed'], 'true');
});

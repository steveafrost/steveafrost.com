import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('public/river-assets/browser-chrome.js', 'utf8');
function page(day, night) {
  const events = new Map();
  const metas = { 'theme-color': { content: day }, 'color-scheme': { content: 'light' } };
  for (const meta of Object.values(metas)) meta.setAttribute = (key, value) => { meta[key] = value; };
  return { documentElement: { dataset: { chromeDay: day, chromeNight: night }, style: {} }, metas,
    addEventListener: (name, fn) => events.set(name, fn), dispatch: (name, event) => events.get(name)?.(event),
    querySelector(selector) { return metas[selector.match(/meta\[name="([^"]+)"\]/)?.[1]] || null; }, querySelectorAll: () => [] };
}
function setup(saved = 'night') {
  const document = page('#c2dcd3', '#001b32');
  const context = vm.createContext({ document, localStorage: { getItem: () => saved, setItem() {} }, addEventListener() {}, console });
  vm.runInContext(source, context); return { document, context };
}
test('saved appearance sets chrome, root background and color scheme before first paint', () => {
  const { document } = setup();
  assert.equal(document.metas['theme-color'].content, '#001b32');
  assert.equal(document.documentElement.style.backgroundColor, '#001b32');
  assert.equal(document.documentElement.style.colorScheme, 'dark');
  assert.equal(document.metas['color-scheme'].content, 'dark');
});
test('storage failure retains deliberate daylight fallback', () => {
  const document = page('#f7f4eb', '#10222d');
  vm.runInNewContext(source, { document, localStorage: { getItem() { throw Error('unavailable'); } } });
  assert.equal(document.metas['theme-color'].content, '#f7f4eb'); assert.equal(document.documentElement.style.colorScheme, 'light');
});
test('real theme control updates browser chrome when the site appearance changes', () => {
  const { document, context } = setup('day');
  const control = { classList: { contains: () => false }, setAttribute() {}, addEventListener(name, fn) { this[name] = fn; } };
  document.querySelectorAll = () => [control];
  vm.runInContext(fs.readFileSync('public/river-assets/theme.js', 'utf8'), context);
  control.click(); assert.equal(document.metas['theme-color'].content, '#001b32');
  control.click(); assert.equal(document.metas['theme-color'].content, '#c2dcd3');
});
test('Astro prepares incoming template colors before swap, including Back/Forward and static illustration palettes', () => {
  const { document, context } = setup();
  vm.runInContext(fs.readFileSync('public/river-assets/navigation-lifecycle.js', 'utf8'), context);
  for (const [day, night] of [['#f7f4eb','#10222d'], ['#f4e9d6','#f4e9d6'], ['#f7f4eb','#f7f4eb'], ['#c2dcd3','#001b32']]) {
    const incoming = page(day, night); document.dispatch('astro:before-swap', { newDocument: incoming });
    assert.equal(incoming.metas['theme-color'].content, night);
    assert.equal(incoming.documentElement.style.backgroundColor, night);
    assert.equal(incoming.metas['color-scheme'].content, 'dark');
  }
});
test('built template metadata has one color request and existing viewport without standalone mode changes', () => {
  const cases = [['index.html','home','#c2dcd3','#001b32'],['about/index.html','about','#f7f4eb','#f7f4eb'],['articles/index.html','list','#f7f4eb','#10222d'],['articles/building-a-nightly-newspaper-for-my-kindle/index.html','article','#f7f4eb','#10222d'],['projects/kindle-newspaper/index.html','featurette','#f4e9d6','#f4e9d6'],['projects/pi-skill-recommender/index.html','featurette-screen','#f7f4eb','#10222d']];
  for (const [route, template, day, night] of cases) {
    const html = fs.readFileSync('dist/'+route, 'utf8');
    assert.ok(html.includes(`data-browser-template="${template}"`));
    assert.ok(html.includes(`data-chrome-day="${day}"`) && html.includes(`data-chrome-night="${night}"`));
    assert.equal([...html.matchAll(/<meta name="theme-color"/g)].length, 1);
    assert.ok(html.includes('<meta name="theme-color" content="'+day+'"'));
    assert.ok(html.includes('width=device-width, initial-scale=1'));
    assert.ok(!html.includes('apple-mobile-web-app-capable') && !html.includes('viewport-fit=cover'));
  }
});

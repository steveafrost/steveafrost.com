import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import vm from 'node:vm';
test('Safari body canvas follows root template color while reading surfaces retain their paper', () => {
  const css = postcss.parse(fs.readFileSync('public/river-assets/production.css', 'utf8'));
  const rules = []; css.walkRules(rule => rules.push(rule));
  const body = rules.filter(rule => rule.selector === 'body.river-site').at(-1);
  assert.equal(body.nodes.find(node => node.prop === 'background-color')?.value, 'var(--browser-chrome-color,var(--cream))');
  const content = rules.find(rule => rule.selector === 'body.river-site #main,body.river-site .river-footer');
  assert.equal(content.nodes.find(node => node.prop === 'background-color')?.value, 'var(--cream)');
  assert.ok(!rules.some(rule => rule.selector.includes('browser-safe-area')));
});
test('root custom property synchronizes both page background providers through appearance and incoming page changes', () => {
  const source = fs.readFileSync('public/river-assets/browser-chrome.js', 'utf8');
  function page(day, night) {
    const metas = { 'theme-color': {}, 'color-scheme': {} };
    for (const meta of Object.values(metas)) meta.setAttribute = (key, value) => { meta[key] = value; };
    return { documentElement: { dataset: { chromeDay: day, chromeNight: night }, style: { setProperty(key, value) { this[key] = value; } } }, querySelector: query => metas[query.match(/name="([^"]+)"/)?.[1]] };
  }
  const document = page('#c2dcd3','#001b32'); const context = vm.createContext({ document, localStorage: { getItem: () => 'night' } });
  vm.runInContext(source, context);
  assert.equal(document.documentElement.style['--browser-chrome-color'], '#001b32');
  for (const [day, night] of [['#f7f4eb','#10222d'],['#f4e9d6','#f4e9d6'],['#f7f4eb','#f7f4eb']]) {
    const incoming = page(day,night);
    for (const theme of ['day','night']) {
      context.riverBrowserChrome(incoming,theme);
      assert.equal(incoming.documentElement.style['--browser-chrome-color'], theme === 'night' ? night : day);
      assert.equal(incoming.documentElement.style.backgroundColor, incoming.documentElement.style['--browser-chrome-color']);
    }
  }
});
test('built templates provide body canvas color before JavaScript and retain automatic notch insetting outside Home', () => {
  for (const route of ['index.html','about/index.html','projects/kindle-newspaper/index.html','projects/pi-skill-recommender/index.html','articles/building-a-nightly-newspaper-for-my-kindle/index.html']) {
    const html = fs.readFileSync('dist/'+route,'utf8');
    const day = html.match(/data-chrome-day="([^"]+)"/)[1];
    assert.ok(html.includes('--browser-chrome-color:'+day));
    assert.ok(html.includes('viewport-fit='+ (route === 'index.html' ? 'cover' : 'auto')));
    assert.ok(!html.includes('viewport-fit='+ (route === 'index.html' ? 'auto' : 'cover')));
    assert.ok(html.includes('production.css?v=featurette-viewport-1-home-sky-3'));
    assert.ok(!html.includes('apple-mobile-web-app-capable'));
  }
});

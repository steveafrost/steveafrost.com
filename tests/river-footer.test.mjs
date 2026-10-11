import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const built=route=>fs.readFileSync(`dist/${route}`,'utf8');
test('every shared footer keeps the three destinations and native client navigation',()=>{
  const routes=fs.readdirSync('dist',{recursive:true}).filter(path=>path.endsWith('.html'));
  let count=0;
  for(const route of routes){
    const html=built(route),footer=html.match(/<footer class="river-footer river-footer-minimal"[\s\S]*?<\/footer>/)?.[0];
    if(!footer)continue;count++;
    assert.deepEqual([...footer.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]),['/','/projects','https://github.com/steveafrost']);
    assert.ok(footer.includes('aria-label="Footer"'));
    assert.ok(!footer.includes('data-astro-reload')&&!footer.includes('role="menu"'));
    assert.equal([...footer.matchAll(/class="theme-toggle theme-header theme-footer"/g)].length,1);
    assert.ok(!/Light mode|Night mode|Useful things|<img\b|footer-art|footer-meta/.test(footer));
    assert.ok(footer.includes('aria-label="Switch to dark mode"'));
    assert.ok(footer.includes('aria-pressed="false"'));
    assert.ok(!/Ann Arbor|Michigan|location/i.test(footer),'footer must not expose a location in text or accessible variants');
  }
  assert.equal(count,71);
  assert.ok(!built('knight-school/index.html').includes('river-footer-minimal'));
  assert.ok(!built('projects/mock/caamp/index.html').includes('river-footer-minimal'));
});

test('footer controls share theme state with header, survive route entry, and remove old listeners',()=>{
  const listeners=new Map(), saved=[];
  const document={addEventListener(type,fn){listeners.set(type,fn);},removeEventListener(type,fn){assert.equal(listeners.get(type),fn);listeners.delete(type);},documentElement:{dataset:{theme:'day'}},querySelector:()=>null,querySelectorAll:()=>controls};
  const control=()=>({attrs:{},classList:{contains:name=>name==='theme-header'},setAttribute(name,value){this.attrs[name]=value;},addEventListener(type,fn){assert.equal(type,'click');listeners.set(this,fn);},removeEventListener(type,fn){assert.equal(type,'click');assert.equal(listeners.get(this),fn);listeners.delete(this);}});
  let controls=[control(),control()];
  const context=vm.createContext({document,riverLifecycle:{register(){}},localStorage:{setItem:(key,value)=>saved.push([key,value])}});
  vm.runInContext(fs.readFileSync('public/river-assets/theme.js','utf8'),context);
  let cleanup=context.initializeTheme();
  for(let visit=0;visit<4;visit++){
    listeners.get(controls[1])();
    assert.equal(document.documentElement.dataset.theme,'night');
    for(const node of controls){assert.equal(node.attrs['aria-pressed'],'true');assert.equal(node.attrs['aria-label'],'Switch to light mode');}
    listeners.get(controls[0])();
    assert.equal(document.documentElement.dataset.theme,'day');
    for(const node of controls){assert.equal(node.attrs['aria-pressed'],'false');assert.equal(node.attrs['aria-label'],'Switch to dark mode');}
    cleanup();assert.equal(listeners.size,0);
    controls=[control(),control()];cleanup=context.initializeTheme();
  }
  assert.equal(saved.length,8);
});

test('footer responsive rules allow narrow wrapping without introducing motion or altering the Home sky',()=>{
  const component=fs.readFileSync('src/components/RiverFooter.astro','utf8');
  assert.ok(component.includes('@media(max-width:760px)'));
  assert.ok(component.includes("grid-template-areas:'name theme' 'links links'"));
  assert.ok(component.includes('flex-wrap:wrap'));
  assert.ok(component.includes('overflow-wrap:anywhere'));
  assert.ok(component.includes('min-height:44px'));
  assert.ok(!/animation:|transition:|<canvas|requestAnimationFrame/.test(component));
  assert.ok(built('index.html').includes('viewport-fit=cover'));
  assert.ok(built('about/index.html').includes('viewport-fit=auto'));
  assert.equal([...built('index.html').matchAll(/data-home-edge=/g)].length,5);
  assert.ok(built('projects/index.html').includes('/projects-assets/river-footer.webp'));
  assert.ok(!component.includes('river-footer.webp')&&!component.includes('river-full-bleed.png'));
});

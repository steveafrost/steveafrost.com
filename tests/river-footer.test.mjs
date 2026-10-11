import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import sharp from 'sharp';

const built=route=>fs.readFileSync(`dist/${route}`,'utf8');
test('every shared footer keeps the three destinations and native client navigation',()=>{
  const routes=fs.readdirSync('dist',{recursive:true}).filter(path=>path.endsWith('.html'));
  let count=0;
  for(const route of routes){
    const html=built(route),footer=html.match(/<footer class="river-footer river-footer-edge"[\s\S]*?<\/footer>/)?.[0];
    if(!footer)continue;count++;
    assert.deepEqual([...footer.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]),['/','/projects','https://github.com/steveafrost']);
    assert.ok(footer.includes('aria-label="Footer"'));
    assert.ok(!footer.includes('data-astro-reload')&&!footer.includes('role="menu"'));
    assert.equal([...footer.matchAll(/class="theme-toggle theme-header theme-footer"/g)].length,1);
    assert.ok(footer.includes('Light mode')&&footer.includes('Night mode'));
    assert.ok(!/Ann Arbor|Michigan|location/i.test(footer),'footer must not expose a location in text or accessible variants');
  }
  assert.equal(count,71);
  assert.ok(!built('knight-school/index.html').includes('river-footer-edge'));
  assert.ok(!built('projects/mock/caamp/index.html').includes('river-footer-edge'));
});

test('footer controls share theme state with header, survive route entry, and remove old listeners',()=>{
  const listeners=new Map(), saved=[];
  const document={documentElement:{dataset:{theme:'day'}},querySelector:()=>null,querySelectorAll:()=>controls};
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

test('art is raster, transparent at its wavy cap, lightweight, and decorative',async()=>{
  const html=built('index.html'),footer=html.match(/<footer class="river-footer river-footer-edge"[\s\S]*?<\/footer>/)[0];
  assert.ok(footer.includes('class="footer-art" aria-hidden="true"'));
  const images=[...footer.matchAll(/<img\b[^>]*src="(\/footer-assets\/[^\"]+)"[^>]*>/g)];
  assert.equal(images.length,6);
  let bytes=0;
  for(const [tag,src] of images){
    assert.ok(tag.includes('alt=""'));assert.ok(tag.includes('fetchpriority="low"'));
    const path='public'+src;bytes+=fs.statSync(path).size;
    const meta=await sharp(path).metadata();assert.equal(meta.width,2172);assert.equal(meta.format,'webp');
    if(src.includes('-cap')){
      const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      assert.equal(data[3],0);
      assert.ok(data[(info.width*(info.height-1)+info.width/2)*4+3]>240);
    }
  }
  assert.ok(bytes<400000);
});

test('footer responsive rules allow narrow wrapping without introducing motion or altering the Home sky',()=>{
  const component=fs.readFileSync('src/components/RiverFooter.astro','utf8');
  assert.ok(component.includes('@media(max-width:760px)'));
  assert.ok(component.includes('grid-template-columns:minmax(0,1fr);gap:26px'));
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

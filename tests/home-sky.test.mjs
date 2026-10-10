import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import postcss from 'postcss';
import { homeEdgeViews, initializeHomeSky } from '../public/river-assets/home-sky.mjs';

test('portrait, landscape and desktop edge samples retain the existing hero crop', () => {
  for (const [width,height,focus] of [[390,450,.7],[734,430,.5],[1440,547.2,.5],[1920,620,.5]]) {
    const views = homeEdgeViews(width,height,focus,.5);
    const scale = Math.max(width/2172,height/724);
    const cropWidth = width/scale, cropHeight = height/scale;
    assert.deepEqual(views.top,[(2172-cropWidth)*focus,(724-cropHeight)*.5,cropWidth,1]);
    assert.equal(views.left[2],1); assert.equal(views.right[2],1);
    assert.equal(views.left[3],cropHeight); assert.equal(views.right[3],cropHeight);
    for (const [x,y,w,h] of Object.values(views)) {
      assert.ok(x >= 0 && y >= 0 && x+w <= 2172+.000001 && y+h <= 724+.000001);
    }
  }
  assert.equal(homeEdgeViews(0,450),null);
});

test('actual edge controller follows rotation and artwork loads, and disposes cleanly', () => {
  const original = new Map(['document','getComputedStyle','ResizeObserver','addEventListener','removeEventListener'].map(key => [key,globalThis[key]]));
  const events = new Map(), loads = new Set(); let observer, disconnected = 0;
  const edges = ['top','left','right','top-left','top-right'].map(homeEdge => ({ dataset:{homeEdge},setAttribute(key,value){this[key]=value;} }));
  const picture = { addEventListener(type,fn){assert.equal(type,'load');loads.add(fn);},removeEventListener(type,fn){assert.equal(type,'load');loads.delete(fn);} };
  const scene = {clientWidth:390,clientHeight:450,querySelector:()=>picture};
  const frame = {querySelector:()=>scene,querySelectorAll:()=>edges}; let position = '70% 50%';
  try {
    globalThis.document={querySelector:()=>frame}; globalThis.getComputedStyle=()=>({objectPosition:position});
    globalThis.ResizeObserver=class{constructor(fn){observer=fn;}observe(node){assert.equal(node,scene);}disconnect(){disconnected++;}};
    globalThis.addEventListener=(type,fn)=>events.set(type,fn);
    globalThis.removeEventListener=(type,fn)=>{assert.equal(events.get(type),fn);events.delete(type);};
    const cleanup=initializeHomeSky(); const portrait=edges[0].viewBox;
    scene.clientWidth=734;scene.clientHeight=430;position='50% 50%';observer();
    assert.notEqual(edges[0].viewBox,portrait);
    assert.equal(edges[0].viewBox,homeEdgeViews(734,430).top.join(' '));
    scene.clientWidth=390;scene.clientHeight=450;position='70% 50%';events.get('resize')();
    assert.equal(edges[0].viewBox,portrait); [...loads][0](); assert.equal(edges[0].viewBox,portrait);
    cleanup(); assert.equal(events.size,0);assert.equal(loads.size,0);assert.equal(disconnected,1);
    scene.clientWidth=600;observer();assert.equal(edges[0].viewBox,portrait);
    document.querySelector=()=>null;assert.equal(initializeHomeSky(),undefined);
  } finally { for (const [key,value] of original) { if(value===undefined)delete globalThis[key];else globalThis[key]=value; } }
});

test('actual Astro head swap restores cover/auto across Home, inner pages and return navigation', () => {
  const astro = fs.readFileSync('node_modules/astro/dist/transitions/swap-functions.js','utf8');
  const source = astro.slice(astro.indexOf('function swapHeadElements('),astro.indexOf('function swapBodyElement(')).replaceAll('import.meta.env.DEV','false');
  function page(route) {
    const html=fs.readFileSync('dist/'+route,'utf8'), content=html.match(/<meta name="viewport" content="([^"]+)"/)[1];
    const head={children:[],querySelector:()=>null};
    const meta={nodeType:1,content,remove(){this.parent.children=this.parent.children.filter(n=>n!==this);}};
    meta.parent=head;head.children=[meta];Object.defineProperty(head,'childNodes',{get:()=>head.children});
    head.append=(...nodes)=>{for(const node of nodes)node.parent=head;head.children.push(...nodes);};return {head};
  }
  const document=page('index.html');
  const context=vm.createContext({document,SERVER_ISLAND_START:'astro:server-island',persistedHeadElement:()=>null});
  vm.runInContext(source,context);
  for(const route of ['about/index.html','index.html','articles/index.html','index.html','projects/kindle-newspaper/index.html','index.html']) {
    context.swapHeadElements(page(route));
    assert.equal(document.head.children.length,1);
    assert.equal(document.head.children[0].content,'width=device-width, initial-scale=1, viewport-fit='+(route==='index.html'?'cover':'auto'));
  }
});

test('Home covers portrait only; theme changes and incoming pages preserve landscape framing', () => {
  const source=fs.readFileSync('public/river-assets/browser-chrome.js','utf8');
  let landscape=false,stored='day';
  function page(template){
    const viewport={setAttribute(key,value){this[key]=value;}};
    return {viewport,documentElement:{dataset:{browserTemplate:template,chromeDay:'#c2dcd3',chromeNight:'#001b32'},style:{setProperty(){}}},querySelector:selector=>selector==='meta[name="viewport"]'?viewport:null};
  }
  const document=page('home');
  const context=vm.createContext({document,matchMedia:()=>({matches:landscape}),localStorage:{getItem:()=>stored}});
  vm.runInContext(source,context);
  assert.ok(document.viewport.content.endsWith('cover'));
  for(const orientation of [true,false,true,false]){
    landscape=orientation;
    for(const template of ['home','article','featurette','list','home']){
      const incoming=page(template);
      for(const theme of ['day','night']){
        context.riverBrowserChrome(incoming,theme);
        assert.equal(incoming.viewport.content,'width=device-width, initial-scale=1, viewport-fit='+ (template==='home'&&!landscape?'cover':'auto'));
      }
    }
  }
  landscape=true;stored='night';vm.runInContext(source,context);
  assert.ok(document.viewport.content.endsWith('auto'));
  assert.equal(document.documentElement.dataset.theme,'night');
});

test('full-height safe-area layout is Home-scoped and zero insets preserve the deployed layout', () => {
  const css=postcss.parse(fs.readFileSync('public/river-assets/production.css','utf8'));
  const rules=[];css.walkRules(rule=>rules.push(rule));
  const home=rules.findLast(rule=>rule.selector==='body.river-home');
  assert.equal(home.nodes.find(n=>n.prop==='padding-bottom').value,'env(safe-area-inset-bottom,0px)');
  const main=rules.findLast(rule=>rule.selector==='body.river-home #main');
  assert.equal(main.nodes.find(n=>n.prop==='padding-left').value,'var(--home-safe-left)');
  assert.equal(main.nodes.find(n=>n.prop==='padding-right').value,'var(--home-safe-right)');
  assert.equal(rules.findLast(rule=>rule.selector==='body.river-home .landscape').nodes.find(n=>n.prop==='height').value,'var(--river-hero-height)');
  assert.equal(rules.find(rule=>rule.selector==='.river-site').nodes.find(n=>n.prop==='min-height').value,'100vh');
  assert.equal(rules.find(rule=>rule.selector==='.river-site #main').nodes.find(n=>n.prop==='flex').value,'1');
  assert.equal(rules.find(rule=>rule.selector==='.home-sky-space').nodes.find(n=>n.prop==='height').value,'var(--home-sky-top)');
  assert.equal(rules.find(rule=>rule.selector==='.home-river-extension').nodes.find(n=>n.prop==='position').value,'absolute');

});

test('edge imagery switches with the same root appearance as the hero, without repeated artwork or animation', () => {
  const component=fs.readFileSync('src/components/HomeRiverExtension.astro','utf8');
  assert.ok(component.includes('aria-hidden="true"') && component.includes('focusable="false"'));
  assert.ok(component.includes('river-full-bleed.png') && component.includes('river-night-sky.png'));
  const css=fs.readFileSync('public/river-assets/production.css','utf8');
  assert.ok(css.includes('[data-theme="night"] .home-edge-day{display:none}'));
  assert.ok(css.includes('[data-theme="night"] .home-edge-night{display:block}'));
  assert.ok(!component.includes('canvas') && !component.includes('scaleY(-1)'));
  const html=fs.readFileSync('dist/index.html','utf8');
  assert.equal([...html.matchAll(/data-home-edge=/g)].length,5);
  assert.ok(html.includes('/river-assets/home-sky.mjs?v=edge-1'));
  for(const route of ['about/index.html','articles/index.html','projects/kindle-newspaper/index.html']) {
    const inner=fs.readFileSync('dist/'+route,'utf8');
    assert.ok(!inner.includes('data-home-edge=') && !inner.includes('/river-assets/home-sky.mjs'));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {bikePose,wheelRadius,wheelbase,deck,deckSlope,arcLength,riderPose,crossingAt,advanceLean,steamAt,pedalRadius,driveRatio,bridgeSpan,steamParcelCount,steamLifetime} from '../public/about-assets/scene-model.mjs';
import {initializeAboutMotion} from '../public/about-assets/motion.mjs';
const close=(a,b,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
test('both wheels contact curved deck with a rigid wheelbase and rolling arc length',()=>{
 let prior=null;
 for(let i=0;i<=3260;i++){const x=198+i*.1,p=bikePose(x);close(Math.hypot(p.front.x-p.rear.x,p.front.y-p.rear.y),wheelbase);
  for(const w of [p.rear,p.front]){close(Math.hypot(w.x-w.contactX,w.y-deck(w.contactX)),wheelRadius);close((w.x-w.contactX)+(w.y-w.contactY)*deckSlope(w.contactX),0);}
  if(prior){assert.ok(Math.abs(p.angle-prior.angle)<.001);close(arcLength(x-.1,x),Math.hypot(p.rear.x-prior.rear.x,p.rear.y-prior.rear.y),1e-6);}
  prior=p;
 }
});
test('knees/elbow maintain connected fixed lengths at every crank phase and allowed lean',()=>{
 for(let i=0;i<=720;i++)for(const lean of [-1.5,0,1.5]){const p=riderPose(i*Math.PI/360,lean);
  for(const [a,b,len] of [[p.hip,p.nearKnee,18],[p.nearKnee,p.nearFoot,18],[p.hip,p.farKnee,18],[p.farKnee,p.farFoot,18],[p.shoulder,p.elbow,13],[p.elbow,p.hand,13]])close(Math.hypot(a.x-b.x,a.y-b.y),len);
  close(Math.hypot(p.nearFoot.x-22,p.nearFoot.y),pedalRadius);close(p.nearFoot.x+p.farFoot.x,44);close(p.nearFoot.y+p.farFoot.y,0);
 }
});
test('rolling phase follows distance, fade prevents visible loop teleport, inertia is stable',()=>{
 const a=crossingAt(8),b=crossingAt(9);close((b.rearWheel-a.rearWheel)*wheelRadius,arcLength(a.rear.contactX,b.rear.contactX));
 assert.equal(crossingAt(27.999).visible,false);assert.equal(crossingAt(0).visible,false);close(crossingAt(3).alpha,0);close(crossingAt(23).alpha,0);
 const s={value:0,velocity:0};for(let i=0;i<300;i++)advanceLean(s,1,1/30);close(s.value,1,1e-5);assert.ok(Number.isFinite(s.velocity));
 for(let i=0;i<6;i++)for(let t=0;t<30;t+=.1){const p=steamAt(t,i);assert.ok(p.alpha>=0&&p.alpha<=.9&&p.y<=435&&p.y>=400.8&&p.scaleX>=1);}
});
class Events{listeners=new Map();addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}emit(type,event={}){for(const fn of this.listeners.get(type)||[])fn(event);}}
function fixture(){const environment=new Events(),doc=new Events(),button=new Events(),canvas=new Events();canvas.style={};button.setAttribute=()=>{};
 const desktop=new Events(),reduced=new Events();desktop.matches=true;reduced.matches=false;environment.matchMedia=q=>q.includes('min-width')?desktop:reduced;
 let io;environment.IntersectionObserver=class{constructor(fn){io=fn;}observe(){}disconnect(){}};
 const frames=new Map();let id=0;environment.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};environment.cancelAnimationFrame=id=>frames.delete(id);
 const host={},root={ownerDocument:doc,dataset:{},querySelector:s=>s.includes('pause')?button:host,querySelectorAll:()=>[{dataset:{motionZone:'bridge'}},{dataset:{motionZone:'desk'}}]};
 let draws=0,destroys=0;const scene={canvas,draw(){draws++;},destroy(){destroys++;}};
 const cleanup=initializeAboutMotion(root,environment,async()=>({createAboutScene:async()=>scene}));
 return {environment,doc,button,reduced,desktop,frames,root,canvas,cleanup,get draws(){return draws;},get destroys(){return destroys;},visible(key,value){io([{target:{dataset:{motionZone:key}},isIntersecting:value}]);},step(time){const list=[...frames.values()];frames.clear();for(const fn of list)fn(time);}};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('one frame loop stops on pause/offscreen/hidden/reduced/narrow and cleans resources',async()=>{
 const f=fixture();assert.equal(f.frames.size,0);f.visible('desk',true);await flush();assert.equal(f.frames.size,1);f.visible('bridge',true);assert.equal(f.frames.size,1);
 for(let t=0;t<1000;t+=1000/60)f.step(t);assert.ok(f.draws<=32&&f.draws>=20);
 f.button.emit('click');assert.equal(f.frames.size,0);f.button.emit('click');assert.equal(f.frames.size,1);
 f.doc.hidden=true;f.doc.emit('visibilitychange');assert.equal(f.frames.size,0);f.doc.hidden=false;f.doc.emit('visibilitychange');assert.equal(f.frames.size,1);
 f.reduced.matches=true;f.reduced.emit('change');assert.equal(f.frames.size,0);assert.equal(f.button.disabled,true);f.reduced.matches=false;f.reduced.emit('change');
 f.desktop.matches=false;f.desktop.emit('change');assert.equal(f.frames.size,0);f.desktop.matches=true;f.desktop.emit('change');
 f.visible('desk',false);f.visible('bridge',false);assert.equal(f.frames.size,0);f.visible('bridge',true);
 f.environment.emit('pagehide',{persisted:true});assert.equal(f.frames.size,0);f.environment.emit('pageshow');assert.equal(f.frames.size,1);
 f.canvas.emit('webglcontextlost');assert.equal(f.frames.size,0);assert.equal(f.button.disabled,true);
 f.cleanup();f.cleanup();assert.equal(f.destroys,1);assert.equal(f.frames.size,0);
});
test('actual Pixi scene graph has bounded limb geometry and reuses contexts between frames',async()=>{
 const {createAboutScene}=await import('../public/about-assets/scene-renderer.mjs');let stage,options,destroyed=false;
 class Renderer{canvas={setAttribute(){},addEventListener(){},remove(){}};async init(o){options=o;}render(o){stage=o.container;}destroy(){destroyed=true;}}
 const scene=await createAboutScene({append(){}},{Renderer});assert.equal(options.width,670);assert.equal(options.height,320);assert.equal(options.powerPreference,'low-power');
 scene.draw(13,1/30,{bridge:true,desk:true});const bike=stage.children[0],contexts=bike.children.map(n=>n.context);const bounds=bike.getLocalBounds();assert.equal(bike.children[6].context.bounds.minX,0);assert.equal(bike.children[6].context.bounds.maxX,1);assert.ok(bounds.maxX-bounds.minX<80&&bounds.maxY-bounds.minY<90);
 for(let t=3.1;t<23;t+=.2){scene.draw(t,1/30,{bridge:true,desk:true});assert.deepEqual(bike.children.map(n=>n.context),contexts);assert.ok(bike.getLocalBounds().maxX-bike.getLocalBounds().minX<80);}
 scene.destroy();assert.equal(destroyed,true);
});
test('preview revision lifts tire contact and gives readable geared cadence and steam',()=>{
 const p=bikePose(360),norm=Math.hypot(1,deckSlope(360));
 const legacyY=634+.00032*(360-420)**2-10/norm;
 const lift=(legacyY-p.rear.y)*1440/1122;assert.ok(lift>3&&lift<3.7);
 const a=crossingAt(9),b=crossingAt(10);assert.ok(b.crank-a.crank>3.8);close((b.crank-a.crank)*wheelRadius*driveRatio,arcLength(a.rear.contactX,b.rear.contactX));
 const r=riderPose(0),opposite=riderPose(Math.PI);close(Math.hypot(r.nearFoot.x-opposite.nearFoot.x,r.nearFoot.y-opposite.nearFoot.y),14.4);
});
test('actual Pixi crank, wheel and connected limb transforms change across visible frames',async()=>{
 const {createAboutScene}=await import('../public/about-assets/scene-renderer.mjs');let stage;
 class Renderer{canvas={setAttribute(){},addEventListener(){},remove(){}};async init(){}render(o){stage=o.container;}destroy(){}}
 const scene=await createAboutScene({append(){}},{Renderer});scene.draw(9,1/30,{bridge:true,desk:true});
 const bike=stage.children[0],nearShoe=bike.children[13],upper=bike.children[11],crank=bike.children[14];
 const previous={wheel:bike.children[0].rotation,crank:crank.rotation,shoeX:nearShoe.x,shoeY:nearShoe.y,upper:upper.rotation,torso:bike.children[6].rotation,steamY:stage.children[1].children[0].y};
 scene.draw(9.8,1/30,{bridge:true,desk:true});assert.ok(crank.rotation-previous.crank>3);assert.ok(bike.children[0].rotation-previous.wheel>1);
 assert.ok(Math.hypot(nearShoe.x-previous.shoeX,nearShoe.y-previous.shoeY)>10);assert.ok(Math.abs(upper.rotation-previous.upper)>.2);assert.notEqual(bike.children[6].rotation,previous.torso);assert.notEqual(stage.children[1].children[0].y,previous.steamY);scene.destroy();
});
test('fade-out stays on the visible almost-level right deck until fully hidden',()=>{
 // Reference image right-hand road crest, independent of prior parabola.
 for(const x of [540,550,565,575])assert.ok(deck(x)>634&&deck(x)<636);
 let prior=null;
 for(let time=21.3;time<=23;time+=.005){const p=crossingAt(time);assert.ok(p.rear.contactX>=bridgeSpan.start&&p.front.contactX<=bridgeSpan.end);assert.ok(p.front.contactY<636);
  close(Math.hypot(p.front.x-p.front.contactX,p.front.y-p.front.contactY),wheelRadius);close(Math.hypot(p.rear.x-p.rear.contactX,p.rear.y-p.rear.contactY),wheelRadius);close(Math.hypot(p.front.x-p.rear.x,p.front.y-p.rear.y),wheelbase);
  if(prior){assert.ok(p.alpha<=prior.alpha+.00001);assert.ok(Math.abs(p.front.y-prior.front.y)<.02);}prior=p;
 }
 assert.equal(crossingAt(23.001).visible,false);close(crossingAt(23).alpha,0);assert.throws(()=>bikePose(581),RangeError);
});
test('one pooled steam layer is rendered; reduced-motion restores single static fallback',async()=>{
 const {createAboutScene}=await import('../public/about-assets/scene-renderer.mjs');let stage;
 class Renderer{canvas={setAttribute(){},addEventListener(){},remove(){}};async init(){}render(o){stage=o.container;}destroy(){}}
 const scene=await createAboutScene({append(){}},{Renderer});scene.draw(22.5,1/30,{bridge:true,desk:true});assert.equal(stage.children[1].children.length,steamParcelCount);assert.ok(stage.children[1].children.every(p=>p.context===stage.children[1].children[0].context));scene.destroy();
 const f=fixture();assert.equal(f.root.dataset.steam,'static');f.visible('desk',true);await flush();assert.equal(f.root.dataset.steam,'animated');f.button.emit('click');assert.equal(f.root.dataset.steam,'animated');f.reduced.matches=true;f.reduced.emit('change');assert.equal(f.root.dataset.steam,'static');assert.equal(f.canvas.style.visibility,'hidden');f.cleanup();assert.equal(f.root.dataset.steam,'static');
});
test('steam advects upward, expands and dissipates; rebirth happens only while invisible',()=>{
 for(let index=0;index<steamParcelCount;index++){
  const offset=index*steamLifetime/steamParcelCount;let prior=null;
  for(let age=.001;age<steamLifetime;age+=.01){const p=steamAt(steamLifetime-offset+age,index);close(p.age,age);
   assert.ok(Math.abs(p.x-578)<2.2);assert.ok(p.scaleY>=.75);
   if(prior){assert.ok(p.y<prior.y);assert.ok(p.scaleX>prior.scaleX&&p.scaleY>prior.scaleY);if(age>.36)assert.ok(p.alpha<prior.alpha);}
   prior=p;
  }
  const end=steamAt(2*steamLifetime-offset-.00001,index),birth=steamAt(2*steamLifetime-offset,index);assert.ok(end.alpha<.000001);assert.ok(birth.alpha<.000001);close(birth.y,435);
 }
 const a=steamAt(.5),b=steamAt(1.5);close(a.y-b.y,3.325);assert.ok(b.scaleX>a.scaleX);assert.ok(Math.abs(a.x-b.x)<3);
});

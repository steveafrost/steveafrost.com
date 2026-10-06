export const crossingDuration=18;
export function bridgeY(x){return 464+(x-735)*14/450;}
export function crossingX(progress,direction=1){return direction===1?680+560*progress:1240-560*progress;}
export const cyclistMarkup=`<defs><clipPath id="cycle-bridge-road" clipPathUnits="userSpaceOnUse"><path d="M725 390 1187 403 1187 477 725 463Z"/></clipPath></defs><g clip-path="url(#cycle-bridge-road)"><g data-rider=""><g fill="none" stroke="var(--cycle-wheel,#20372f)" stroke-width="2.2"><circle cx="-18" cy="-9" r="9"/><circle cx="19" cy="-9" r="9"/><g data-rear-spokes=""><path d="M-27-9h18m-9-9v18" stroke-width="1.1"/></g><g data-front-spokes=""><path d="M10-9h18m-9-9v18" stroke-width="1.1"/></g></g><path d="M-18-9-8-26 0-9-18-9M-8-26 12-26 0-9m12-17 7 17m-9-19 7-2 5 1" fill="none" stroke="var(--cycle-frame,#b87540)" stroke-width="2.7" stroke-linejoin="round"/><path d="M-12-28h10" stroke="var(--cycle-wheel,#20372f)" stroke-width="2.5"/><path data-far-leg="" d="M-3-29 7-18 0-9" fill="none" stroke="var(--cycle-trousers,#526459)" stroke-width="4" stroke-linecap="round"/><path d="M-4-45 7-39 2-29-10-30Z" fill="var(--cycle-coat,#cf7845)"/><path d="M5-39 12-33 18-30" fill="none" stroke="var(--cycle-skin,#cfa67c)" stroke-width="3.5" stroke-linecap="round"/><path d="M-2-43 0-48" stroke="var(--cycle-skin,#cfa67c)" stroke-width="4"/><circle cx="2" cy="-52" r="5" fill="var(--cycle-skin,#cfa67c)"/><path d="M-4-52q0-9 11-5l2 5Z" fill="var(--cycle-helmet,#e5d7ab)"/><path data-near-leg="" d="M-3-29-10-18 0-9" fill="none" stroke="var(--cycle-trousers,#526459)" stroke-width="4" stroke-linecap="round"/><g data-crank=""><path d="M-5-9H5" stroke="var(--cycle-wheel,#20372f)" stroke-width="2"/><circle cy="-9" r="2.8" fill="var(--cycle-wheel,#20372f)"/></g></g></g>`;
if(typeof document!=='undefined'){
 const state=window.riverMotion,scene=document.querySelector('.landscape');
 if(state&&scene&&!state.cyclistFrame){
  const layer=document.createElementNS('http://www.w3.org/2000/svg','svg');layer.classList.add('bridge-cyclist-layer');layer.setAttribute('aria-hidden','true');layer.setAttribute('preserveAspectRatio','none');layer.innerHTML=cyclistMarkup;scene.append(layer);
  // All nodes are found once. One fixed schedule record; no per-frame arrays,
  // objects, layout reads, selectors, timers, RAFs, filters or network fetches.
  const rider=layer.querySelector('[data-rider]'),rear=layer.querySelector('[data-rear-spokes]'),front=layer.querySelector('[data-front-spokes]'),crank=layer.querySelector('[data-crank]'),near=layer.querySelector('[data-near-leg]'),far=layer.querySelector('[data-far-leg]'),crop=scene.querySelector('.lamp-repairs');
  const params=new URLSearchParams(location.search),forced=params.get('cyclist')==='midpoint';let seed=Number(params.get('cyclist-seed'))||crypto.getRandomValues(new Uint32Array(1))[0];const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  let start=12+random()*20,direction=random()<.5?1:-1,visible=false,lastCrop='';const debug={active:false,start,duration:crossingDuration,direction,x:0,y:0};state.cyclist=debug;
  function hide(){if(visible){layer.style.visibility='hidden';visible=false;}debug.active=false;}
  function paint(time){if(state.reduced){hide();return;}while(time>=start+crossingDuration){start+=crossingDuration+28+random()*32;direction=random()<.5?1:-1;}debug.start=start;debug.direction=direction;if(!forced&&time<start){hide();return;}
   const progress=forced?.5:(time-start)/crossingDuration,x=crossingX(progress,direction),y=bridgeY(x);if(!visible){layer.style.visibility='visible';visible=true;}const box=crop.getAttribute('viewBox');if(box!==lastCrop){layer.setAttribute('viewBox',box);lastCrop=box;}
   rider.setAttribute('transform',`translate(${x} ${y}) scale(${direction*.43} .43)`);
   const elapsed=forced?crossingDuration*.5:time-start,wheel=elapsed*(560/crossingDuration)/(.43*9)*180/Math.PI,pedal=elapsed*4.5,px=Math.cos(pedal)*5,py=-9+Math.sin(pedal)*5,qx=-px,qy=-18-py;
   rear.setAttribute('transform',`rotate(${wheel} -18 -9)`);front.setAttribute('transform',`rotate(${wheel} 19 -9)`);crank.setAttribute('transform',`rotate(${pedal*180/Math.PI} 0 -9)`);
   near.setAttribute('d',`M-3-29 ${px-7} ${(py-29)*.5} ${px} ${py}`);far.setAttribute('d',`M-3-29 ${qx+7} ${(qy-29)*.5} ${qx} ${qy}`);debug.active=true;debug.x=x;debug.y=y;
  }
  state.cyclistFrame=paint;paint(state.time||0);
 }
}

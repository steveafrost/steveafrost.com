export const flagDuration=23;
export const flagAnchor={x:1393,baseY:303,raisedY:248,width:36,height:24};
export const towerOutline='M1350 309L1357 287 1361 283 1367 298 1383 294 1389 294 1391 278 1395 278 1397 292 1405 295 1410 298 1413 285 1417 285 1421 304V440H1350Z';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return Math.max(0,Math.min(1,t*t*t*(t*(t*6-15)+10)));};
export function flagPose(seconds,out={}){
 const t=Math.max(0,Math.min(flagDuration,seconds));let h=0,speed=0,pole=1;
 if(t<2.4){pole=smooth(t/2.4);out.phase='pole-extend';}else if(t<3)out.phase='pole-settle';
 else if(t<8){const u=(t-3)/5;h=smooth(u);speed=11*30*u*u*(1-u)*(1-u);out.phase='raise';}
 else if(t<15){h=1;out.phase='hold';}else if(t<20){const u=(t-15)/5;h=1-smooth(u);speed=-11*30*u*u*(1-u)*(1-u);out.phase='lower';}
 else if(t<20.6)out.phase='furl';else{pole=1-smooth((t-20.6)/2.4);out.phase='pole-retract';}
 out.height=h;out.y=303-55*h;out.poleTip=303-60*pole;out.width=.14+.86*smooth(h);
 // Closed-form cloth response: gravity sag, velocity drag, travelling wind and damped settling.
 const age=t-8,settle=age>=0?12*age*age*Math.exp(-3*age)*Math.sin(6*age):0,envelope=smooth(h),gust=.55+.2*Math.sin(t*.7);
 out.dy1=envelope*(.6+speed*.03+gust*.4*Math.sin(t*2.4-.65)+settle*.3);
 out.dy2=envelope*(1.2+speed*.06+gust*.8*Math.sin(t*2.4-1.3)+settle*.65);
 out.dy3=envelope*(1.8+speed*.09+gust*1.2*Math.sin(t*2.4-1.95)+settle);
 return out;
}
export function applyFlagPose(refs,p){
 const poleChanged=refs.poleTip!==p.poleTip,hoistChanged=refs.flagY!==p.y,widthChanged=refs.flagWidth!==p.width;
 if(poleChanged){refs.pole.setAttribute('d',`M1393 303V${p.poleTip}`);refs.cap.setAttribute('cy',String(p.poleTip));}
 if(poleChanged||hoistChanged)refs.rope.setAttribute('d',`M1394.8 303V${p.poleTip+1}H1393.6V${p.y}`);
 if(hoistChanged||widthChanged)refs.flag.setAttribute('transform',`translate(1393 ${p.y}) scale(${p.width} 1)`);
 const a=p.dy1/12,b=(p.dy2-p.dy1)/12,c=(p.dy3-p.dy2)/12;
 if(refs.dy1!==p.dy1)refs.panels[0].setAttribute('transform',`matrix(1 ${a} 0 1 0 0)`);
 if(refs.dy1!==p.dy1||refs.dy2!==p.dy2)refs.panels[1].setAttribute('transform',`matrix(1 ${b} 0 1 0 ${p.dy1-b*12})`);
 if(refs.dy2!==p.dy2||refs.dy3!==p.dy3)refs.panels[2].setAttribute('transform',`matrix(1 ${c} 0 1 0 ${p.dy2-c*24})`);
 refs.poleTip=p.poleTip;refs.flagY=p.y;refs.flagWidth=p.width;refs.dy1=p.dy1;refs.dy2=p.dy2;refs.dy3=p.dy3;
}
export const flagMarkup=`<defs><clipPath id="tower-occlusion"><path d="${towerOutline}"/></clipPath><clipPath id="tower-cloth-0"><rect x="0" y="-10" width="12.2" height="44"/></clipPath><clipPath id="tower-cloth-1"><rect x="11.8" y="-10" width="12.4" height="44"/></clipPath><clipPath id="tower-cloth-2"><rect x="23.8" y="-10" width="12.2" height="44"/></clipPath><g id="tower-flag-fabric"><path d="M0 0H36V24H0Z" fill="#28465c"/><path d="M0 0H18L25 10 32 0H50V8H45V32H50V40H30V32H35V16L25 29 15 16V32H20V40H0V32H5V8H0Z" transform="translate(5 2) scale(.52 .5)" fill="#e7bf49"/></g></defs><g data-flag-assembly=""><path data-pole="" d="M1393 303V303" fill="none" stroke="var(--flag-pole,#90785e)" stroke-width="1.1"/><circle data-cap="" cx="1393" cy="303" r="1.3" fill="var(--flag-pole,#90785e)"/><path data-rope="" fill="none" stroke="var(--flag-rope,#b5a286)" stroke-width=".45"/><g data-flag=""><g data-panel="0"><g clip-path="url(#tower-cloth-0)"><use href="#tower-flag-fabric"/></g></g><g data-panel="1"><g clip-path="url(#tower-cloth-1)"><use href="#tower-flag-fabric"/></g></g><g data-panel="2"><g clip-path="url(#tower-cloth-2)"><use href="#tower-flag-fabric"/></g></g></g></g><image data-tower-cover="" width="2172" height="724" clip-path="url(#tower-occlusion)"/>`;
if(typeof document!=='undefined'){
 const scene=document.querySelector('.landscape'),state=window.riverMotion;
 if(scene&&state&&!state.flagFrame){
 const layer=document.createElementNS('http://www.w3.org/2000/svg','svg');layer.classList.add('tower-flag-layer');layer.setAttribute('aria-hidden','true');layer.setAttribute('preserveAspectRatio','none');layer.innerHTML=flagMarkup;layer.style.visibility='hidden';scene.append(layer);
 const refs={flag:layer.querySelector('[data-flag]'),pole:layer.querySelector('[data-pole]'),cap:layer.querySelector('[data-cap]'),rope:layer.querySelector('[data-rope]'),panels:[...layer.querySelectorAll('[data-panel]')]},cover=layer.querySelector('[data-tower-cover]'),photo=scene.querySelector('.river-picture'),crop=scene.querySelector('.lamp-repairs'),params=new URLSearchParams(location.search),forced=params.get('flag')==='raised';let seed=Number(params.get('flag-seed'))||crypto.getRandomValues(new Uint32Array(1))[0];const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let start=10,lastCrop='',lastImage='',on=false,disposed=false,first=true;
 const pose={},debug={active:false,start,end:start+flagDuration,duration:flagDuration,phase:'gap',y:303};state.flag=debug;
 function hide(){if(on){layer.style.visibility='hidden';on=false;}debug.active=false;debug.phase='gap';}
 function paint(time){if(disposed)return;const box=crop.getAttribute('viewBox');if(box!==lastCrop){layer.setAttribute('viewBox',box);lastCrop=box;}if(state.reduced||state.visible===false||document.hidden){hide();return;}while(time>=start+flagDuration){start+=flagDuration+10+random()*8;first=false;}
 if(!forced&&!first&&time>=start&&state.cyclist?.active)start=state.cyclist.start+18+2+random()*2;
 debug.start=start;debug.end=start+flagDuration;if(!forced&&time<start){hide();return;}if(photo.src!==lastImage){cover.setAttribute('href',photo.src);lastImage=photo.src;}const p=flagPose(forced?10:time-start,pose);applyFlagPose(refs,p);if(!on){layer.style.visibility='visible';on=true;}debug.active=true;debug.phase=p.phase;debug.y=p.y;
 }
 state.flagFrame=paint;paint(state.time||0);
 function cleanup(){if(disposed)return;disposed=true;removeEventListener('pagehide',pageHide);document.removeEventListener('astro:before-swap',cleanup);state.flagFrame=null;layer.remove();}function pageHide(event){if(!event.persisted)cleanup();}addEventListener('pagehide',pageHide);document.addEventListener('astro:before-swap',cleanup,{once:true});
 }
}

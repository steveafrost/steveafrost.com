export const flagDuration=16;
export const flagAnchor={x:1393,baseY:285,raisedY:248,width:36,height:24};
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function flagPose(seconds,out={}){const h=seconds<4.5?ease(seconds/4.5):seconds>11.5?ease((flagDuration-seconds)/4.5):1;out.height=h;out.y=285-37*h;out.angle=Math.sin(seconds*2.2)*1.6*h;out.width=1+.04*Math.sin(seconds*1.7);out.phase=seconds<4.5?'raise':seconds<11.5?'hold':'lower';return out;}
// Small native vector flag: collegiate block M, no runtime image/font request.
export const flagMarkup=`<defs><clipPath id="tower-flag-clearance" clipPathUnits="userSpaceOnUse"><rect x="1392" y="220" width="45" height="58"/></clipPath></defs><path d="M1393 280V243" fill="none" stroke="var(--flag-pole,#90785e)" stroke-width="1.1"/><circle cx="1393" cy="243" r="1.3" fill="var(--flag-pole,#90785e)"/><g clip-path="url(#tower-flag-clearance)"><g data-flag=""><path d="M0 0H36V24H0Z" fill="#00274c"/><path d="M0 0H18L25 10 32 0H50V8H45V32H50V40H30V32H35V16L25 29 15 16V32H20V40H0V32H5V8H0Z" transform="translate(5 2) scale(.52 .5)" fill="#ffcb05"/><path d="M0 0V24" stroke="#bfa779" stroke-width=".8"/></g></g>`;
if(typeof document!=='undefined'){
 const scene=document.querySelector('.landscape'),state=window.riverMotion;
 if(scene&&state&&!state.flagFrame){
 const layer=document.createElementNS('http://www.w3.org/2000/svg','svg');layer.classList.add('tower-flag-layer');layer.setAttribute('aria-hidden','true');layer.setAttribute('preserveAspectRatio','none');layer.innerHTML=flagMarkup;scene.append(layer);
 const flag=layer.querySelector('[data-flag]'),crop=scene.querySelector('.lamp-repairs'),params=new URLSearchParams(location.search),forced=params.get('flag')==='raised';let seed=Number(params.get('flag-seed'))||crypto.getRandomValues(new Uint32Array(1))[0];const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let start=42+random()*28,lastCrop='',on=false,disposed=false;
 flag.style.visibility='hidden';
 const pose={},debug={active:false,start,end:start+flagDuration,duration:flagDuration,phase:'gap',y:285};state.flag=debug;
 function hide(){if(on){flag.style.visibility='hidden';on=false;}debug.active=false;debug.phase='gap';}
 function paint(time){if(disposed)return;const box=crop.getAttribute('viewBox');if(box!==lastCrop){layer.setAttribute('viewBox',box);lastCrop=box;}if(state.reduced||state.visible===false||document.hidden){hide();return;}while(time>=start+flagDuration)start+=flagDuration+65+random()*70;
 // Defer a pending raise until the cyclist has finished; never stop a flag mid-cycle.
 if(!forced&&time>=start&&state.cyclist?.active)start=state.cyclist.start+18+10+random()*12;
 debug.start=start;debug.end=start+flagDuration;if(!forced&&time<start){hide();return;}const elapsed=forced?7:time-start,p=flagPose(elapsed,pose);flag.setAttribute('transform',`translate(1393 ${p.y}) rotate(${p.angle}) scale(${p.width} 1)`);if(!on){flag.style.visibility='visible';on=true;}debug.active=true;debug.phase=p.phase;debug.y=p.y;
 }
 state.flagFrame=paint;paint(state.time||0);
 function cleanup(){if(disposed)return;disposed=true;removeEventListener('pagehide',pageHide);document.removeEventListener('astro:before-swap',cleanup);state.flagFrame=null;layer.remove();}function pageHide(event){if(!event.persisted)cleanup();}addEventListener('pagehide',pageHide);document.addEventListener('astro:before-swap',cleanup,{once:true});
 }
}

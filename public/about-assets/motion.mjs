// One visibility-gated frame driver for all About effects. No Pixi ticker.
export function initializeAboutMotion(root, environment = window, loadScene = () => import('./scene-renderer.mjs')) {
  if (!root) return () => {};
  const doc=root.ownerDocument,button=root.querySelector('[data-story-pause]'),host=root.querySelector('[data-about-effects]');
  if(!button||!host||typeof environment.IntersectionObserver!=='function')return()=>{};
  const reduced=environment.matchMedia('(prefers-reduced-motion: reduce)'),desktop=environment.matchMedia('(min-width: 1100px)');
  const zones={bridge:false,desk:false};let paused=false,disposed=false,failed=false,loading=false,scene=null,frame=0,last=null,time=0,pageHidden=false;
  function stop(){if(frame)environment.cancelAnimationFrame(frame);frame=0;last=null;}
  function canRun(){return !disposed&&!failed&&!paused&&!pageHidden&&!doc.hidden&&!reduced.matches&&desktop.matches&&(zones.bridge||zones.desk);}
  function tick(now){frame=0;if(!canRun()||!scene){last=null;return;}if(last===null)last=now;
    const elapsed=(now-last)/1000;
    if(elapsed>=1/30){const dt=Math.min(elapsed,.1);time+=dt;last=now;try{scene.draw(time,dt,zones);}catch{lost();return;}}
    frame=environment.requestAnimationFrame(tick);
  }
  function update(){const running=canRun();root.dataset.motion=running&&scene?'running':'paused';button.disabled=failed||reduced.matches||!desktop.matches;
    button.setAttribute('aria-pressed',String(paused||reduced.matches||!desktop.matches||failed));
    button.textContent=failed?'Motion unavailable':reduced.matches||!desktop.matches?'Motion paused':paused?'Play motion':'Pause motion';
    if(!running){stop();if(scene)scene.canvas.style.visibility=desktop.matches?'visible':'hidden';return;}
    if(scene){scene.canvas.style.visibility='visible';if(!frame)frame=environment.requestAnimationFrame(tick);return;}
    if(!loading){loading=true;loadScene().then(module=>disposed?null:module.createAboutScene(host)).then(result=>{
      loading=false;if(disposed){result?.destroy();return;}scene=result;if(scene){scene.canvas.addEventListener('webglcontextlost',lost);scene.draw(time,0,zones);}update();
    }).catch(()=>{loading=false;failed=true;update();});}
  }
  function lost(){failed=true;update();if(scene)scene.canvas.style.visibility='hidden';}
  function toggle(){paused=!paused;update();}
  const observer=new environment.IntersectionObserver(entries=>{for(const entry of entries){const key=entry.target.dataset.motionZone;if(key in zones)zones[key]=entry.isIntersecting;}update();},{threshold:.1});
  for(const zone of root.querySelectorAll('[data-motion-zone]'))observer.observe(zone);
  button.addEventListener('click',toggle);doc.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);desktop.addEventListener('change',update);
  function hide(event){if(event.persisted){pageHidden=true;update();}else cleanup();}
  function show(){pageHidden=false;update();}
  function cleanup(){if(disposed)return;disposed=true;stop();observer.disconnect();button.removeEventListener('click',toggle);doc.removeEventListener('visibilitychange',update);doc.removeEventListener('astro:before-swap',cleanup);reduced.removeEventListener('change',update);desktop.removeEventListener('change',update);environment.removeEventListener('pagehide',hide);environment.removeEventListener('pageshow',show);if(scene){scene.canvas.removeEventListener('webglcontextlost',lost);scene.destroy();}root.dataset.motion='paused';}
  environment.addEventListener('pagehide',hide);environment.addEventListener('pageshow',show);doc.addEventListener('astro:before-swap',cleanup,{once:true});update();return cleanup;
}
if(typeof window!=='undefined')initializeAboutMotion(document.querySelector('[data-about-story]'));

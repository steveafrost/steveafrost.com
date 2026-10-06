/* Motion deforms only the supplied raster river; it never redraws illustration art. */
(()=>{'use strict';
const scene=document.querySelector('.landscape');if(!scene)return;
const canvas=scene.querySelector('canvas'),photo=scene.querySelector('.river-picture'),toggle=scene.querySelector('.motion-toggle'),status=scene.querySelector('[data-motion-status]'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=false,visible=true,raf=0,clock=0,last=0,ready=false,gl=null,program=null,texture=null,maskTexture=null;const mask=new Image();mask.src="/river-assets/river-precise-mask.png";
const state={frames:0,running:false,reduced:reduced.matches,ready:false,visible:true};window.riverMotion=state;
function sync(){const blocked=reduced.matches;toggle.disabled=blocked;const label=blocked?'Motion off':paused?'Resume motion':'Pause motion';toggle.setAttribute('aria-label',label);toggle.title=label;toggle.dataset.paused=String(paused||blocked);toggle.setAttribute('aria-pressed',String(paused));state.reduced=blocked;state.visible=visible;state.running=!paused&&!blocked&&!document.hidden&&visible;}
function crop(){const w=scene.clientWidth,h=scene.clientHeight,ir=photo.naturalWidth/photo.naturalHeight,ratio=w/h,fitX=Math.min(1,ratio/ir),fitY=Math.min(1,ir/ratio),parts=getComputedStyle(photo).objectPosition.split(' '),fx=parseFloat(parts[0])/100,fy=parseFloat(parts[1])/100;scene.querySelector('.lamp-repairs').setAttribute('viewBox',[fx*(1-fitX)*2172,fy*(1-fitY)*724,fitX*2172,fitY*724].join(' '));const sun=scene.querySelector('.theme-sun');sun.style.left=((.7235267-fx*(1-fitX))/fitX*100)+'%';sun.style.top=((.3287293-fy*(1-fitY))/fitY*100)+'%';sun.style.width=(.0796501/fitX*100)+'%';for(const lamp of scene.querySelectorAll('.bridge-lamps svg')){const height=Number(lamp.dataset.height)/724;lamp.style.left=((Number(lamp.dataset.x)-fx*(1-fitX))/fitX*100)+'%';lamp.style.top=((Number(lamp.dataset.y)-height*.18-fy*(1-fitY))/fitY*100)+'%';lamp.style.height=(height/fitY*100)+'%';}}
function render(){state.frames++;state.time=clock;crop();if(state.visitorFrame)state.visitorFrame(clock);if(ready){const w=canvas.clientWidth,h=canvas.clientHeight,d=Math.min(devicePixelRatio,2);if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);gl.viewport(0,0,canvas.width,canvas.height);}gl.uniform1f(gl.getUniformLocation(program,'time'),clock);gl.uniform1f(gl.getUniformLocation(program,'daylight'),document.documentElement.dataset.theme==='night'?0:1);gl.uniform2f(gl.getUniformLocation(program,'size'),w,h);gl.uniform2f(gl.getUniformLocation(program,'imageSize'),photo.naturalWidth,photo.naturalHeight);const position=getComputedStyle(photo).objectPosition.split(' ');gl.uniform2f(gl.getUniformLocation(program,'focus'),parseFloat(position[0])/100||.5,parseFloat(position[1])/100||.5);gl.drawArrays(gl.TRIANGLES,0,6);}
}
function frame(now){raf=0;sync();if(!state.running)return;clock+=Math.min(last?(now-last)/1000:0,.05);last=now;render();raf=requestAnimationFrame(frame);}
function stop(){cancelAnimationFrame(raf);raf=0;last=0;state.running=false;}
function start(){sync();if(state.running&&!raf)raf=requestAnimationFrame(frame);}
// Explicit opt-in deterministic capture hook for remote motion QA.
if(new URLSearchParams(location.search).get('river-debug')==='1'){state.seek=(seconds)=>{if(!Number.isFinite(seconds)||seconds<0)throw new RangeError('Use non-negative finite seconds');stop();paused=true;clock=reduced.matches?0:seconds;render();sync();return {time:clock,ready,paused};};state.reflectionBounds={sourcePixelsX:10,sourcePixelsY:4.8};}
toggle.addEventListener('click',()=>{paused=!paused;if(paused)stop();else start();sync();status.textContent=paused?'River motion paused.':'River motion resumed.';});
document.addEventListener('river-artwork-changing',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});reduced.addEventListener('change',()=>{stop();if(reduced.matches){clock=0;render();}sync();start();});
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('River shader unavailable');return s;}
function init(){try{gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true});if(!gl)throw new Error('No WebGL');program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5; gl_Position=vec4(position,0.,1.);}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision highp float; varying vec2 uv; uniform sampler2D image; uniform sampler2D lineMask; uniform float time; uniform vec2 size; uniform vec2 imageSize; uniform vec2 focus; uniform float daylight;
float sunHighlight(vec2 p,vec4 c){float region=smoothstep(.74,.755,p.x)*(1.-smoothstep(.83,.86,p.x))*smoothstep(.72,.76,p.y);float gold=smoothstep(.15,.23,c.r-c.b)*smoothstep(.68,.8,c.r)*smoothstep(.62,.72,c.g);return daylight*region*gold*texture2D(lineMask,p).b;}
vec4 sceneColor(vec2 p){vec4 base=texture2D(image,p);float oldHighlight=sunHighlight(p,base);vec4 waterFill=texture2D(image,p-vec2(.09,0.));vec4 clean=mix(base,waterFill,oldHighlight);vec2 sunSource=p+vec2(130./imageSize.x,0.);vec4 highlight=texture2D(image,sunSource);return mix(clean,highlight,sunHighlight(sunSource,highlight));}
void main(){vec2 p=vec2(uv.x,1.-uv.y);float ratio=size.x/size.y;float ir=imageSize.x/imageSize.y;vec2 fit=vec2(1.);if(ratio>ir)fit.y=ir/ratio;else fit.x=ratio/ir;p=(p-.5)*fit+focus*(1.-fit)+fit*.5;vec4 original=sceneColor(p);
// Blue follows the left foreground silhouette; green retains the original coarse mask.
float water=texture2D(lineMask,p).b;
// Advect the ripple phase, never the reflected artwork. Source samples stay
// within 10px horizontally / 3.375px vertically of their original position.
float ripplePhase=p.x*90.+p.y*140.;
float ripple=sin(ripplePhase-time*.55)-sin(ripplePhase);
vec2 displacement=ripple*vec2(5./imageSize.x,1.6875/imageSize.y);
vec2 samplePoint=p+displacement;
float safeWater=texture2D(lineMask,samplePoint).b;
vec4 color=mix(original,sceneColor(samplePoint),water*safeWater);
// A narrow sampling corridor includes the antialiased edges of each painted line.
float corridor=texture2D(lineMask,p).r;
float offset=(sin(p.x*17.-time*.55)-sin(p.x*17.))*2.4/imageSize.y;
color=mix(color,sceneColor(p+vec2(0.,offset)),corridor);
// A separate surface-light field flows downstream; it never translates
// the scene texture. Three-source-pixel cells keep the illustrated texture.
vec2 surface=floor(p*imageSize/3.)*3.;
vec2 downstream=normalize(vec2(160.,54.));
float along=dot(surface,downstream),across=dot(surface,vec2(-downstream.y,downstream.x));
float perspective=smoothstep(.63,1.,p.y);
float crestShape=across*.22+sin(along*.018)*1.2;
float crest=pow(max(0.,sin(crestShape)),10.);
float packet=pow(max(0.,sin(along*.065-time*2.8)),2.);
float restingPacket=pow(max(0.,sin(along*.065)),2.);
float currentLight=crest*(packet-restingPacket)*mix(.025,.13,perspective)*water;
vec3 surfaceTint=mix(vec3(.30,.55,.65),vec3(.85,.95,.83),daylight);
color.rgb=clamp(color.rgb+surfaceTint*currentLight,0.,1.);
gl_FragColor=time==0.?original:color;}`));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('River link unavailable');gl.useProgram(program);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photo);gl.uniform1i(gl.getUniformLocation(program,'image'),0);gl.activeTexture(gl.TEXTURE1);maskTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,maskTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,mask);gl.uniform1i(gl.getUniformLocation(program,'lineMask'),1);ready=state.ready=true;render();canvas.classList.add('ready');}catch(e){ready=false;canvas.classList.remove('ready');state.ready=false;}sync();start();}
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;state.ready=false;canvas.classList.remove('ready');});canvas.addEventListener('webglcontextrestored',init);addEventListener('resize',()=>{if(!state.running)render();});
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;state.visible=visible;if(visible)start();else stop();},{threshold:0});observer.observe(scene);
photo.addEventListener('load',()=>{if(!mask.complete||!mask.naturalWidth)return;stop();ready=false;canvas.classList.remove('ready');if(gl){gl.deleteTexture(texture);gl.deleteTexture(maskTexture);gl.deleteProgram(program);}init();});
mask.addEventListener('load',()=>{if(photo.complete&&photo.naturalWidth)init();},{once:true});if(mask.complete&&mask.naturalWidth&&photo.complete&&photo.naturalWidth)init();sync();
})();

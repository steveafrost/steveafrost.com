/* Browser optical material using the existing illustration; not Apple's native API. */
(() => {
  const header = document.querySelector('.river-home .editorial-header');
  const canvas = header?.querySelector('.glass-optics');
  const picture = document.querySelector('.river-picture');
  if (!header || !canvas || !picture) return;
  const reduceTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const increaseContrast = matchMedia('(prefers-contrast: more)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {alpha:false, antialias:false, preserveDrawingBuffer:true});
  if (!gl) return;
  const vertex = 'attribute vec2 a; varying vec2 v; void main(){v=(a+1.0)*0.5;gl_Position=vec4(a,0.0,1.0);}';
  const fragment = `precision highp float;
    varying vec2 v;
    uniform sampler2D scene;
    uniform vec4 crop;
    uniform vec2 size;
    uniform vec2 light;
    uniform float radius;
    uniform float night;
    vec3 linearize(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
    vec3 encode(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-.055,step(vec3(.0031308),c));}
    vec3 sampleScene(vec2 p){return texture2D(scene,clamp(crop.xy+p*crop.zw,vec2(0.0),vec2(1.0))).rgb;}
    void main(){
      vec2 p=vec2(v.x,1.0-v.y);
      vec2 center=(p-.5)*size;
      vec2 d=abs(center)-(size*.5-vec2(radius));
      float sdf=length(max(d,0.0))+min(max(d.x,d.y),0.0)-radius;
      float edge=max(-sdf,0.0);
      vec2 direction;
      if(max(d.x,d.y)>0.0){direction=normalize(max(d,0.0)*sign(center));}
      else{direction=d.x>d.y?vec2(sign(center.x),0.0):vec2(0.0,sign(center.y));}
      float lens=5.5*exp(-edge/10.0);
      vec2 q=p+direction*lens/size;
      vec3 c=sampleScene(q);
      float gray=dot(c,vec3(.2126,.7152,.0722));
      c=mix(vec3(gray),c,1.16);
      vec3 tint=mix(vec3(.969,.957,.922),vec3(.063,.133,.176),night);
      c=mix(c,tint,mix(.16,.20,night));
      float rim=exp(-edge/1.2);
      float softRim=exp(-edge/6.0);
      float side=.5+.5*dot(direction,normalize(light-.5+vec2(.001)));
      c+=vec3(.20*rim*side+.035*softRim);
      c-=vec3(.065*rim*(1.0-side));
      c=clamp(c,0.0,1.0);
      vec3 rgb=linearize(c);
      float lum=dot(rgb,vec3(.2126,.7152,.0722));
      if(night<.5 && lum<.26){vec3 white=linearize(vec3(.969,.957,.922));float wl=dot(white,vec3(.2126,.7152,.0722));rgb=mix(rgb,white,(.26-lum)/(wl-lum));}
      if(night>.5 && lum>.13)rgb*=.13/lum;
      gl_FragColor=vec4(encode(rgb),1.0);
    }`;
  // Match the previous kernel's per-axis variance: .48 * 5² = 12 source pixels².
  const sigma = Math.sqrt(12), extent = Math.ceil(3*sigma);
  const weights = Array.from({length:extent+1}, (_,i) => Math.exp(-i*i/(2*sigma*sigma)));
  const normalization = weights[0]+2*weights.slice(1).reduce((sum,w)=>sum+w,0);
  const gaussian = `precision highp float; varying vec2 v; uniform sampler2D scene; uniform vec2 stepSize;
    void main(){vec3 c=texture2D(scene,v).rgb*${(weights[0]/normalization).toFixed(10)};
    ${weights.slice(1).map((w,i)=>`c+=(texture2D(scene,v+stepSize*${(i+1).toFixed(1)}).rgb+texture2D(scene,v-stepSize*${(i+1).toFixed(1)}).rgb)*${(w/normalization).toFixed(10)};`).join('\n')}
    gl_FragColor=vec4(c,1.0);}`;
  function makeProgram(source){
    const program=gl.createProgram();
    for(const [type,code] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,source]]){
      const shader=gl.createShader(type);gl.shaderSource(shader,code);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Glass shader unavailable');
      gl.attachShader(program,shader);gl.deleteShader(shader);
    }
    gl.bindAttribLocation(program,0,'a');gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Glass program unavailable');
    return program;
  }
  let program,filter;
  try{program=makeProgram(fragment);filter=makeProgram(gaussian);}catch{return;}
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.activeTexture(gl.TEXTURE0);gl.disable(gl.DITHER);
  const uniforms=Object.fromEntries(['crop','size','light','radius','night'].map(name=>[name,gl.getUniformLocation(program,name)]));
  const filterStep=gl.getUniformLocation(filter,'stepSize');
  const textures=new Map(),failed=new Set();
  function texture(){
    const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;
  }
  function prefilter(){
    const key=picture.currentSrc;if(textures.has(key))return textures.get(key);if(failed.has(key))throw Error('Glass texture unavailable');
    const width=picture.naturalWidth,height=picture.naturalHeight;
    if(Math.max(width,height)>gl.getParameter(gl.MAX_TEXTURE_SIZE)){failed.add(key);throw Error('Glass texture too large');}
    const start=performance.now(),framebuffer=gl.createFramebuffer(),source=texture(),horizontal=texture(),output=texture();
    try{
      gl.bindTexture(gl.TEXTURE_2D,source);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,picture);
      for(const target of [horizontal,output]){gl.bindTexture(gl.TEXTURE_2D,target);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);}
      gl.useProgram(filter);gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.viewport(0,0,width,height);
      for(const [input,target,x,y] of [[source,horizontal,1/width,0],[horizontal,output,0,1/height]]){
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,target,0);
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Glass filter unavailable');
        gl.bindTexture(gl.TEXTURE_2D,input);gl.uniform2f(filterStep,x,y);gl.drawArrays(gl.TRIANGLES,0,6);
      }
      if(gl.getError()!==gl.NO_ERROR)throw Error('Glass filter failed');
      textures.set(key,output);
      while(textures.size>2){const oldest=textures.keys().next().value;gl.deleteTexture(textures.get(oldest));textures.delete(oldest);}
      performance.measure('river-glass-prefilter',{start,end:performance.now(),detail:{width,height}});
      return output;
    }catch(error){gl.deleteTexture(output);failed.add(key);throw error;}
    finally{gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.deleteFramebuffer(framebuffer);gl.deleteTexture(source);gl.deleteTexture(horizontal);}
  }
  let frame=0,pointer=[.2,.05],lost=false;
  function render(){
    frame=0;
    if(lost||reduceTransparency.matches||forcedColors.matches||increaseContrast.matches){header.classList.remove('glass-ready');return;}
    if(!picture.complete||!picture.naturalWidth)return;
    let scene;try{scene=prefilter();}catch{header.classList.remove('glass-ready');return;}
    const h=canvas.getBoundingClientRect(),r=picture.getBoundingClientRect();
    const scale=Math.max(r.width/picture.naturalWidth,r.height/picture.naturalHeight);
    const pos=getComputedStyle(picture).objectPosition.split(' ').map(x=>parseFloat(x)/100);
    const ox=(r.width-picture.naturalWidth*scale)*(Number.isFinite(pos[0])?pos[0]:.5);
    const oy=(r.height-picture.naturalHeight*scale)*(Number.isFinite(pos[1])?pos[1]:.5);
    const dpr=Math.min(devicePixelRatio,3);
    const width=Math.round(h.width*dpr),height=Math.round(h.height*dpr);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    gl.useProgram(program);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,width,height);gl.bindTexture(gl.TEXTURE_2D,scene);
    gl.uniform4f(uniforms.crop,(h.left-r.left-ox)/scale/picture.naturalWidth,(h.top-r.top-oy)/scale/picture.naturalHeight,h.width/scale/picture.naturalWidth,h.height/scale/picture.naturalHeight);
    gl.uniform2f(uniforms.size,h.width,h.height);gl.uniform2f(uniforms.light,...pointer);
    gl.uniform1f(uniforms.radius,Math.min(parseFloat(getComputedStyle(header).borderTopLeftRadius)||28,h.width/2,h.height/2));
    gl.uniform1f(uniforms.night,document.documentElement.dataset.theme==='night'?1:0);
    gl.drawArrays(gl.TRIANGLES,0,6);header.classList.add('glass-ready');
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  picture.addEventListener('load',schedule);new ResizeObserver(schedule).observe(header);new ResizeObserver(schedule).observe(picture);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  for(const preference of [reduceTransparency,forcedColors,increaseContrast])preference.addEventListener('change',schedule);
  header.addEventListener('pointermove',event=>{if(reduceMotion.matches)return;const r=header.getBoundingClientRect();pointer=[(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height];schedule();});
  header.addEventListener('pointerleave',()=>{pointer=[.2,.05];schedule();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;header.classList.remove('glass-ready');textures.clear();});
  schedule();
})();

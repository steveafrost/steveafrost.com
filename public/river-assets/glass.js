/* Web-only optical approximation using the existing scene, not Apple's native API. */
(() => {
  const header = document.querySelector('.river-home .editorial-header');
  const canvas = header?.querySelector('.glass-optics');
  const picture = document.querySelector('.river-picture');
  if (!header || !canvas || !picture) return;
  const reduceTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {alpha:false, antialias:false, preserveDrawingBuffer:true});
  if (!gl) return;
  const vertex = 'attribute vec2 a; varying vec2 v; void main(){v=(a+1.0)*0.5;gl_Position=vec4(a,0.0,1.0);}';
  const fragment = `precision highp float;
    varying vec2 v;
    uniform sampler2D scene;
    uniform vec4 crop;
    uniform vec2 size;
    uniform vec2 texel;
    uniform vec2 light;
    uniform float night;
    vec3 linearize(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
    vec3 encode(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-.055,step(vec3(.0031308),c));}
    vec3 sampleScene(vec2 p){return texture2D(scene,clamp(crop.xy+p*crop.zw,vec2(0.0),vec2(1.0))).rgb;}
    void main(){
      vec2 p=vec2(v.x,1.0-v.y);
      vec2 px=p*size;
      float edge=min(min(px.x,size.x-px.x),min(px.y,size.y-px.y));
      vec2 direction=normalize(p-.5+vec2(.0001));
      float lens=5.5*exp(-edge/10.0);
      vec2 q=.5+(p-.5)*.992+direction*lens/size;
      vec2 b=texel*5.0/crop.zw;
      vec3 c=sampleScene(q)*.28;
      c+=(sampleScene(q+b*vec2(1,0))+sampleScene(q+b*vec2(-1,0))+sampleScene(q+b*vec2(0,1))+sampleScene(q+b*vec2(0,-1)))*.12;
      c+=(sampleScene(q+b)+sampleScene(q-b)+sampleScene(q+b*vec2(1,-1))+sampleScene(q+b*vec2(-1,1)))*.06;
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
  const compile = (type, source) => {const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Glass shader unavailable');return shader;};
  let program;
  try {program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;} catch {return;}
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const attr=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const uniforms=Object.fromEntries(['crop','size','texel','light','night'].map(name=>[name,gl.getUniformLocation(program,name)]));
  let frame=0, loaded='', pointer=[.2,.05], lost=false;
  function render(){
    frame=0;
    if(lost || reduceTransparency.matches || forcedColors.matches){header.classList.remove('glass-ready');return;}
    if(!picture.complete || !picture.naturalWidth)return;
    const h=header.getBoundingClientRect(),r=picture.getBoundingClientRect();
    const scale=Math.max(r.width/picture.naturalWidth,r.height/picture.naturalHeight);
    const pos=getComputedStyle(picture).objectPosition.split(' ').map(x=>parseFloat(x)/100);
    const ox=(r.width-picture.naturalWidth*scale)*(Number.isFinite(pos[0])?pos[0]:.5);
    const oy=(r.height-picture.naturalHeight*scale)*(Number.isFinite(pos[1])?pos[1]:.5);
    const dpr=Math.min(devicePixelRatio,2);
    canvas.width=Math.round(h.width*dpr);canvas.height=Math.round(h.height*dpr);gl.viewport(0,0,canvas.width,canvas.height);
    try {if(loaded!==picture.currentSrc){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,picture);loaded=picture.currentSrc;}}catch{header.classList.remove('glass-ready');return;}
    gl.uniform4f(uniforms.crop,(h.left-r.left-ox)/scale/picture.naturalWidth,(h.top-r.top-oy)/scale/picture.naturalHeight,h.width/scale/picture.naturalWidth,h.height/scale/picture.naturalHeight);
    gl.uniform2f(uniforms.size,h.width,h.height);gl.uniform2f(uniforms.texel,1/picture.naturalWidth,1/picture.naturalHeight);gl.uniform2f(uniforms.light,...pointer);gl.uniform1f(uniforms.night,document.documentElement.dataset.theme==='night'?1:0);
    gl.drawArrays(gl.TRIANGLES,0,6);header.classList.add('glass-ready');
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  picture.addEventListener('load',schedule);new ResizeObserver(schedule).observe(header);new ResizeObserver(schedule).observe(picture);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  reduceTransparency.addEventListener('change',schedule);forcedColors.addEventListener('change',schedule);
  header.addEventListener('pointermove',event=>{if(reduceMotion.matches)return;const r=header.getBoundingClientRect();pointer=[(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height];schedule();});
  header.addEventListener('pointerleave',()=>{pointer=[.2,.05];schedule();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;header.classList.remove('glass-ready');});
  schedule();
})();

/* Progressive web lens. Native Liquid Glass is not exposed to websites.
 * SVG backdrop filtering reads live compositor pixels; no DOM capture or WebGL.
 * Only the tested Chromium path gets distortion; other engines keep CSS glass.
 */
(() => {
  const header = document.querySelector('.river-home .editorial-header');
  if (!header) return;
  const preferences = ['(prefers-reduced-motion: reduce)', '(prefers-reduced-transparency: reduce)', '(prefers-contrast: more)', '(forced-colors: active)'].map(query => matchMedia(query));
  const chromium = /Chrome\//.test(navigator.userAgent) && !/EdgA|OPR|SamsungBrowser/.test(navigator.userAgent);
  if (!chromium || !CSS.supports('backdrop-filter', 'url("#river-backdrop-lens")')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const node = (name, attributes) => {
    const element = document.createElementNS(ns, name);
    for (const [key,value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  };
  const svg = node('svg', {width:'0',height:'0','aria-hidden':'true',focusable:'false'});
  svg.style.cssText = 'position:absolute;pointer-events:none';
  const defs = node('defs', {});
  const filter = node('filter', {id:'river-backdrop-lens',x:'0',y:'0',width:'100%',height:'100%',primitiveUnits:'userSpaceOnUse','color-interpolation-filters':'sRGB'});
  // Percentages here resolve against the zero-sized definition SVG, not the
  // CSS backdrop. Set actual CSS-pixel dimensions before activating the lens.
  const image = node('feImage', {result:'edge-map',preserveAspectRatio:'none',x:'0',y:'0','color-interpolation-filters':'sRGB'});
  const centerMap = node('feComponentTransfer', {in:'edge-map',result:'centered-edge-map','color-interpolation-filters':'sRGB'});
  // PNG channel128 is128/255, not0.5. Remove that half-byte bias explicitly.
  for (const channel of ['feFuncR','feFuncG']) centerMap.append(node(channel, {type:'linear',slope:'1',intercept:String(-1/510)}));
  filter.append(image, centerMap, node('feDisplacementMap', {in:'SourceGraphic',in2:'centered-edge-map',scale:'16',xChannelSelector:'R',yChannelSelector:'G','color-interpolation-filters':'sRGB'}));
  defs.append(filter);svg.append(defs);document.body.append(svg);
  let generation = 0, size = '';
  function rebuild() {
    header.classList.remove('lens-ready');
    if (preferences.some(preference => preference.matches)) return;
    const surface = getComputedStyle(header,'::before');
    const cssWidth = parseFloat(surface.width), cssHeight = parseFloat(surface.height);
    const width = Math.ceil(cssWidth), height = Math.ceil(cssHeight);
    if (!width || !height || width > 2400 || height > 180) return;
    image.setAttribute('width', String(cssWidth));
    image.setAttribute('height', String(cssHeight));
    const key = `${cssWidth}:${cssHeight}`;
    if (key === size) {header.classList.add('lens-ready');return;}
    const token = ++generation;
    try {
      const start = performance.now();
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return;
      const map = context.createImageData(width,height), radius = Math.min(28,height/2);
      for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
        const cx=x+.5-width/2, cy=y+.5-height/2;
        const dx=Math.abs(cx)-(width/2-radius), dy=Math.abs(cy)-(height/2-radius);
        const ax=Math.max(dx,0), ay=Math.max(dy,0);
        const distance=Math.hypot(ax,ay)+Math.min(Math.max(dx,dy),0)-radius;
        const edge=Math.max(-distance,0);
        let nx=0,ny=0;
        if (Math.max(dx,dy)>0) {const length=Math.hypot(ax,ay)||1;nx=ax*Math.sign(cx)/length;ny=ay*Math.sign(cy)/length;}
        else if (dx>dy) nx=Math.sign(cx); else ny=Math.sign(cy);
        // Compact symmetric rim: exact neutral everywhere12px inside the edge.
        // A smooth cutoff avoids translating the panel's central backdrop.
        const t=Math.max(0,1-edge/12), bend=5.5*t*t*(3-2*t), i=(y*width+x)*4;
        map.data[i]=128-Math.round(nx*bend*255/16);
        map.data[i+1]=128-Math.round(ny*bend*255/16);
        map.data[i+2]=128;map.data[i+3]=255;
      }
      context.putImageData(map,0,0);
      const url=canvas.toDataURL('image/png'), probe=new Image();
      performance.measure('river-backdrop-map', {start,end:performance.now(),detail:{width,height}});
      probe.onload=() => {
        if (token !== generation || preferences.some(preference=>preference.matches)) return;
        image.setAttribute('href',url);
        image.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',url);size=key;
        // Keep the tint and fallback visible while the map enters the compositor.
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          if (token===generation && !preferences.some(preference=>preference.matches)) header.classList.add('lens-ready');
        }));
      };
      probe.onerror=()=>header.classList.remove('lens-ready');probe.src=url;
    } catch {header.classList.remove('lens-ready');}
  }
  const observer=new ResizeObserver(rebuild);observer.observe(header);
  for (const preference of preferences) preference.addEventListener('change',()=>{generation++;rebuild();});
  addEventListener('pagehide',()=>{generation++;header.classList.remove('lens-ready');});
  addEventListener('pageshow',rebuild);
})();

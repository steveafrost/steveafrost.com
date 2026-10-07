import{WebGLRenderer,Container,Graphics,GraphicsContext}from'./vendor/pixi-8.22.0-animals.mjs';
export async function createAnimalLayer(scene,overlay,templates,configs){
 const renderer=new WebGLRenderer();let stage=null,disposed=false;const contexts=new Set(),animals={},tinted=[],renderOptions={container:null,clear:true};
 try{
 await renderer.init({width:300,height:145,resolution:1,antialias:false,backgroundAlpha:0,skipExtensionImports:true,gcActive:false,powerPreference:'low-power'});
 const canvas=renderer.canvas;canvas.className='pixi-bank-animals';canvas.setAttribute('aria-hidden','true');scene.insertBefore(canvas,overlay);stage=new Container();stage.position.set(-440,-440);stage.eventMode='none';stage.interactiveChildren=false;renderOptions.container=stage;
 const serialize=new XMLSerializer();
 function convert(element,refs){let object;if(element.tagName.toLowerCase()==='g'){object=new Container();for(const child of element.children)object.addChild(convert(child,refs));}else{const shape=element.cloneNode(true);shape.removeAttribute('opacity');object=new Graphics().svg('<svg xmlns="http://www.w3.org/2000/svg">'+serialize.serializeToString(shape)+'</svg>');contexts.add(object.context);const hex=element.getAttribute('fill')==='none'?element.getAttribute('stroke'):element.getAttribute('fill');if(/^#[0-9a-f]{6}$/i.test(hex||'')){const rgb=parseInt(hex.slice(1),16),r=rgb>>16,g=(rgb>>8)&255,b=rgb&255,luma=.213*r+.715*g+.072*b;const ratio=v=>Math.round(Math.min(1,v?(.65*(.65*v+.35*luma)/v):0)*255);tinted.push([object,(ratio(r)<<16)|(ratio(g)<<8)|ratio(b)]);}}object.eventMode='none';object.alpha=Number(element.getAttribute('opacity')||1);if(element.hasAttribute('data-body'))refs.body=object;if(element.hasAttribute('data-head'))refs.head=object;if(element.hasAttribute('data-neck'))refs.neck=object;if(element.hasAttribute('data-leg'))refs[element.getAttribute('data-leg')]=object;if(element.tagName.toLowerCase()==='ellipse')refs.shadow=object;return object;}
 for(const name of Object.keys(templates)){
 const refs={},root=convert(templates[name],refs);stage.addChild(root);root.visible=false;const c=configs[name],anchors={deer:[26,-43,17,-25],fox:[25,-20,17,-18],rabbit:[15,-20,10,-18]}[name],color={deer:0xa97849,fox:0xb87540,rabbit:0xaaa28b}[name],neckFrames=[];
 // Bake 33 tiny neck quads once; swap contexts, never rebuild geometry per frame.
 for(let i=0;i<=32;i++){const h=i/32,a=h*c.head[2]*Math.PI/180,dx=anchors[0]-c.head[0],dy=anchors[1]-c.head[1],nx=c.head[0]+dx*Math.cos(a)-dy*Math.sin(a),ny=c.head[1]+dx*Math.sin(a)+dy*Math.cos(a)+h*c.head[3];const context=new GraphicsContext().poly([anchors[2]-5,anchors[3],anchors[2]+5,anchors[3]+3,nx+5,ny+3,nx-5,ny-3]).fill(color);contexts.add(context);neckFrames.push(context);}
 animals[name]={root,...refs,neckFrames};
 }
 let active='',lastBox='',lastTheme='',on=false,frames=0,crop=[0,0,2172,724];
 function hide(){if(on){canvas.style.visibility='hidden';on=false;}}
 function draw(name,p,box,night){if(disposed)return;if(box!==lastBox)crop=box.split(' ').map(Number);if(crop[0]>=740||crop[0]+crop[2]<=440){hide();return;}
 if(box!==lastBox){canvas.style.left=((440-crop[0])/crop[2]*100)+'%';canvas.style.top=((440-crop[1])/crop[3]*100)+'%';canvas.style.width=(300/crop[2]*100)+'%';canvas.style.height=(145/crop[3]*100)+'%';lastBox=box;}
 if(night!==lastTheme){for(const [object,tint] of tinted)object.tint=night?tint:0xffffff;lastTheme=night;}
 if(active!==name){if(active)animals[active].root.visible=false;active=name;animals[name].root.visible=true;}const a=animals[name],c=configs[name];a.root.position.set(p.x,p.y);a.root.scale.set(p.facing*p.scale,p.scale);a.body.position.y=-p.hop-p.bob;a.body.scale.y=p.squash;a.head.pivot.set(c.head[0],c.head[1]);a.head.position.set(c.head[0],c.head[1]+p.head*c.head[3]);a.head.rotation=p.head*c.head[2]*Math.PI/180;a.neck.context=a.neckFrames[Math.round(p.head*32)];a.neck.alpha=p.head;
 a.front.pivot.set(17,-17);a.front.position.set(17,-17);a.front.rotation=p.gait*Math.PI/180;a.back.pivot.set(-18,-17);a.back.position.set(-18,-17);a.back.rotation=-p.gait*Math.PI/180;a.shadow.alpha=.18/(1+p.hop*.08);renderer.render(renderOptions);frames++;if(!on){canvas.style.visibility='visible';on=true;}
 }
 function destroy(){if(disposed)return;disposed=true;hide();canvas.remove();stage.destroy({children:true});for(const c of contexts)if(!c.destroyed)c.destroy();renderer.destroy({removeView:true,releaseGlobalResources:true});}
 return{draw,hide,destroy,get frames(){return frames;},backend:'pixi-webgl',pixels:300*145};
 }catch(error){if(stage)stage.destroy({children:true});for(const c of contexts)if(!c.destroyed)c.destroy();try{renderer.destroy({removeView:true,releaseGlobalResources:true});}catch{}throw error;}
}

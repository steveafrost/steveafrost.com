import{animalPatch}from'./animal-routes.mjs';
import{articulationAt}from'./animal-articulation.mjs';
import{WebGLRenderer,Container,Graphics,GraphicsContext}from'./vendor/pixi-8.22.0-animals.mjs';
export async function createAnimalLayer(scene,overlay,templates,configs){
 const renderer=new WebGLRenderer();let stage=null,disposed=false;const contexts=new Set(),animals={},tinted=[],renderOptions={container:null,clear:true};
 try{
 await renderer.init({width:animalPatch.width,height:animalPatch.height,resolution:1,antialias:false,backgroundAlpha:0,skipExtensionImports:true,gcActive:false,powerPreference:'low-power'});
 const canvas=renderer.canvas;canvas.className='pixi-bank-animals';canvas.setAttribute('aria-hidden','true');scene.insertBefore(canvas,overlay);stage=new Container();stage.position.set(-animalPatch.x,-animalPatch.y);stage.eventMode='none';stage.interactiveChildren=false;renderOptions.container=stage;
 const serialize=new XMLSerializer();
 function convert(element,refs){let object;if(element.tagName.toLowerCase()==='g'){object=new Container();for(const child of element.children)object.addChild(convert(child,refs));}else{const shape=element.cloneNode(true);shape.removeAttribute('opacity');object=new Graphics().svg('<svg xmlns="http://www.w3.org/2000/svg">'+serialize.serializeToString(shape)+'</svg>');contexts.add(object.context);const hex=element.getAttribute('fill')==='none'?element.getAttribute('stroke'):element.getAttribute('fill');if(/^#[0-9a-f]{6}$/i.test(hex||'')){const rgb=parseInt(hex.slice(1),16),r=rgb>>16,g=(rgb>>8)&255,b=rgb&255,luma=.213*r+.715*g+.072*b;const ratio=v=>Math.round(Math.min(1,v?(.65*(.65*v+.35*luma)/v):0)*255);tinted.push([object,(ratio(r)<<16)|(ratio(g)<<8)|ratio(b)]);}}object.eventMode='none';object.alpha=Number(element.getAttribute('opacity')||1);if(element.hasAttribute('data-body'))refs.body=object;if(element.hasAttribute('data-head'))refs.head=object;if(element.hasAttribute('data-neck'))refs.neck=object;if(element.hasAttribute('data-leg'))refs[element.getAttribute('data-leg')]=object;if(element.tagName.toLowerCase()==='ellipse')refs.shadow=object;return object;}
 for(const name of Object.keys(templates)){
 const refs={},root=convert(templates[name],refs);stage.addChild(root);root.visible=false;const rig=articulationAt(name,0),color={deer:0xa97849,fox:0xb87540,rabbit:0xaaa28b}[name],neckFrames=[];
 // A fixed overlapping shoulder socket follows the body; head rotates about its center.
 const context=new GraphicsContext().circle(rig.pivotX,rig.pivotY,rig.socketRadius).fill(color);contexts.add(context);neckFrames.push(context);

 animals[name]={root,...refs,neckFrames};
 }
 let active='',lastBox='',lastTheme='',on=false,frames=0,crop=[0,0,2172,724];
 function hide(){if(on){canvas.style.visibility='hidden';on=false;}}
 function draw(name,p,box,night){if(disposed)return;if(box!==lastBox)crop=box.split(' ').map(Number);if(crop[0]>=animalPatch.x+animalPatch.width||crop[0]+crop[2]<=animalPatch.x){hide();return;}
 if(box!==lastBox){canvas.style.left=((animalPatch.x-crop[0])/crop[2]*100)+'%';canvas.style.top=((animalPatch.y-crop[1])/crop[3]*100)+'%';canvas.style.width=(animalPatch.width/crop[2]*100)+'%';canvas.style.height=(animalPatch.height/crop[3]*100)+'%';lastBox=box;}
 if(night!==lastTheme){for(const [object,tint] of tinted)object.tint=night?tint:0xffffff;lastTheme=night;}
 if(active!==name){if(active)animals[active].root.visible=false;active=name;animals[name].root.visible=true;}const a=animals[name],c=configs[name];a.root.position.set(p.x,p.y);a.root.scale.set(p.facing*p.scale,p.scale);const rig=articulationAt(name,p.head);a.body.position.y=-p.hop-p.bob+rig.crouch;a.body.scale.y=p.squash;a.head.pivot.set(rig.pivotX,rig.pivotY);a.head.position.set(rig.pivotX,rig.pivotY);a.head.rotation=rig.angle*Math.PI/180;a.neck.context=a.neckFrames[0];a.neck.alpha=1;
 a.front.pivot.set(17,-17);a.front.position.set(17,-17);a.front.rotation=p.gait*Math.PI/180;a.front.scale.y=1-rig.crouch/rig.legLength;a.back.pivot.set(-18,-17);a.back.position.set(-18,-17);a.back.rotation=-p.gait*Math.PI/180;a.back.scale.y=1-rig.crouch/rig.legLength;a.shadow.alpha=.18/(1+p.hop*.08);renderer.render(renderOptions);frames++;if(!on){canvas.style.visibility='visible';on=true;}
 }
 function destroy(){if(disposed)return;disposed=true;hide();canvas.remove();stage.destroy({children:true});for(const c of contexts)if(!c.destroyed)c.destroy();renderer.destroy({removeView:true,releaseGlobalResources:true});}
 return{draw,hide,destroy,get frames(){return frames;},backend:'pixi-webgl',pixels:animalPatch.width*animalPatch.height};
 }catch(error){if(stage)stage.destroy({children:true});for(const c of contexts)if(!c.destroyed)c.destroy();try{renderer.destroy({removeView:true,releaseGlobalResources:true});}catch{}throw error;}
}

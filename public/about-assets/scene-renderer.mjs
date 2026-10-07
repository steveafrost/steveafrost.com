import {WebGLRenderer,Container,Graphics,GraphicsContext} from '../river-assets/vendor/pixi-8.22.0-animals.mjs';
import {scenePatch,crossingAt,riderPose,advanceLean,steamAt,steamCurve,steamParcelCount,pedalRadius} from './scene-model.mjs?v=half-speed-steam-6';
export async function createAboutScene(host, {Renderer = WebGLRenderer} = {}) {
  const renderer=new Renderer(); let stage=null,disposed=false;
  const contexts=new Set();
  function graphic(context) {contexts.add(context);const g=new Graphics(context);g.eventMode='none';return g;}
  function shape(build) {const context=new GraphicsContext();build(context);return graphic(context);}
  try {
    await renderer.init({width:scenePatch.width,height:scenePatch.height,resolution:1,antialias:true,backgroundAlpha:0,skipExtensionImports:true,gcActive:false,powerPreference:'low-power'});
    if(disposed) return null;
    stage=new Container();stage.position.set(-scenePatch.x,-scenePatch.y);stage.eventMode='none';stage.interactiveChildren=false;
    const canvas=renderer.canvas;canvas.setAttribute('aria-hidden','true');canvas.className='about-pixi-canvas';host.append(canvas);
    const bike=new Container();bike.eventMode='none';stage.addChild(bike);
    const wheelContext=new GraphicsContext().circle(0,0,10).stroke({width:1.7,color:0x193b39}).circle(0,0,8.4).stroke({width:.55,color:0x87968a});
    for(let i=0;i<8;i++){const a=i*Math.PI/4;wheelContext.moveTo(0,0).lineTo(Math.cos(a)*8.4,Math.sin(a)*8.4).stroke({width:.55,color:0x657a6c});}
    wheelContext.circle(7.5,0,.8).fill(0xd9bd80);
    const rear=graphic(wheelContext),front=graphic(wheelContext);front.x=42;bike.addChild(rear,front);
    const frame=shape(c=>c.moveTo(0,0).lineTo(12,-19).lineTo(22,0).lineTo(0,0).moveTo(12,-19).lineTo(34,-19).lineTo(22,0).moveTo(34,-19).lineTo(42,0).moveTo(34,-19).lineTo(39,-24).lineTo(43,-23).moveTo(7,-22).lineTo(17,-22).stroke({width:1.8,color:0x254f46,cap:'round',join:'round'}));bike.addChild(frame);
    // Fixed limb geometry; transforms change each frame, never clear/rebuild.
    function limb(color,width) {return shape(c=>c.rect(0,-width/2,1,width).fill(color));}
    const farUpper=limb(0x6a8a78,4),farLower=limb(0xdba573,3),nearUpper=limb(0x274f4b,4),nearLower=limb(0xe2af7c,3),upperArm=limb(0xe48741,4),forearm=limb(0xe2af7c,3);
    const torso=limb(0xd97532,8),neck=limb(0xe2af7c,3);
    const head=shape(c=>c.circle(0,0,4.6).fill(0xe2af7c).moveTo(-5,-1).bezierCurveTo(-5,-8,5,-8,5,-1).closePath().fill(0x164d52));
    const crank=shape(c=>c.moveTo(-pedalRadius,0).lineTo(pedalRadius,0).stroke({width:1.8,color:0xd4c9a2}).circle(0,0,2).fill(0x163d36));crank.x=22;
    const farShoe=limb(0x173932,4),nearShoe=limb(0x173932,4);
    bike.addChild(farUpper,farLower,farShoe,torso,upperArm,forearm,neck,head,nearUpper,nearLower,nearShoe,crank);
    const steam=new Container();steam.eventMode='none';stage.addChild(steam);
    const steamContext=new GraphicsContext();
    for(const command of steamCurve())steamContext[command.action](...command.args);
    steamContext.closePath().fill(0xf7eedb);
    const parcels=Array.from({length:steamParcelCount},()=>{const parcel=graphic(steamContext);steam.addChild(parcel);return parcel;});
    const screen=new Container();screen.eventMode='none';stage.addChild(screen);
    // Interior of the illustrated laptop screen; leave existing text/art intact.
    const cursor=shape(c=>c.rect(0,0,1.1,5).fill({color:0xc7d4ba,alpha:.6}));cursor.position.set(681,444);screen.addChild(cursor);
    const line=shape(c=>c.moveTo(638,433).lineTo(674,434).stroke({color:0xc7d4ba,width:1,alpha:.23}));screen.addChild(line);
    const lean={value:0,velocity:0}; const options={container:stage,clear:true};
    function segment(g,a,b) {g.position.set(a.x,a.y);g.rotation=Math.atan2(b.y-a.y,b.x-a.x);g.scale.x=Math.hypot(b.x-a.x,b.y-a.y);}
    function draw(time,dt,zones) {
      if(disposed)return;
      const pose=crossingAt(time);bike.visible=zones.bridge&&pose.visible;
      if(bike.visible){bike.position.set(pose.rear.x,pose.rear.y);bike.rotation=pose.angle;bike.alpha=pose.alpha;rear.rotation=pose.rearWheel;front.rotation=pose.frontWheel;crank.rotation=pose.crank;
        const body=riderPose(pose.crank,advanceLean(lean,-pose.angle*8,dt));
        segment(farUpper,body.hip,body.farKnee);segment(farLower,body.farKnee,body.farFoot);segment(nearUpper,body.hip,body.nearKnee);segment(nearLower,body.nearKnee,body.nearFoot);
        segment(torso,body.hip,body.shoulder);segment(upperArm,body.shoulder,body.elbow);segment(forearm,body.elbow,body.hand);segment(neck,body.shoulder,{x:body.shoulder.x+3,y:body.shoulder.y-8});head.position.set(body.shoulder.x+3,body.shoulder.y-8);head.rotation=-pose.angle*.3;
        segment(nearShoe,body.nearFoot,{x:body.nearFoot.x+4,y:body.nearFoot.y});segment(farShoe,body.farFoot,{x:body.farFoot.x+4,y:body.farFoot.y});
      }
      steam.visible=screen.visible=zones.desk;
      if(zones.desk){for(let i=0;i<parcels.length;i++){const p=steamAt(time,i),parcel=parcels[i];parcel.position.set(p.x,p.y);parcel.scale.set(p.scaleX,p.scaleY);parcel.alpha=p.alpha;}
        cursor.alpha=.25+.25*(1+Math.sin(time*1.6));line.alpha=.4+.2*Math.sin(time*.65);}
      renderer.render(options);
    }
    function destroy(){if(disposed)return;disposed=true;canvas.remove();stage.destroy({children:true});for(const context of contexts)context.destroy();renderer.destroy();}
    canvas.addEventListener('webglcontextlost',()=>{canvas.style.visibility='hidden';},{once:true});
    return {draw,destroy,canvas};
  } catch(error) {if(stage)stage.destroy({children:true});for(const context of contexts)context.destroy();try{renderer.destroy();}catch{} throw error;}
}

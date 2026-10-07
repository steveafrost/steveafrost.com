// Reference coordinates are the unchanged 1122 x 1402 illustration.
export const scenePatch = { x: 170, y: 350, width: 670, height: 320 };
// Tire outer radius includes the centered stroke. The calibrated cubic follows
// the visible road all the way across, including its almost level right exit.
export const wheelRadius = 10.85, wheelbase = 42, pedalRadius = 7.2, driveRatio = .38;
export function deck(x) { const u=x-420; return 632.35 + .0002*u*u - .0000006*u*u*u; }
export function deckSlope(x) { const u=x-420; return .0004*u - .0000018*u*u; }
export const bridgeSpan = {start:190,end:580};
export function wheelContact(x) {
  const slope = deckSlope(x), norm = Math.hypot(1, slope);
  return { x: x + wheelRadius * slope / norm, y: deck(x) - wheelRadius / norm, contactX: x, contactY: deck(x) };
}
// A rigid wheelbase and two independent normal offsets keep both tires on
// the road. Solve the front contact instead of tilting a flat bike sprite.
export function bikePose(rearContactX) {
  const rear = wheelContact(rearContactX);
  if(rearContactX<bridgeSpan.start||rearContactX>524)throw new RangeError('Rear contact outside visible crossing');
  let lo = rearContactX, hi = Math.min(bridgeSpan.end,rearContactX + wheelbase * 1.2);
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2, f = wheelContact(mid);
    if (Math.hypot(f.x - rear.x, f.y - rear.y) < wheelbase) lo = mid; else hi = mid;
  }
  const front = wheelContact((lo + hi) / 2);
  return { rear, front, angle: Math.atan2(front.y - rear.y, front.x - rear.x) };
}
// Fixed Gauss-Legendre quadrature for the calibrated road, plus the exact
// normal-offset curvature contribution. Eight samples, no per-frame lookup build.
const arcNodes=[-.9602898564975363,-.7966664774136267,-.525532409916329,-.1834346424956498,.1834346424956498,.525532409916329,.7966664774136267,.9602898564975363];
const arcWeights=[.1012285362903763,.2223810344533745,.3137066458778873,.362683783378362,.362683783378362,.3137066458778873,.2223810344533745,.1012285362903763];
export function arcLength(a,b) {
  const mid=(a+b)/2,half=(b-a)/2;let length=0;
  for(let i=0;i<8;i++)length+=arcWeights[i]*Math.hypot(1,deckSlope(mid+half*arcNodes[i]));
  return half*length+wheelRadius*(Math.atan(deckSlope(b))-Math.atan(deckSlope(a)));
}
export function solveJoint(a, b, upper, lower, side = 1) {
  const dx = b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy);
  if (d > upper+lower || d < Math.abs(upper-lower) || d === 0) throw new RangeError('Unreachable articulated joint');
  const along=(upper*upper-lower*lower+d*d)/(2*d), height=Math.sqrt(Math.max(0,upper*upper-along*along));
  return {x:a.x+along*dx/d-side*height*dy/d,y:a.y+along*dy/d+side*height*dx/d};
}
export function crossingAt(time) {
  const cycle=time % 28, progress=Math.max(0,Math.min(1,(cycle-3)/20));
  const pose=bikePose(198+progress*326);
  const distance=arcLength(198,pose.rear.contactX), frontDistance=arcLength(bikePose(198).front.contactX,pose.front.contactX);
  return { ...pose, progress, visible:cycle>=3&&cycle<=23, alpha:Math.min(1,progress*12,(1-progress)*12), rearWheel:distance/wheelRadius, frontWheel:frontDistance/wheelRadius, crank:distance/(wheelRadius*driveRatio) };
}
export function riderPose(crank, lean = 0) {
  const hip={x:12,y:-23}, shoulder={x:25+lean+.45*Math.cos(crank),y:-40+.65*Math.sin(crank*2)}, hand={x:40,y:-22};
  const nearFoot={x:22+pedalRadius*Math.cos(crank),y:pedalRadius*Math.sin(crank)}, farFoot={x:22-pedalRadius*Math.cos(crank),y:-pedalRadius*Math.sin(crank)};
  return {hip,shoulder,hand,nearFoot,farFoot,nearKnee:solveJoint(hip,nearFoot,18,18,-1),farKnee:solveJoint(hip,farFoot,18,18,-1),elbow:solveJoint(shoulder,hand,13,13,1)};
}
// Critically damped lean follows changing grade without moving the saddle or
// detaching hands/feet. Bounded integration is independent of render pacing.
export function advanceLean(state, target, seconds) {
  const steps=Math.max(1,Math.ceil(seconds*120)),dt=seconds/steps;
  for(let i=0;i<steps;i++) { state.velocity += (49*(target-state.value)-14*state.velocity)*dt; state.value += state.velocity*dt; }
  state.value=Math.max(-1.5,Math.min(1.5,state.value));return state.value;
}
// A small pool of emitted parcels forms one cream steam column. Age controls
// upward advection, expansion and dissipation; lateral drift is secondary.
export const steamParcelCount=10,steamLifetime=3.6;
export function steamAt(time,index=0) {
  const wrapped=((time+index*steamLifetime/steamParcelCount)%steamLifetime+steamLifetime)%steamLifetime;
  const age=wrapped<1e-9||steamLifetime-wrapped<1e-9?0:wrapped;
  const fraction=age/steamLifetime;
  return {age,x:578+Math.sin(age*1.35+index*.31)*fraction*2.2,y:435-age*9.5,
    scaleX:1+fraction*.9,scaleY:.75+fraction*.5,
    alpha:.9*Math.min(1,age/.12)*(1-fraction)**1.4};
}
// Original warm cream, soft S contour, and tapered curl, reduced to an
// overlapping parcel. Shared context geometry is allocated exactly once.
export function steamCurve() {
  return [
    {action:'moveTo',args:[-1,0]},
    {action:'bezierCurveTo',args:[-2,-2,2,-3,1,-5]},
    {action:'bezierCurveTo',args:[0,-6,-3,-7,-1,-9]},
    {action:'bezierCurveTo',args:[1,-8,4,-7,4,-5]},
    {action:'bezierCurveTo',args:[4,-2,1,-2,1,0]}
  ];
}

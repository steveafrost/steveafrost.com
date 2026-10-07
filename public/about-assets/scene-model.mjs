// Reference coordinates are the unchanged 1122 x 1402 illustration.
export const scenePatch = { x: 170, y: 350, width: 670, height: 320 };
// Tire outer radius includes the 1.7px centered stroke. The road correction
// and radius together lift the old pose ~2.5 reference px (~3.2px at1440px).
export const wheelRadius = 10.85, wheelbase = 42, pedalRadius = 7.2, driveRatio = .38;
export function deck(x) { return 632.35 + .00032 * (x - 420) ** 2; }
export function deckSlope(x) { return .00064 * (x - 420); }
export function wheelContact(x) {
  const slope = deckSlope(x), norm = Math.hypot(1, slope);
  return { x: x + wheelRadius * slope / norm, y: deck(x) - wheelRadius / norm, contactX: x, contactY: deck(x) };
}
// A rigid wheelbase and two independent normal offsets keep both tires on
// the road. Solve the front contact instead of tilting a flat bike sprite.
export function bikePose(rearContactX) {
  const rear = wheelContact(rearContactX);
  let lo = rearContactX, hi = rearContactX + wheelbase * 1.2;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2, f = wheelContact(mid);
    if (Math.hypot(f.x - rear.x, f.y - rear.y) < wheelbase) lo = mid; else hi = mid;
  }
  const front = wheelContact((lo + hi) / 2);
  return { rear, front, angle: Math.atan2(front.y - rear.y, front.x - rear.x) };
}
export function arcLength(a, b) {
  // Exact primitive for the quadratic deck's normal-offset wheel-center path.
  const k = .00064;
  const primitive = x => { const u = k * (x - 420); return (u * Math.hypot(1,u) + Math.asinh(u)) / (2*k) + wheelRadius * Math.atan(u); };
  return primitive(b) - primitive(a);
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
export function steamAt(time,index) {
  const life=(time*.22+index/6)%1;
  return {x:578+Math.sin(life*6+index)*life*9,y:435-life*48,scale:1.05+life*.55,rotation:Math.sin(life*5+index)*.18,alpha:Math.sin(Math.PI*life)*.9};
}

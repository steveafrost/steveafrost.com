// Shoulder-centered rigs: the head has no independent translational channel.
// Positive crouch lowers the torso while shortening planted legs.
const rigs={deer:[17,-24,7,69,1.5],fox:[24,-18,8,32,5],rabbit:[13,-21,9,43,5.5]};
export function articulationAt(name,amount){const r=rigs[name],h=Math.max(-.06,Math.min(1,amount));return{pivotX:r[0],pivotY:r[1],socketRadius:r[2],angle:r[3]*h,crouch:r[4]*h};}

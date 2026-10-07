// Shoulder-centered rigs: the head has no independent translational channel.
// Positive crouch lowers the torso while shortening planted legs.
const rigs={deer:[17,-24,7,90,4],fox:[24,-18,8,60,8],rabbit:[13,-21,9,75,8]};
export function articulationAt(name,amount){const r=rigs[name],h=Math.max(-.06,Math.min(1,amount));return{pivotX:r[0],pivotY:r[1],socketRadius:r[2],angle:r[3]*h,crouch:r[4]*h,legLength:name==='deer'?20:15};}

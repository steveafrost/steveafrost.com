// Source-space bank bounds and traced foreground foliage edge, shared by both renderers.
export const animalPatch={x:420,y:420,width:450,height:150};
// Local shrub/trunk pockets, not a blanket over the bank or drinking spots.
const covers=[
 'M450 420H544L546 456 552 480 546 494 544 512 532 519 516 517 498 521 480 515 470 520 450 515Z',
 'M570 420H661L662 451 669 476 666 493 655 512 640 516 624 512 608 519 590 513 570 518Z',
 'M650 420H743L744 448 748 469 744 488 740 504 725 513 710 508 693 515 677 509 662 516 650 509Z'
];
export const forestEdge=covers[0];
export const woodlandRoutes=[
 {id:'white-flowers',start:[505,494],bend:[548,516],end:[600,536],cover:covers[0]},
 {id:'golden-thicket',start:[622,488],bend:[670,513],end:[708,534],cover:covers[1]},
 {id:'bridge-side-woods',start:[700,486],bend:[748,510],end:[806,531],cover:covers[2]}
];
export function nextRoute(previous,random=Math.random){const choices=woodlandRoutes.filter(r=>r.id!==previous);return choices[Math.floor(random()*choices.length)];}
// A stylized yaw retains a readable silhouette instead of collapsing at cos(pi/2).
export function turnFacing(seconds){const t=Math.min(Math.max(seconds/.6,0),1),cos=Math.cos(Math.PI*t);return(cos>=0?1:-1)*(.78+.22*Math.abs(cos));}

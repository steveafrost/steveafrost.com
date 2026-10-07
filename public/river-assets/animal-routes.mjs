// Source-space bank bounds and traced foreground foliage edge, shared by both renderers.
export const animalPatch={x:420,y:420,width:450,height:150};
export const forestEdge='M420 390H880V504L870 509 852 506 845 513 830 510 820 517 805 512 790 515 780 508 764 511 750 505 738 510 720 507 704 512 688 509 678 516 660 511 650 518 630 514 616 520 600 516 588 521 579 510 568 508 565 523 552 526 540 532 520 530 516 517 498 521 480 515 470 520 450 515 420 518Z';
export const woodlandRoutes=[
 {id:'white-flowers',start:[505,494],bend:[548,516],end:[600,536]},
 {id:'golden-thicket',start:[622,488],bend:[670,513],end:[708,534]},
 {id:'bridge-side-woods',start:[739,486],bend:[775,510],end:[806,531]}
];
export function nextRoute(previous,random=Math.random){const choices=woodlandRoutes.filter(r=>r.id!==previous);return choices[Math.floor(random()*choices.length)];}
// A stylized yaw retains a readable silhouette instead of collapsing at cos(pi/2).
export function turnFacing(seconds){const t=Math.min(Math.max(seconds/.6,0),1),cos=Math.cos(Math.PI*t);return(cos>=0?1:-1)*(.78+.22*Math.abs(cos));}

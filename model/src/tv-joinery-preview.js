import * as THREE from 'three';
import {stairFlights,stairLandingSlabs,STAIR_STRUCTURE} from './geometry.js';
import layout from './under-stair-layout.json' with {type:'json'};
// R14 is published. Every number below is read from under-stair-layout.json, which is also what the
// drawing scripts read, so the model and the drawn set cannot describe different joinery again.
const L=layout.tv;
export const TV_PREVIEW={
 id:L.revision,cabinet:L.cabinet.box,cabinetTop:L.cabinet.top,
 panel:L.panel,panelBottom:L.panelBottom,clearance:L.panelSoffitGap,
 screen:L.screen.box,screenBottom:L.screen.bottom,screenTop:L.screen.top,
 lowShelf:[L.shelves[0].y[0],L.shelves[0].y[1],L.shelves[0].top],
 endShelves:[L.shelves[1].top,L.shelves[2].top],endBay:L.endBay,
 shelfFaceX:L.shelfDepthX[1],
};
// The published profile is the canonical one: the flight underside less the clearance, which is
// exactly what the drawn sections set out from. The model measures the built meshes and compares,
// so if the stair or the slab representation ever moves again, this throws instead of letting the
// drawings go quietly stale. Sample points within 10 mm of a published vertical step are skipped,
// because a ray fired at a discontinuity can legitimately land on either side of it.
function assertPublishedProfile(measured){
 const pub=L.panelTopProfile;
 const at=y=>{for(let i=1;i<pub.length;i++){const a=pub[i-1],b=pub[i];
  if(y>=a[0]-1e-9&&y<=b[0]+1e-9&&b[0]>a[0])return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);}return null;};
 const steps=pub.filter((q,i)=>i&&pub[i-1][0]===q[0]).map(q=>q[0]);
 let worst=0,worstY=null;
 for(const [y,hh] of measured){
  if(steps.some(v=>Math.abs(y-v)<.01))continue;
  const e=at(y);if(e===null)continue;
  if(Math.abs(hh-e)>Math.abs(worst)){worst=hh-e;worstY=y;}
 }
 if(Math.abs(worst)>.005)throw new Error(
  `Measured stair soffit no longer matches tv.panelTopProfile in under-stair-layout.json: `
  +`${worst.toFixed(4)} m out at y = ${worstY}. Re-publish the profile and rebuild the drawings.`);
}
export function addTvJoineryPreview({parent,stairs,z,box,profilePrism,cylinder,materials,V}){
 const t=TV_PREVIEW,g=new THREE.Group();g.name='R14 fitted TV joinery under the lower flight';parent.add(g);
 // Read the underside of the existing meshes, not a projected or extrapolated stair line. Only
 // the structural group counts: the waist and landing slabs and their beam zones. The 20 mm stone
 // riser plates are finish on the face of the step above and are not a soffit - one of them hangs
 // 26 mm below the landing slab in a 20 mm strip at the foot of the flight, which would otherwise
 // notch the backing for no real reason and put the model 26 mm out against the drawn section.
 stairs.updateWorldMatrix(true,true);
 const structure=stairs.children.find(c=>c.isGroup&&/RCC stair structure/.test(c.name))||stairs;
 const ray=new THREE.Raycaster();
 const soffit=y=>{
  ray.set(V((t.panel[0]+t.panel[2])/2,z+.01,y),new THREE.Vector3(0,1,0));
  const hit=ray.intersectObject(structure,true).find(hit=>hit.object.isMesh);
  const landing=stairLandingSlabs('ground').filter(s=>!s.onGround && y>=s.box[1] && y<=s.box[3] && t.panel[0]>=s.box[0] && t.panel[2]<=s.box[2]);
  // The landing concrete is set back 20 mm behind its riser plate (the z-fighting recess), so a
  // 20 mm strip at the foot of the flight has no structural mesh over it. The landing's own soffit
  // is the answer there, and it is the answer the section draws.
  const over=[...(hit?[hit.point.y-z]:[]),...landing.map(s=>s.top-STAIR_STRUCTURE.landingZone)];
  if(!over.length)throw new Error(`No actual stair over joinery at y=${y}`);
  return Math.min(...over);
 };
 // Keep the exact diagonal. Sample the measured envelope, but land a sample exactly either side
 // of every flight/landing edge in the span, so the step reads as one clean vertical transition
 // instead of a 20 mm staircase of sampling noise across the junction.
 const edges=[...stairFlights('ground'),...stairLandingSlabs('ground')].flatMap(e=>
  e.box?[e.box[1],e.box[3]]:[e.a[0],e.b[0]]).filter(y=>y>t.panel[1]+.02&&y<t.panel[3]-.02);
 const stops=[...new Set([t.panel[1],...edges.flatMap(y=>[y-.002,y+.002]),t.panel[3]])].sort((a,b)=>a-b);
 const topSamples=[];
 for(let i=0;i<stops.length-1;i++){
  for(let y=stops[i];y<stops[i+1]-.0001;y+=.01)topSamples.push([y,soffit(y)-t.clearance]);
  topSamples.push([stops[i+1],soffit(stops[i+1])-t.clearance]);
 }
 // Repeated collinear points are removed, retaining real transitions in the measured envelope.
 const profile=[];
 for(const p of topSamples){
  if(profile.length && p[1]-profile.at(-1)[1]>.04){
   profile.push([p[0],profile.at(-1)[1]],p);continue;
  }
  while(profile.length>1){const a=profile.at(-2),b=profile.at(-1);
   if(Math.abs((b[1]-a[1])*(p[0]-b[0])-(p[1]-b[1])*(b[0]-a[0]))>1e-7)break;
   profile.pop();
  }profile.push(p);
 }
 assertPublishedProfile(profile);
 g.userData.preview={...t,profile,clearanceSource:'upward raycast against unchanged stair meshes'};
 profilePrism(g,t.panel[0],t.panel[2]-t.panel[0],[[t.panel[1],t.panelBottom],[t.panel[3],t.panelBottom],...profile.slice().reverse()],z,materials.oak);
 // Slim top lining and its concealed light use the same actual-soffit profile as the backing.
 // Neither fills the well nor becomes a deep triangular storage wedge.
 for(let i=1;i<profile.length;i++){
  const a=profile[i-1],b=profile[i];
  if(b[0]-a[0]<.00001)continue;
  profilePrism(g,t.panel[2],.12,[[a[0],a[1]-.018],[b[0],b[1]-.018],b,a],z,materials.oak);
  profilePrism(g,.862,.008,[[a[0],a[1]-.030],[b[0],b[1]-.030],[b[0],b[1]-.021],[a[0],a[1]-.021]],z,materials.glow);
 }
 const [x0,y0,x1,y1]=t.cabinet;
 box(g,x0+.045,y0+.045,x1-.065,y1-.045,z+.01,z+.095,materials.noir);
 box(g,x0,y0,x1,y1,z+.095,z+.432,materials.oak);
 box(g,x0,y0,x1,y1,z+.432,z+t.cabinetTop,materials.oak);
 const bay=(y1-y0)/4;
 for(let i=0;i<4;i++)box(g,x1-.016,y0+i*bay+.004,x1+.001,y0+(i+1)*bay-.004,z+.105,z+.426,materials.beige);
 box(g,x1-.06,y0+.03,x1-.035,y1-.03,z+.084,z+.093,materials.glow);
 box(g,...t.screen,z+t.screenBottom,z+t.screenTop,materials.noir);
 // One continuous backing and cabinet. Shelf boards share it instead of individual box backs.
 const shelf=(a,b,h)=>box(g,t.panel[2],a,t.shelfFaceX,b,z+h-.018,z+h,materials.oak);
 shelf(...t.lowShelf);
 box(g,t.panel[2],t.lowShelf[1]-.018,t.shelfFaceX,t.lowShelf[1],z+t.cabinetTop,z+t.lowShelf[2],materials.oak);
 for(const h of t.endShelves)shelf(t.endBay[0],t.endBay[1],h);
 box(g,t.panel[2],t.endBay[0],t.shelfFaceX,t.endBay[0]+.018,z+t.cabinetTop,z+t.endShelves.at(-1),materials.oak);
 // Finish the shared backing at the nook; this end is only a thin furniture edge.
 box(g,t.panel[2],y1-.018,t.shelfFaceX,y1,z+t.cabinetTop,z+t.endShelves.at(-1),materials.oak);
 cylinder(g,.89,3.87,z+.46,z+.62,.055,materials.noir);
 box(g,.78,3.81,.98,4.00,z+.795,z+.82,materials.linen);
 cylinder(g,.89,5.28,z+.81,z+.95,.045,materials.stone);
 return g;
}

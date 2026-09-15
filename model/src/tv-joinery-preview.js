import * as THREE from 'three';
import {stairLandingSlabs,STAIR_STRUCTURE} from './geometry.js';
// LOCAL R14 VISUAL STUDY ONLY. Published layout/drawings remain R13 pending visual approval.
export const TV_PREVIEW={
 id:'R14',cabinet:[.69,3.20,1.04,5.45],cabinetTop:.45,
 panel:[.72,3.23,.75,5.45],panelBottom:.42,clearance:.06,
 screen:[.75,4.16,.80,5.12],screenBottom:.60,screenTop:1.14,
 lowShelf:[3.66,4.06,.78],endShelves:[.79,1.13],endBay:[5.14,5.45],
};
export function addTvJoineryPreview({parent,stairs,z,box,profilePrism,cylinder,materials,V}){
 const t=TV_PREVIEW,g=new THREE.Group();g.name='R14 fitted TV joinery / local visual study';parent.add(g);
 // Read the underside of the existing meshes, not a projected or extrapolated stair line.
 stairs.updateWorldMatrix(true,true);
 const ray=new THREE.Raycaster();
 const soffit=y=>{
  ray.set(V((t.panel[0]+t.panel[2])/2,z+.01,y),new THREE.Vector3(0,1,0));
  const hit=ray.intersectObject(stairs,true).find(hit=>hit.object.isMesh);
  if(!hit)throw new Error(`No actual stair over joinery at y=${y}`);
  const landing=stairLandingSlabs('ground').filter(s=>!s.onGround && y>=s.box[1] && y<=s.box[3] && t.panel[0]>=s.box[0] && t.panel[2]<=s.box[2]);
  return Math.min(hit.point.y-z,...landing.map(s=>s.top-STAIR_STRUCTURE.landingZone));
 };
 // Keep the exact diagonal. Resolve the true end of its mesh before stepping to the flat
 // landing soffit; this also preserves the existing cast slab/finish overlap at the junction.
 const topSamples=[];
 for(let y=t.panel[1];y<t.panel[3]-.0001;y+=.01)topSamples.push([y,soffit(y)-t.clearance]);
 topSamples.push([t.panel[3],soffit(t.panel[3])-t.clearance]);
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
 const shelf=(a,b,h)=>box(g,t.panel[2],a,1.02,b,z+h-.018,z+h,materials.oak);
 shelf(...t.lowShelf);
 box(g,t.panel[2],t.lowShelf[1]-.018,1.02,t.lowShelf[1],z+t.cabinetTop,z+t.lowShelf[2],materials.oak);
 for(const h of t.endShelves)shelf(t.endBay[0],t.endBay[1],h);
 box(g,t.panel[2],t.endBay[0],1.02,t.endBay[0]+.018,z+t.cabinetTop,z+t.endShelves.at(-1),materials.oak);
 // Finish the shared backing at the nook; this end is only a thin furniture edge.
 box(g,t.panel[2],y1-.018,1.02,y1,z+t.cabinetTop,z+t.endShelves.at(-1),materials.oak);
 cylinder(g,.89,3.87,z+.46,z+.62,.055,materials.noir);
 box(g,.78,3.81,.98,4.00,z+.795,z+.82,materials.linen);
 cylinder(g,.89,5.28,z+.81,z+.95,.045,materials.stone);
 return g;
}

import layout from './fitout-layout.json' with {type:'json'};
import * as THREE from 'three';

// R20 fit-out. Every number is read from fitout-layout.json, which the drawing scripts also read.
// All dimensions are metres in plan coordinates; z is the level datum.
const group=(parent,name)=>{const g=new THREE.Group();g.name=name;parent.add(g);return g;};

export function addKitchenJoinery({parent,z,box,materials}){
 const k=layout.kitchen,g=group(parent,'R20 kitchen uppers, lofts, pantry, fridge housing and hood');
 for(const b of k.uppers.boxes)box(g,...b,z+k.uppers.bottom,z+k.uppers.top-.003,materials.oak).name='oak upper cupboard';
 // Warm concealed strip under the north (sink-wall) uppers only.
 const north=k.uppers.boxes.at(-1);box(g,north[0]+.02,north[1]+.03,north[2]-.03,north[3]-.03,z+k.uppers.bottom-.012,z+k.uppers.bottom,materials.glow);
 for(const b of k.lofts.boxes)box(g,...b,z+k.lofts.bottom,z+k.lofts.top,materials.ivory).name='ivory loft cupboard';
 const p=k.pantry.box;
 box(g,p[0]+.03,p[1]+.02,p[2]-.03,p[3]-.02,z,z+.08,materials.noir).name='pantry plinth';
 box(g,...p,z+.08,z+k.pantry.top,materials.oak).name='shallow full-height pantry';
 const half=(p[1]+p[3])/2;box(g,p[2],half-.002,p[2]+.001,half+.002,z+.1,z+k.pantry.top-.02,materials.noir);
 // Fridge housing: two flush oak side panels to the loft, fridge standing in the niche between.
 const f=k.fridgeHousing.box,t=k.fridgeHousing.panel;
 for(const b of [[f[0],f[1],f[2],f[1]+t],[f[0],f[3]-t,f[2],f[3]]])box(g,...b,z,z+k.fridgeHousing.top,materials.oak).name='fridge housing side panel';
 box(g,f[0],f[1]+t,f[2]-.02,f[3]-t,z,z+1.8,materials.metal).name='fridge';
 box(g,f[2]-.03,f[1]+.05,f[2]-.02,f[1]+.08,z+.9,z+1.38,materials.dark);
 // Slim inclined charcoal chimney hood over the hob, rising into the loft bridge.
 const h=k.hood;
 box(g,...h.canopy,z+h.canopyZ[0],z+h.canopyZ[1],materials.noir).name='hood canopy';
 box(g,h.canopy[0]+.02,h.canopy[1]+.02,h.canopy[2]-.02,h.canopy[3]-.02,z+h.canopyZ[0]-.004,z+h.canopyZ[0],materials.metal);
 box(g,...h.body,z+h.bodyZ[0],z+h.bodyZ[1],materials.noir).name='hood body';
 box(g,...h.duct,z+h.ductZ[0],z+h.ductZ[1],materials.noir).name='hood duct';
 return g;
}

export function addDiningAndLiving({parent,z,box,cylinder,rod,materials}){
 const d=layout.dining,g=group(parent,'R20 dining table, bench and pendant');
 const [x0,y0,x1,y1]=d.table;
 box(g,x0,y0,x1,y1,z+d.tableTop-.04,z+d.tableTop,materials.oak).name='dining table top';
 for(const x of [x0+.04,x1-.09])for(const y of [y0+.04,y1-.09])box(g,x,y,x+.05,y+.05,z,z+d.tableTop-.04,materials.oak);
 const b=d.bench;
 box(g,...b,z+d.benchSeat-.09,z+d.benchSeat-.04,materials.oak).name='dining bench';
 box(g,b[0]+.01,b[1]+.01,b[2]-.01,b[3]-.01,z+d.benchSeat-.04,z+d.benchSeat,materials.fabric);
 for(const y of [b[1],b[3]-.04])box(g,b[0]+.03,y,b[2]-.03,y+.04,z,z+d.benchSeat-.09,materials.oak);
 // Woven cane globe pendant, centred over the table; cord to the 2.85 m ceiling.
 const pd=d.pendant,bottom=d.tableTop+pd.bottomAboveTable,r=pd.diameter/2;
 const globe=cylinder(g,...pd.at,z+bottom,z+bottom+pd.diameter,r,materials.cane,32);
 globe.geometry.dispose();globe.geometry=new THREE.SphereGeometry(r,32,20);globe.name='cane globe pendant';
 cylinder(g,...pd.at,z+bottom+.02,z+bottom+.022,r*.45,materials.glow,24);
 rod(g,[...pd.at,z+bottom+pd.diameter],[...pd.at,z+2.85],.004,materials.noir);
 // L-shaped corner sofa: back along the north wall, backless chaise along the front wall.
 const s=layout.living.sofa,sf=group(parent,'Corner sofa with chaise');
 for(const b of [s.main,s.chaise])box(sf,...b,z+s.base,z+s.seat,materials.fabric);
 box(sf,...s.back,z+s.seat-.07,z+s.backTop,materials.fabric).name='sofa back';
 box(sf,...s.arm,z+s.seat-.07,z+s.armTop,materials.fabric).name='sofa arm';
 for(let y=s.main[1]+.02;y<s.arm[1]-.1;y+=(s.arm[1]-s.main[1])/2)box(sf,s.main[0]+.02,y,s.back[0],y+(s.arm[1]-s.main[1])/2-.04,z+s.seat,z+s.cushionTop,materials.linen);
 box(sf,s.chaise[0]+.02,s.chaise[1]+.02,s.back[0],s.chaise[3]-.02,z+s.seat,z+s.cushionTop,materials.linen).name='chaise cushion';
 const c=layout.living.coffeeTable,l=group(parent,'R20 round coffee table');
 cylinder(l,...c.centre,z+c.top-.04,z+c.top,c.radius,materials.oak,32);
 cylinder(l,...c.centre,z,z+c.top-.04,c.radius*.55,materials.oak,32);
 return g;
}

export function addRearScreen({parent,z,box,materials}){
 const s=layout.rearScreen,[x0,y0,x1,y1]=s.box,g=group(parent,'R20 north drying-balcony louvre screen');
 const [depth,thick]=s.blade,cx=(x0+x1)/2;
 for(const [lo,hi] of [[0,.04],[s.top-.04,s.top]])box(g,cx-depth/2,y0,cx+depth/2,y1,z+lo,z+hi,materials.louvre);
 for(let y=y0+.02;y+thick<=y1-.02+1e-9;y+=s.pitch)box(g,cx-depth/2,y,cx+depth/2,y+thick,z+.04,z+s.top-.04,materials.louvre).name='vertical louvre blade';
 return g;
}

export function addTerrace({parent,z,box,cylinder,rail,materials}){
 const t=layout.terrace,g=group(parent,'R20 terrace pergola, bench and planters');
 const p=t.pergola,[x0,y0,x1,y1]=p.box,s=p.post,[bd,bw]=p.beam,top=z+p.height;
 for(const x of [x0,x1-s])for(const y of [y0,y1-s])box(g,x,y,x+s,y+s,z,top,materials.noir).name='pergola post';
 for(const x of [x0,x1-bw])box(g,x,y0,x+bw,y1,top-bd,top,materials.noir).name='pergola beam';
 for(const y of [y0,y1-bw])box(g,x0,y,x1,y+bw,top-bd,top,materials.noir).name='pergola beam';
 for(let y=y0+p.purlinPitch;y<y1-.1;y+=p.purlinPitch)box(g,x0,y,x1,y+.04,top,top+.05,materials.noir);
 box(g,x0,y0,x1,y1,top+.05,top+.065,materials.bamboo).name='bamboo chick-blind shade';
 const b=t.bench;
 box(g,...b.box,z,z+b.seat,materials.ivory).name='masonry bench';
 box(g,b.box[0]+.02,b.box[1]+.02,b.box[2]-.04,b.box[3]-.02,z+b.seat,z+b.seat+.07,materials.linen);
 // A seat is a foothold: the guard is raised to 1.10 m above it along the bench.
 rail(g,5.975,b.box[1]-.1,5.975,b.box[3]+.1,z,b.seat+b.guardAboveSeat);
 const tc=t.table;cylinder(g,...tc.centre,z+.7,z+.74,tc.radius,materials.oak,24);cylinder(g,...tc.centre,z,z+.7,.06,materials.noir);
 for(const [x,y,r] of t.planters){
  cylinder(g,x,y,z,z+.6,r,materials.ivory,20).name='large planter';
  const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(r*1.1,1),materials.plant);
  leaves.position.copy(cylinder(g,x,y,z+.6,z+.62,r*.9,materials.soil,20).position);leaves.position.y=z+.95;leaves.scale.y=1.2;g.add(leaves);
 }
 return g;
}

// Which side of a wall a window's room is on: +1 toward larger plan x/y, -1 toward smaller.
export const windowRoomSide=o=>o.axis==='h'?(o.y<4.85?1:-1):(o.x<3?1:-1);

// 7 Nov 2026 window style: an oak box pelmet over each bedroom and living/dining window, on the
// room side, concealing the curtain track. It never runs into a wardrobe beside the window.
export function addWindowDressing({parent,level,z,openings,rooms,storageBoxes,box,materials}){
 const w=layout.windows,pl=w.pelmet,g=group(parent,'Window pelmets');
 for(const o of openings.filter(o=>o.kind==='window')){
  const side=windowRoomSide(o),face=o.axis==='h'?(side>0?o.y+o.t:o.y):(side>0?o.x+o.t:o.x);
  const probe=face+side*.3,mid=(o.axis==='h'?o.x:o.y)+o.w/2;
  const at=o.axis==='h'?[mid,probe]:[probe,mid];
  const room=rooms.find(r=>(r.regions??[r.box]).some(b=>at[0]>=b[0]&&at[0]<=b[2]&&at[1]>=b[1]&&at[1]<=b[3]));
  if(!room||!pl.rooms.includes(room.id))continue;
  const start=o.axis==='h'?o.x:o.y;let a0=start-pl.overhang,a1=start+o.w+pl.overhang;
  const n0=Math.min(face,face+side*pl.depth),n1=Math.max(face,face+side*pl.depth);
  for(const b of storageBoxes){
   const [b0,b1,bn0,bn1]=o.axis==='h'?[b[0],b[2],b[1],b[3]]:[b[1],b[3],b[0],b[2]];
   if(Math.min(bn1,n1)-Math.max(bn0,n0)<=1e-6||Math.min(b1,a1)-Math.max(b0,a0)<=1e-6)continue;
   if((b0+b1)/2<mid)a0=Math.max(a0,b1);else a1=Math.min(a1,b0);
  }
  const lo=z+o.sill+o.height+pl.gapAboveHead,hi=lo+pl.height;
  box(g,...(o.axis==='h'?[a0,n0,a1,n1]:[n0,a0,n1,a1]),lo,hi,materials.oak).name=`pelmet ${room.id}`;
 }
 return g;
}

// Rectangular oak slatted divider between the sofa and the dining table (accepted 25 Oct 2026).
export function addLivingScreen({parent,z,box,materials}){
 const s=layout.living.screen,[x0,y0,x1,y1]=s.box,f=s.frame,g=group(parent,'Living/dining slatted screen');
 const top=z+s.height;
 for(const [a,b] of [[x0,x0+f],[x1-f,x1]])box(g,a,y0,b,y1,z,top,materials.oak).name='screen frame post';
 for(const [lo,hi] of [[z,z+f],[top-f,top]])box(g,x0,y0,x1,y1,lo,hi,materials.oak).name='screen frame rail';
 const [sw,sd]=s.slat,cy=(y0+y1)/2;
 for(let x=x0+f+s.gap;x+sw<=x1-f-s.gap+1e-9;x+=sw+s.gap)box(g,x,cy-sd/2,x+sw,cy+sd/2,z+f,top-f,materials.oak).name='screen slat';
 return g;
}


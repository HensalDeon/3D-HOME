import {addTvJoineryPreview} from './tv-joinery-preview.js';
import * as THREE from 'three';
import {facadeBand} from './facade.js';
import {revision} from './revision.js';
import {plan,LEVELS,rooms,openingsFor,wallPieces,stairTreads,STAIR_STRUCTURE,stairBeamZones,stairFlights,stairLandingSlabs,FRAME,ENVELOPE} from './geometry.js';
export function createHouse(){
 const root=new THREE.Group(),levels={},pickables=[],labels=[],wallMaterials=[],furnitureGroups=[],facades=[],dimensions=new THREE.Group();root.add(dimensions);const siteDimensions=new THREE.Group(),roofDimensions=new THREE.Group();dimensions.add(siteDimensions,roofDimensions);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.8,...extra});
 const materials={wall:mat('#eeeee5'),stone:mat('#d7d5c8'),concrete:mat('#b7bab2',{roughness:.95}),dark:mat('#37413e'),wood:mat('#956b49'),oak:mat('#b69873'),fabric:mat('#d3d4bd'),linen:mat('#f8f4e7'),beige:mat('#ddd0ba'),green:mat('#738e76'),tile:mat('#dce8e2'),glass:mat('#b6d0cf',{transparent:true,opacity:.36,roughness:.17,metalness:.1,depthWrite:false,side:THREE.DoubleSide}),obscured:mat('#bad0cb',{transparent:true,opacity:.75,roughness:.6}),metal:mat('#717b72',{metalness:.55,roughness:.35}),soil:mat('#a3ad8d'),grass:mat('#b5c1a0'),pave:mat('#d9dbc9'),water:mat('#809f98'),white:mat('#f5f3e8'),mirror:mat('#dfe9ea',{metalness:.3,roughness:.15}),
  // R12 reference palette: medium-tone oak for the panel/shelves/nook, warm beige fronts, near
  // black for the screen, balustrade and plumbing, and a warm emissive for the concealed strips.
  noir:mat('#1e2220',{roughness:.55}),glow:mat('#f7e3bd',{emissive:'#f0c07a',emissiveIntensity:.95,roughness:.6})};
 const V=(x,h,y)=>new THREE.Vector3(x-3,h,4.85-y);
 function box(g,x0,y0,x1,y1,bottom,top,m){if(x1-x0<.00001||y1-y0<.00001||top-bottom<.00001)return;const o=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,top-bottom,y1-y0),m);o.position.copy(V((x0+x1)/2,(bottom+top)/2,(y0+y1)/2));o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 // An inclined slab whose top face lies on the a-b segment given as (plan y, height above z).
 function slopedSlab(g,x0,x1,a,b,thickness,m){
  const A=V((x0+x1)/2,a[1],a[0]),B=V((x0+x1)/2,b[1],b[0]),d=B.clone().sub(A);
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,thickness,d.length()),m);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d.clone().normalize());
  // setFromUnitVectors flips the local up when the flight runs the other way down the plan,
  // so force the offset normal upward before seating the top face on the a-b line.
  const n=new THREE.Vector3(0,1,0).applyQuaternion(mesh.quaternion);if(n.y<0)n.negate();
  mesh.position.copy(A.clone().add(B).multiplyScalar(.5)).addScaledVector(n,-thickness/2);
  mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;
 }
 // A plate of constant thickness in x, whose face profile is an arbitrary polygon given in
 // (plan y, height above the level datum). R12 needs it for the raking backing panel: the
 // diagonal under the flight has to be one straight edge, not a stack of steps.
 function profilePrism(g,x0,thickness,pts,z,m){
  const shape=new THREE.Shape();
  pts.forEach(([y,h],i)=>i?shape.lineTo(y-4.85,z+h):shape.moveTo(y-4.85,z+h));
  shape.closePath();
  const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false}),m);
  // Local x maps to -world z (plan y), local y to height, local z to world x (plan x).
  mesh.rotation.y=Math.PI/2;mesh.position.set(x0-3,0,0);
  mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;
 }
 function rod(g,a,b,r,m){const av=V(a[0],a[2],a[1]),bv=V(b[0],b[2],b[1]),d=bv.clone().sub(av);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),7),m);mesh.position.copy(av.add(bv).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());mesh.castShadow=true;g.add(mesh);return mesh;}
 function cylinder(g,x,y,b,t,r,m,segments=24){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,t-b,segments),m);o.position.copy(V(x,(b+t)/2,y));o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 function line(g,pts,color='#78967b',dashed=false){const geo=new THREE.BufferGeometry().setFromPoints(pts.map(p=>V(p[0],p[2],p[1])));const o=new THREE.Line(geo,dashed?new THREE.LineDashedMaterial({color,dashSize:.12,gapSize:.09}):new THREE.LineBasicMaterial({color}));o.computeLineDistances();g.add(o);return o;}
 function label(text,detail,x,y,h,level,type='room',room=null){labels.push({text,detail,position:V(x,h,y),level,type,room});}
 function rail(g,x0,y0,x1,y1,z,height=1.1,glass=false){
  rod(g,[x0,y0,z+height],[x1,y1,z+height],.022,glass?materials.wood:materials.dark);
  const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/(glass?1.15:.12));
  for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;rod(g,[x,y,z+.04],[x,y,z+height],glass?.015:.009,materials.dark);}
  if(glass)box(g,Math.min(x0,x1)-.009,Math.min(y0,y1)-.009,Math.max(x0,x1)+.009,Math.max(y0,y1)+.009,z+.12,z+height-.04,materials.glass);
 }
 function opening(g,o,z,facade=false){
  const {x,y,w,t,axis,sill,height,kind,swing,hinge}=o,h=z+sill;
  if(kind==='opening'||kind==='joinery')return;
  const isDoor=kind==='door'||kind==='pocket',m=kind==='obscured'?materials.obscured:materials.glass;
  const frame=(start,end,low,high,material=materials.dark)=> axis==='h'?box(g,x+start,y+t*.35,x+end,y+t*.65,low,high,material):box(g,x+t*.35,y+start,x+t*.65,y+end,low,high,material);
  if(isDoor){
   frame(0,.035,h,h+height);frame(w-.035,w,h,h+height);frame(0,w,h+height-.035,h+height);
   if(kind==='pocket'){
    // Shown open, leaf parked on bedroom side of the long wall as in the drawing.
    box(g,x-.035,y+w,x-.01,y+2*w,h,h+height-.035,materials.oak);
   }else{
    const hx=axis==='h'?(hinge==='lo'?x:x+w):(swing>0?x+t:x),hy=axis==='h'?(swing>0?y+t:y):(hinge==='lo'?y:y+w);
    if(axis==='h')box(g,hx-.02,Math.min(hy,hy+swing*w),hx+.02,Math.max(hy,hy+swing*w),h,h+height-.035,materials.oak);
    else box(g,Math.min(hx,hx+swing*w),hy-.02,Math.max(hx,hx+swing*w),hy+.02,h,h+height-.035,materials.oak);
    const pts=[];const start=axis==='h'?(hinge==='lo'?0:Math.PI):(hinge==='lo'?Math.PI/2:-Math.PI/2);
    const end=axis==='h'?(swing>0?Math.PI/2:-Math.PI/2):(swing>0?0:Math.PI);
    let delta=end-start;if(delta>Math.PI)delta-=2*Math.PI;if(delta< -Math.PI)delta+=2*Math.PI;
    for(let i=0;i<=18;i++){const a=start+delta*i/18;pts.push([hx+Math.cos(a)*w,hy+Math.sin(a)*w,z+.016]);}line(g,pts,'#9aa68c',true);
   }
   return;
  }
  frame(0,w,h,h+.045);frame(0,w,h+height-.045,h+height);frame(0,.045,h,h+height);frame(w-.045,w,h,h+height);
  for(let i=1;i<(w>1.5?3:2);i++)frame(w*i/(w>1.5?3:2)-.012,w*i/(w>1.5?3:2)+.012,h,h+height);
  frame(.04,w-.04,h+.045,h+height-.045,m);
 }
 function furniture(g,level,z){
  const f=new THREE.Group();g.add(f);furnitureGroups.push(f);
  function chair(x,y,w=.45){box(f,x-w/2,y-w/2,x+w/2,y+w/2,z+.34,z+.44,materials.fabric);box(f,x-w/2,y+w/2-.065,x+w/2,y+w/2,z+.40,z+.80,materials.oak);for(const a of [-1,1])for(const b of [-1,1])rod(f,[x+a*(w/2-.045),y+b*(w/2-.045),z],[x+a*(w/2-.045),y+b*(w/2-.045),z+.35],.025,materials.oak);}
  function basin(x,y,w,d,axis){let b=axis==='x1'?[x-d,y-w/2,x,y+w/2]:axis==='y1'?[x-w/2,y-d,x+w/2,y]:[x-w/2,y,x+w/2,y+d];box(f,...b,z+.77,z+.86,materials.white);box(f,b[0]+.04,b[1]+.04,b[2]-.04,b[3]-.04,z+.861,z+.87,materials.water);rod(f,[(b[0]+b[2])/2,b[3]-.03,z+.86],[(b[0]+b[2])/2,b[3]-.03,z+1.02],.015,materials.metal);}
  for(const c of plan.levels[level]){const a=c.args;
   if(c.op==='bed'){const [x0,y0,x1,y1]=a;box(f,x0,y0,x1,y1,z+.1,z+.3,materials.oak);box(f,x0+.025,y0+.025,x1-.025,y1-.025,z+.3,z+.51,materials.linen);box(f,x0,y0,x0+.07,y1,z+.13,z+.98,materials.oak);box(f,x0+.6,y0+.01,x1-.01,y1-.01,z+.51,z+.55,materials.green);for(let i=0;i<2;i++)box(f,x0+.1,y0+.1+i*(y1-y0)/2,x0+.48,y0+(i+1)*(y1-y0)/2-.1,z+.51,z+.63,materials.linen);}
   if(c.op==='chair')chair(...a.slice(0,3));
   if(c.op==='shower'){const[x0,y0,x1,y1]=a;box(f,x0,y0,x1,y1,z+.006,z+.04,materials.tile);box(f,x0,y0,x1,y0+.015,z+.04,z+1.95,materials.glass);rod(f,[x0+.2,y1-.06,z+1],[x0+.2,y1-.06,z+2.05],.018,materials.metal);rod(f,[x0+.2,y1-.06,z+2.05],[x0+.2,y1-.26,z+2.05],.025,materials.metal);cylinder(f,x0+.2,y1-.26,z+2.01,z+2.05,.075,materials.metal);}
   if(c.op==='wc'){const[x,y]=a;box(f,x-.16,y-.21,x,y+.21,z+.22,z+.78,materials.white);const o=cylinder(f,x-.43,y,z+.16,z+.43,.2,materials.white);o.scale.x=1.3;cylinder(f,x-.44,y,z+.43,z+.46,.145,materials.stone);}
   if(c.op==='basin')basin(...a.slice(0,5));
  }
  if(level!=='roof'){
   box(f,.15,6.2,1.65,6.75,z,z+2.1,materials.oak);for(let x=.65;x<1.65;x+=.5)box(f,x-.005,6.75,x+.005,6.755,z+.04,z+2.07,materials.wood);
  }
  if(level==='ground'){
   for(const b of [[.15,.15,2.95,.75],[2.45,.75,3.05,1.3],[3.15,8.3,4.4,8.85]]){box(f,...b,z,z+.84,materials.oak);box(f,...b,z+.84,z+.9,materials.stone);}
   box(f,.7,.22,1.32,.65,z+.905,z+.93,materials.dark);for(const x of [.86,1.16])cylinder(f,x,.42,z+.93,z+.94,.09,materials.metal);
   box(f,.15,1.5,.8,2.2,z,z+1.8,materials.metal);box(f,.77,1.54,.8,1.57,z+.9,z+1.38,materials.dark);
   box(f,3.15,8.9,3.75,9.5,z,z+.86,materials.white);const drum=new THREE.Mesh(new THREE.CylinderGeometry(.20,.20,.02,24),materials.dark);drum.rotation.z=Math.PI/2;drum.position.copy(V(3.76,z+.43,9.2));f.add(drum);
   box(f,5.12,2,5.85,3.8,z+.12,z+.47,materials.fabric);box(f,5.69,2,5.85,3.8,z+.4,z+.95,materials.fabric);for(let y=2.05;y<3.7;y+=.58)box(f,5.12,y,5.69,y+.52,z+.47,z+.57,materials.linen);for(const y of [2,3.65])box(f,5.12,y,5.85,y+.15,z+.4,z+.72,materials.fabric);
   // Local visual study only: published R13 plan/layout data are intentionally not propagated.
   addTvJoineryPreview({parent:f,stairs:g.getObjectByName('stairs'),z,box,profilePrism,cylinder,materials,V});
   // ---- R12 washbasin nook: the approved geometry, given the reference interior treatment ----
   const wash=new THREE.Group();wash.name='R12 washbasin nook against the bedroom (west) wall; basin faces east';f.add(wash);
   const w=revision.wash,fin=w.finish,b=w.box,cx=(b[0]+b[2])/2;
   // Warm oak panelled backdrop on the bedroom wall, floor to just under the landing soffit.
   box(wash,fin.panelling.box[0],fin.panelling.box[1],fin.panelling.box[2],fin.panelling.box[3],z,z+fin.panelling.top,materials.oak);
   // Warm integrated backlight, 40 mm proud of the vertical mirror on all four sides.
   box(wash,fin.mirrorHalo.box[0],fin.mirrorHalo.box[1],fin.mirrorHalo.box[2],fin.mirrorHalo.box[3],z+fin.mirrorHalo.z[0],z+fin.mirrorHalo.z[1],materials.glow);
   box(wash,fin.mirror.box[0],fin.mirror.box[1],fin.mirror.box[2],fin.mirror.box[3],z+fin.mirror.z[0],z+fin.mirror.z[1],materials.mirror);
   // Compact floating oak vanity, 0.50 m clear under it, with a light stone counter.
   box(wash,b[0],b[1],b[2],b[3],z+fin.vanity.carcass[0],z+fin.vanity.carcass[1],materials.oak);
   box(wash,b[0],b[1]-.012,b[2],b[3],z+fin.vanity.counter[0],z+fin.vanity.counter[1],materials.stone);
   line(wash,[[b[0],b[1]-.014,z+.66],[b[2],b[1]-.014,z+.66]],'#8d704e');
   // White rectangular vessel basin standing on the counter.
   box(wash,fin.bowl.box[0],fin.bowl.box[1],fin.bowl.box[2],fin.bowl.box[3],z+fin.bowl.z[0],z+fin.bowl.z[1],materials.white);
   box(wash,fin.bowl.box[0]+.035,fin.bowl.box[1]+.035,fin.bowl.box[2]-.035,fin.bowl.box[3]-.035,z+fin.bowl.z[1]-.035,z+fin.bowl.z[1]-.027,materials.water);
   // Simple black deck mixer behind the bowl.
   rod(wash,[fin.tap.riser[0],fin.tap.riser[1],z+fin.tap.z[0]],[fin.tap.riser[0],fin.tap.riser[1],z+fin.tap.z[1]],.012,materials.noir);
   rod(wash,[fin.tap.riser[0],fin.tap.riser[1],z+fin.tap.z[1]],[fin.tap.riser[0],fin.tap.spoutTo,z+fin.tap.z[1]],.012,materials.noir);
   // Black towel ring on the panelling, and one subtle warm downlight in the landing soffit.
   const ring=new THREE.Mesh(new THREE.TorusGeometry(fin.towelRing.radius,.008,8,28),materials.noir);
   ring.position.copy(V(fin.towelRing.at[0],z+fin.towelRing.z,fin.towelRing.at[1]-.03));ring.rotation.y=Math.PI/2;wash.add(ring);
   cylinder(wash,fin.downlight.at[0],fin.downlight.at[1],z+fin.downlight.z,z+fin.downlight.z+.012,fin.downlight.radius,materials.glow);
   box(wash,cx-.045,b[1]+.05,cx+.02,b[1]+.11,z+fin.vanity.counter[1],z+fin.vanity.counter[1]+.14,materials.linen);
   cylinder(f,4.88,4.65,z+.7,z+.77,.45,materials.oak);cylinder(f,4.88,4.65,z,z+.7,.08,materials.dark);
   box(f,5.35,1.35,5.85,1.72,z+.62,z+.73,materials.oak);box(f,5.45,1.37,5.75,1.43,z+.73,z+1.24,materials.wood);
   
  }else if(level==='first'){
   box(f,.25,.35,1.75,.9,z+.73,z+.79,materials.oak);for(const x of [.30,1.67])box(f,x,.4,x+.06,.85,z,z+.73,materials.dark);box(f,2.6,.3,3.05,1.3,z,z+2.0,materials.oak);box(f,5.3,2.6,5.85,3.35,z,z+2.1,materials.oak);
   const wardrobe=new THREE.Group();wardrobe.name='Bedroom 3 continuous L wardrobe extension';f.add(wardrobe);
   // Original cabinet retained; 100 mm corner filler joins the 550 mm deep perpendicular return.
   box(wardrobe,4.2,2.5,5.3,3.05,z,z+2.1,materials.oak);
   box(wardrobe,5.3,2.5,5.85,2.6,z,z+2.1,materials.oak);
   for(const x of [4.75,5.29])line(wardrobe,[[x,3.052,z+.04],[x,3.052,z+2.06]],'#8d704e');
   line(wardrobe,[[5.297,3.05,z+.04],[5.297,3.05,z+2.06]],'#8d704e');
   // Paired hinged corner fronts, no fixed corner post: 550 + 300 mm leaves expose the corner.
   rod(wardrobe,[4.78,3.075,z+.98],[4.78,3.075,z+1.17],.009,materials.dark);
   rod(wardrobe,[5.275,3.31,z+.98],[5.275,3.31,z+1.17],.009,materials.dark);
   rod(wardrobe,[4.24,3.075,z+.98],[4.24,3.075,z+1.17],.009,materials.dark);
   for(const y of [9.07,9.32])rod(f,[3.4,y,z+1.65],[5.6,y,z+1.65],.006,materials.metal);
  }else{
   cylinder(f,4.4,7.4,z+.68,z+.74,.38,materials.oak);cylinder(f,4.4,7.4,z,z+.68,.06,materials.dark);
  }
 }
 function cladding(g,x0,y0,x1,y1,z0,z1,vertical=false){box(g,x0,y0,x1,y1,z0,z1,materials.wood);if(vertical){for(let x=x0+.12;x<x1;x+=.12)box(g,x,y0-.001,x+.005,y1+.001,z0,z1,materials.oak);}else{for(let h=z0+.13;h<z1;h+=.13)box(g,x0,y0-.001,x1,y1+.001,h,h+.004,materials.oak);}}
 for(const level of Object.keys(LEVELS)){
  const z=LEVELS[level],g=new THREE.Group();g.name=level;root.add(g);levels[level]=g;const walls=new THREE.Group();g.add(walls);
  const wm=materials.wall.clone();wallMaterials.push({material:wm,level});
  if(level==='ground')box(g,...ENVELOPE.ground,0,z,materials.stone);
  else{ // Leave a genuine opening over both flights and the intermediate landing. R8: a slab
   // spans the envelope of the storey below, so the first-floor slab covers the 220 mm walls.
   // R10: the first-floor slab now runs to y = 4.2 under the arrival landing R9 extended to that
   // line; the roof slab keeps the unchanged first-to-roof trimmer at y = 3.45.
   const [wx,,,dy]=ENVELOPE[level==='first'?'ground':'first'];
   for(const b of [[wx,0,6,3.2],[wx,3.2,.15,6.1],[2.05,3.2,6,6.1],[.15,6.1,6,dy],[wx,6.1,.15,dy],[1.05,3.2,2.05,level==='first'?4.2:3.45]])box(g,...b,z-.15,z,materials.stone);
  }
  const pieces=wallPieces(level);
  for(const p of pieces)box(walls,...p.box,z+p.bottom,z+p.top,wm);
  const apertureGroup=new THREE.Group();g.add(apertureGroup);apertureGroup.name='apertures';for(const o of openingsFor(level))opening(apertureGroup,o,z);
  // Associate every aperture material with the same horizontal cut plane as the walls.
  apertureGroup.traverse(o=>{if(o.isMesh){o.material=o.material.clone();wallMaterials.push({material:o.material,level});}});
  for(const room of rooms.filter(r=>r.level===level)){
   const m=mat(room.id.includes('bath')?'#dce9e2':room.id.includes('bed')||room.id.includes('master')||room.id.includes('child')?'#e4d9c8':room.id.includes('kitchen')||room.id.includes('study')?'#e4deca':'#e8e9de');
   // Stair zones must preserve the stair opening; only use an invisible picking plane there.
   const isStair=room.id.includes('stair')||room.id==='r-head'||room.id==='g-wash'||room.id==='g-media';
   if(isStair){m.transparent=true;m.opacity=0;m.depthWrite=false;}
   for(const b of room.regions??[room.box]){const tile=box(g,...b,z+.002,z+.009,m);tile.userData.room=room;pickables.push(tile);}
   const[x0,y0,x1,y1]=room.box;label(room.name,room.dimensions,(x0+x1)/2,(y0+y1)/2,z+.18,level,'room',room);
  }
  if(level!=='roof'){
   // R6: a conceptual cast-in-situ RCC stair. A continuous waist slab runs under each flight and
   // is monolithic with the landing slabs, so nothing reads as a floating or cantilevered tread.
   // The warm stone finish is a separate 20 mm layer over the concrete; walking levels are unchanged.
   const stairGroup=new THREE.Group();g.add(stairGroup);stairGroup.name='stairs';
   const structure=new THREE.Group();stairGroup.add(structure);
   structure.name='Conceptual RCC stair structure - waist slabs, landing slabs and beam zones TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER';
   const steps=stairTreads(level),rise=3/17,FIN=STAIR_STRUCTURE.finish;
   // Each waist slab is run into the slab it frames into, but never past a landing edge.
   for(const f of stairFlights(level)){
    const dy=f.b[0]-f.a[0],dh=f.b[1]-f.a[1],[ra,rb]=f.runIn.map(v=>v/Math.abs(dy));
    slopedSlab(structure,f.x[0],f.x[1],[f.a[0]-dy*ra,z+f.a[1]-dh*ra-FIN],[f.b[0]+dy*rb,z+f.b[1]+dh*rb-FIN],STAIR_STRUCTURE.waistVertical,materials.concrete);
   }
   // Landing slabs at the turns; the starter landing is solid onto the plinth fill. The last riser
   // of the lower flight is finished against the landing above it, so the landing concrete is set
   // back by the finish thickness behind that plate: two coplanar outer faces would speckle.
   const riserLandingId=level==='ground'?'extension':'intermediate';
   for(const s of stairLandingSlabs(level)){
    const lo=z+(s.onGround?0:s.top-STAIR_STRUCTURE.landingZone),hi=z+s.top-FIN;
    if(s.id===riserLandingId){
     box(structure,s.box[0],s.box[1]+FIN,Math.min(s.box[2],1.05),s.box[3],lo,hi,materials.concrete);
     if(s.box[2]>1.05)box(structure,1.05,s.box[1],s.box[2],s.box[3],lo,hi,materials.concrete);
    }else box(structure,...s.box,lo,hi,materials.concrete);
    box(stairGroup,...s.box,z+s.top-FIN,z+s.top,materials.stone);
   }
   // Support zones shown as massing only, inside walls and slab edges that already exist.
   // R9: the intermediate landing rises from riser 9 to riser 12 on the ground-to-first stair
   // only; the first-to-roof stair keeps its own landing at riser 9, unaffected.
   const landingRiser=level==='ground'?12:9,beamZones=stairBeamZones(level);
   const beams=new THREE.Group();structure.add(beams);beams.name='Landing beam and trimmer zones (indicative)';
   for(const bz of beamZones){
    const b=[bz.box[0]+.002,bz.box[1]+.002,bz.box[2]-.002,bz.box[3]-.002];
    if(bz.id==='landing-beam')box(beams,...b,z+landingRiser*rise-STAIR_STRUCTURE.landingZone-.15,z+landingRiser*rise-FIN,materials.concrete);
    else box(beams,...b,z+2.85-.15,z+2.85,materials.concrete);
   }
   label('Landing beam zone',beamZones[0].note,1.6,6.15,z+1.75,level,'dimension');
   label('RCC waist slab',`${(STAIR_STRUCTURE.waist*1000).toFixed(0)} mm indicative - ${STAIR_STRUCTURE.status}`,1.6,4.35,z+.95,level,'dimension');
   // Which face of a tread carries its riser: the side the step below it comes from. The two
   // flights are read off the flight lines; the S-going starter treads belong to no flight and
   // step west, so their risers face east.
   const flights=stairFlights(level);
   const riserFace=step=>{
    const f=flights.find(f=>step.box[0]>=f.x[0]-1e-6&&step.box[2]<=f.x[1]+1e-6
     &&step.box[1]>=Math.min(f.a[0],f.b[0])-1e-6&&step.box[3]<=Math.max(f.a[0],f.b[0])+1e-6);
    return f?(f.b[0]>f.a[0]?1:3):2;
   };
   // Solid concrete step over the waist, then the stone tread; landings are cast above. The 20 mm
   // stone finish wraps from the tread down on to the riser below it, so the concrete step is set
   // back by that thickness on the riser face - exactly as it already sits one finish below the
   // tread. Without the set-back the plate and the step shared an outer face, and the two coplanar
   // surfaces speckled across every riser in the interior views.
   for(const step of steps){
    if(step.landing)continue;
    const b=step.box,top=z+step.height;
    // Each solid step is buried one finish thickness into the waist below it, so the flight
    // reads as one casting with no gap between the steps and the slab.
    if(!step.arrival){
     const k=riserFace(step),cb=[...b];cb[k]+=k===1?FIN:-FIN;
     box(structure,...cb,top-rise-FIN,top-FIN,materials.concrete);
     // The riser plate fills that recess, from the step below up to the underside of the tread
     // finish; the tread's own nosing face carries the last 20 mm.
     const pb=[...b];
     if(k===1)pb[3]=b[1]+FIN;else if(k===3)pb[1]=b[3]-FIN;else pb[0]=b[2]-FIN;
     box(stairGroup,...pb,top-rise-FIN,top-FIN,materials.stone);
    }
    box(stairGroup,...b,top-FIN,top,materials.stone);
    line(stairGroup,[[b[0],b[1],top+.002],[b[2],b[1],top+.002]],'#a8ab9b');
   }
   // R9: the upper flight has 4 risers on the ground-to-first stair (landingRiser 12 -> 16) and
   // keeps 7 on the first-to-roof stair (landingRiser 9 -> 16); same tread y-positions either way.
   const upperCount=level==='ground'?4:7;
   // The two risers that land on something other than a tread: the last of the lower flight, which
   // finishes against the landing recessed for it above, and the top riser on to the arrival floor.
   const lowerEnd=level==='ground'?4.7:5.2,lastLowerRiser=level==='ground'?11:8;
   box(stairGroup,.15,lowerEnd,1.05,lowerEnd+FIN,z+lastLowerRiser*rise-FIN,z+(lastLowerRiser+1)*rise-FIN,materials.stone);
   const trimmerY=level==='ground'?4.2:3.45;
   box(stairGroup,1.15,trimmerY-FIN,2.05,trimmerY,z+16*rise-FIN,z+17*rise-FIN,materials.stone);
   const lowerStart=3.2,lowerFirst=level==='ground'?6:1;
   rod(stairGroup,[1.07,lowerStart,z+lowerFirst*rise+.9],[1.07,lowerEnd,z+landingRiser*rise+.9],.019,materials.dark);
   for(let i=0;i<(level==='ground'?6:8);i++)rod(stairGroup,[1.07,3.3+i*.25,z+(lowerFirst+i)*rise],[1.07,3.3+i*.25,z+(lowerFirst+i)*rise+.9],.012,materials.dark);
   if(level==='ground'){
    rod(stairGroup,[1.30,3.21,z+4*rise+.9],[1.05,3.21,z+5*rise+.9],.019,materials.dark);
    rail(stairGroup,1.07,4.7,1.07,5.2,z+landingRiser*rise,.9);
   }
   rod(stairGroup,[1.13,5.2,z+(landingRiser+1)*rise+.9],[1.13,trimmerY,z+3.9],.019,materials.dark);
   for(let i=0;i<upperCount;i++)rod(stairGroup,[1.13,5.07-i*.25,z+(landingRiser+1+i)*rise],[1.13,5.07-i*.25,z+(landingRiser+1+i)*rise+.9],.012,materials.dark);
   rail(stairGroup,1.06,5.2,1.14,5.2,z+landingRiser*rise,.9);
   // The east edge of the upper flight is only an open edge if the stair-side partition is taken
   // out full height. Under the coordinated R10 opening it is not: the wall stands from the +2.10 m
   // head to the 2.85 m slab soffit, and the flight's tread tops run +2.29 to +2.82 m, so the wall
   // encloses the walking zone and there is nothing to guard. The balustrade is therefore drawn
   // only if the opening is ever raised to full height - which is a separate verification, not a
   // data edit - and revision.tv.balustrade keeps the coordinates it would be built to.
   if(level==='ground'&&revision.tv.wallOpening.height>=2.8){
    const b=revision.tv.balustrade,bx=b.x-.02;
    rod(stairGroup,[bx,b.y[1],z+(landingRiser+1)*rise+b.height],[bx,b.y[0],z+3.9],.019,materials.noir);
    for(let i=0;i<upperCount;i++)rod(stairGroup,[bx,5.07-i*.25,z+(landingRiser+1+i)*rise],[bx,5.07-i*.25,z+(landingRiser+1+i)*rise+b.height],.012,materials.noir);
   }
   // Front and rear corner piers came directly from the wall commands.
   furniture(g,level,z);
   if(level==='first'){rail(g,3.15,0,5.85,0,z,1.1,true);rail(g,5.93,0,5.93,1.2,z,1.1,true);rail(g,3.15,9.63,5.85,9.63,z,1.1);}
   const facade=new THREE.Group();g.add(facade);facades.push({group:facade,level});
   // Front finishes are split around the scheduled window so they never seal its aperture.
   const o=openingsFor(level).find(o=>o.x===.6&&o.axis==='h');
   for(const b of [[.15,.60,0,2.85],[2.30,3.05,0,2.85],[.60,2.30,0,o.sill],[.60,2.30,o.sill+o.height,2.85]]){
    const [a,bx,low,high]=b;if(level==='ground')cladding(facade,a,-.003,bx,0,z+low,z+high);else box(facade,a,-.003,bx,0,z+low,z+high,materials.dark);
   }
   if(level==='ground'){
    facade.add(facadeBand('ground',materials.dark));
    // Entry break in frame is kept clear by placing its sill above ground only outside the entry width.
   }else{
    facade.add(facadeBand('first',materials.dark));
    cladding(facade,3.13,.13,5.56,.30,5.87,6.1);
    box(facade,.55,-.005,2.94,0,3.75,4.20,materials.wall);
    // Rear canopy is an open-bottom return; the drying balcony remains open.
    const pts=[[.44,6.14],[.24,5.94],[.24,3.52]];
    box(facade,.04,9.70,.24,9.80,3.52,5.94,materials.dark);
    box(facade,.24,9.70,4.76,9.80,6.14,6.37,materials.dark);
    box(facade,4.87,9.70,5.06,9.80,5.60,5.94,materials.dark);
    const arc=(cx,cz,rr,start,end)=>{const ps=[];for(let i=0;i<=16;i++){const a=start+(end-start)*i/16;ps.push(new THREE.Vector3(cx-3+rr*Math.cos(a),cz+rr*Math.sin(a),4.85-9.75));}const curve=new THREE.CatmullRomCurve3(ps);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,16,.11,8,false),materials.dark);facade.add(mesh);};
    arc(.44,5.94,.30,Math.PI,Math.PI/2);arc(4.76,5.94,.30,Math.PI/2,0);
    cladding(facade,.22,9.70,3.05,9.703,3.52,6.12);
    cladding(facade,3.05,9.48,4.97,9.65,5.88,6.12);
   }
   // Exterior stairs reach the stated +0.45 m in three equal rises.
   if(level==='ground')for(let i=0;i<3;i++){box(g,3.25,-.84+i*.28,5.65,0,i*.15,(i+1)*.15,materials.stone);box(g,4.6,9.7,5.7,10.54-i*.28,i*.15,(i+1)*.15,materials.stone);}
  }else{
   furniture(g,level,z);
   for(const [x0,y0,x1,y1] of [[.025,.025,5.975,.025],[5.975,.025,5.975,9.675],[5.975,9.675,.025,9.675],[.025,9.675,.025,.025]])rail(g,x0,y0,x1,y1,z,1.1);
   rail(g,.15,3.2,1.05,3.2,z,1.1);
   const cover=new THREE.Group();g.add(cover);cover.name='cover';box(cover,0,2.15,2.2,6.25,8.85,9,materials.wall);box(cover,0,2.15,2.2,6.25,8.955,9,materials.dark);
   const roofFinish=new THREE.Group();g.add(roofFinish);facades.push({group:roofFinish,level});
   for(const y of [2.147,6.25])for(const b of [[0,.55,6.45,8.85],[1.45,2.2,6.45,8.85],[.55,1.45,6.45,7.95],[.55,1.45,8.4,8.85]])cladding(roofFinish,b[0],y,b[1],y+.003,b[2],b[3],true);
   for(const [y,x1] of [[.025,3.4],[9.525,3.6]]){cladding(g,.05,y,x1-.05,y+.15,6.45,7.2,true);box(g,0,y,x1,y+.15,7.2,7.4,materials.dark);box(g,.04,y-.003,x1-.04,y+.154,7.2,7.28,materials.wall);}
   for(const pts of [[[1,7.2,6.47],[2.8,6.55,6.47]],[[3.45,8.9,6.47],[4.9,4.5,6.47]],[[3.5,4.7,6.47],[5.65,.55,6.47]],[[.8,1.7,6.47],[4.7,.55,6.47]]]){line(roofDimensions,pts,'#6799a0');const a=V(pts[0][0],pts[0][2],pts[0][1]),b=V(pts[1][0],pts[1][2],pts[1][1]);roofDimensions.add(new THREE.ArrowHelper(b.clone().sub(a).normalize(),a,a.distanceTo(b),'#6799a0',.17,.1));}
   line(g,[[.35,7.5,z+.02],[1.8,7.5,z+.02],[1.8,9.05,z+.02],[.35,9.05,z+.02],[.35,7.5,z+.02]],'#8e9d80',true);
   line(g,[[2.2,2.3,z+.02],[3.3,2.3,z+.02],[3.3,3.45,z+.02],[2.2,3.45,z+.02]],'#819e7c',true);
   cylinder(g,5.62,.45,z,z+.025,.10,materials.dark);rod(g,[5.75,1.05,z+.10],[6.12,1.05,z+.10],.035,materials.metal);
   label('Roof outlet','Indicative',5.55,.5,z+.25,'roof','dimension');label('Overflow','Route to coordinate',5.9,1.05,z+.5,'roof','dimension');
  }
 }
 const arrivalStair=levels.first.getObjectByName('stairs').clone(true);arrivalStair.name='roof-arrival-stair';arrivalStair.visible=false;levels.roof.add(arrivalStair);
 // R7: one coordinated conceptual framing option for the whole house, on its own layer and off by
 // default. Columns stand inside wall lines and piers that already exist; beams run on the grid and
 // hang under the 150 mm floor slabs. Footprints and depths are indicative massing, never a design.
 const structuralFrame=new THREE.Group();root.add(structuralFrame);
 structuralFrame.name='Conceptual structural frame - COLUMN AND BEAM SIZES, SLABS, REINFORCEMENT, FOUNDATIONS AND CONNECTIONS TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER';
 structuralFrame.visible=false;
 {
  const enclosure=[0,2.15,2.2,6.25];
  const within=c=>c.x>=enclosure[0]&&c.x<=enclosure[2]&&c.y>=enclosure[1]&&c.y<=enclosure[3];
  const columns=new THREE.Group();structuralFrame.add(columns);columns.name='Column zones (indicative footprint)';
  for(const c of FRAME.columns){
   // Only the two columns inside the roof-enclosure footprint continue past the roof slab.
   const o=box(columns,...c.box,0,within(c)?9:LEVELS.roof,materials.concrete);
   if(o)o.userData.member=c;
  }
  const beams=new THREE.Group();structuralFrame.add(beams);beams.name='Beam lines and floor-slab trimmers (indicative depth)';
  const zFor={first:[LEVELS.first],roof:[LEVELS.roof]};
  for(const b of [...FRAME.beams,...FRAME.trimmers])for(const z of b.level?zFor[b.level]:[LEVELS.first,LEVELS.roof]){
   const o=box(beams,...b.box,z-FRAME.slab-FRAME.indicativeBeam,z-FRAME.slab,materials.concrete);
   if(o)o.userData.member=b;
  }
  label('Structural grid',`${FRAME.columns.length} column zones on A/B/C x 1-6 - ${FRAME.status}`,3,4.85,LEVELS.first+.6,null,'dimension');
  label('Longest beam span',`${FRAME.beams.reduce((m,b)=>Math.max(m,b.span),0).toFixed(2)} m, grid C - size to be designed`,5.925,6.15,LEVELS.first+.6,null,'dimension');
 }
 const site=new THREE.Group();root.add(site);
 box(site,-2.7,-3,7,13.8,-.26,-.02,materials.grass);box(site,-2.7,-3,0,13.8,-.01,.0,materials.pave);box(site,6,-3,7,13.8,-.01,.0,materials.pave);box(site,3.25,-3,4.4,-.84,0,.012,materials.pave);
 box(site,-3.2,-6.6,7.5,-3,-.1,-.015,materials.stone);
 line(site,[[-3.2,-4.8,.0],[7.5,-4.8,.0]],'#f2f0df',true);
 // Boundary height is diagrammatic; gate gaps match the nominal site sheet.
 for(const b of [[-2.7,-3,-2.6,13.8],[-2.7,13.7,7,13.8],[6.9,-3,7,13.8],[-.05,-3,3.25,-2.9],[4.4,-3,7,-2.9]])box(site,...b,0,.40,materials.stone);
 for(const x of [-2.65,-.05,3.25,4.4])box(site,x,-3,x+.10,-2.9,0,.8,materials.wall);
 line(site,[[-2.6,.7,.025],[-.1,.7,.025],[-.1,5.7,.025],[-2.6,5.7,.025],[-2.6,.7,.025]],'#829175',true);
 const car=new THREE.Group();site.add(car);car.name='Indicative 1.75 × 4.20 m compact car';
 box(car,-2.05,1.1,-.3,5.3,.28,.72,materials.white);box(car,-1.93,2.25,-.42,4.0,.72,1.2,materials.dark);box(car,-1.86,2.40,-.49,3.85,1.20,1.28,materials.white);
 for(const x of [-2.02,-.33])for(const y of [1.88,4.55]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.13,20),materials.dark);wheel.rotation.z=Math.PI/2;wheel.position.copy(V(x,.3,y));car.add(wheel);}
 for(const x of [-1.84,-.72])box(car,x,1.09,x+.3,1.105,.48,.61,materials.linen);
 cylinder(site,6.5,-1.7,0,.50,.28,materials.stone);cylinder(site,6.5,-1.7,.50,.51,.21,materials.dark);
 line(site,[[6.15,10.3,.02],[6.85,10.3,.02],[6.85,11.3,.02],[6.15,11.3,.02],[6.15,10.3,.02]],'#859581',true);
 // Lightweight planting outside the nominal walking and parking strips.
 for(const [x,y,r] of [[.7,12.8,.53],[2.9,12.9,.6],[5.1,12.8,.50],[.4,-1.9,.35],[5.3,-1.85,.33]]){cylinder(site,x,y,0,.23,r*.72,materials.soil);const shrub=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),materials.green);shrub.position.copy(V(x,.45,y));shrub.scale.y=.8;shrub.castShadow=true;site.add(shrub);}
 function dim(a,b,text,detail,level=null){const dg=level==='roof'?roofDimensions:siteDimensions;line(dg,[a,b],'#698975');for(const p of [a,b])line(dg,[[p[0]-.09,p[1]-.09,p[2]],[p[0]+.09,p[1]+.09,p[2]]],'#698975');label(text,detail,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2+.10,level,'dimension');}
 dim([-.07,-1.05,.06],[6,-1.05,.06],'6.07 m','Ground width (220 mm walls)');dim([6.4,0,.08],[6.4,9.77,.08],'9.77 m','Ground depth (220 mm walls)');dim([-2.7,8,.05],[-.07,8,.05],'2.63 m','South parking strip');dim([6,7,.05],[7,7,.05],'1.00 m','North path');dim([2,-3,.05],[2,0,.05],'3.00 m','Front yard');dim([4,9.77,.06],[4,13.8,.06],'4.03 m','Rear garden');
 dim([-.35,0,6.55],[-.35,2.15,6.55],'2.15 m','Front roof setback','roof');dim([-.35,6.25,6.55],[-.35,9.7,6.55],'3.45 m','Rear roof setback','roof');
 label('Well','Indicative position',6.5,-1.7,.75,null,'dimension');label('Septic reserve','Indicative position',6.5,10.8,.25,null,'dimension');label('East · private road','3.60 m nominal',2,-5,.1,null,'dimension');label('Compact parking','2.50 × 5.00 m · turning unverified',-1.4,6.3,.1,null,'dimension');
 return {root,levels,pickables,labels,wallMaterials,furnitureGroups,facades,dimensions,siteDimensions,roofDimensions,arrivalStair,structuralFrame,site,materials,V,counts:{walls:Object.fromEntries(Object.keys(LEVELS).map(l=>[l,wallPieces(l).length])),openings:Object.fromEntries(Object.keys(LEVELS).map(l=>[l,openingsFor(l).length]))}};
}

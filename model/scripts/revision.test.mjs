import test from 'node:test';
import fixedArchitecture from '../revisions/r2-architecture.json' with {type:'json'};
import assert from 'node:assert/strict';
import {wallPieces,openingsFor,stairTreads,stairLandingExtensions,rooms,plan,STAIR_STRUCTURE,STAIR_BEAM_ZONES,stairBeamZones,stairFlights,stairLandingSlabs,stairSoffit,FRAME,frameColumns,frameBeams,frameTrimmers,ENVELOPE,EXTERNAL_WALL} from '../src/geometry.js';
import * as baseline from '../revisions/baseline-v4/geometry.js';
import {revision,storageWallOpenings} from '../src/revision.js';
import {stairOptions,optionTreads,modeledHeadroom} from '../src/stair-options.js';
import {facadeProfiles,profilePoints,facadeBand} from '../src/facade.js';
import {MeshBasicMaterial,Raycaster,Vector3} from 'three';
import {createHouse} from '../src/house.js';
import {LEVELS} from '../src/geometry.js';
const eps=1e-8,near=(a,b)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const overlaps=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>eps&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>eps;
const FIXTURE_ROOMS=['g-wash','g-media'];
const R=3/17,WALL=revision.bedroomWallFace;
const sameBox=(a,b)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<eps);
// R8: ground external walls 150 -> 220 mm. West and rear grew outward into the parking strip and
// the garden; east and front thickened inward so the 1.00 m path and 3.00 m yard keep their
// setbacks. Every inner face is unmoved, which is why the stair and under-stair unit are intact.
// Ground walls went 150 -> 220, first-floor walls 150 -> 170. The roof enclosure is untouched.
const GROW={ground:.07,first:.02,roof:0};
function r8Box(b,level='ground'){
 const G=GROW[level],n=[...b];
 if(Math.abs(n[0])<eps&&Math.abs(n[2]-.15)<eps)n[0]=-G;            // west band grew outward
 if(Math.abs(n[0]-5.85)<eps&&Math.abs(n[2]-6)<eps)n[0]=5.85-G;     // east band thickened inward
 if(Math.abs(n[1])<eps&&Math.abs(n[3]-.15)<eps)n[3]=.15+G;         // front band thickened inward
 if(Math.abs(n[3]-9.7)<eps)n[3]=9.7+G;                             // anything meeting the rear face
 return n;
}
const r8Opening=(o,level='ground')=>{
 const G=GROW[level],n={...o};
 if(o.axis==='v'&&Math.abs(o.x)<eps){n.x=-G;n.t=.15+G;}
 if(o.axis==='h'&&(Math.abs(o.y)<eps||Math.abs(o.y-9.55)<eps))n.t=.15+G;
 n.box=n.axis==='h'?[n.x,n.y,n.x+n.w,n.y+n.t]:[n.x,n.y,n.x+n.t,n.y+n.w];
 return n;
};
// Ground rooms bounded by an inner face that moved: the east face came in 70 mm and the rear
// envelope went out 70 mm. Rooms on the west and rear inner faces, and every first-floor room,
// are untouched - which is why the stair and the under-stair unit needed no rework.
function r8Room(id,box){
 const G=GROW[{g:'ground',f:'first',r:'roof'}[id[0]]]??0,n=[...box];
 if(Math.abs(n[2]-5.85)<eps)n[2]=5.85-G;
 if(Math.abs(n[1]-.15)<eps)n[1]=.15+G;
 if(Math.abs(n[3]-9.7)<eps)n[3]=9.7+G;
 return n;
}
const samePiece=(a,b,level='ground')=>sameBox(a.box,r8Box(b.box,level))&&Math.abs(a.bottom-b.bottom)<eps&&Math.abs(a.top-b.top)<eps;
const sameOpening=(a,b,level='ground')=>{const e=r8Opening(b,level);return Object.keys(e).every(k=>Array.isArray(e[k])?sameBox(a[k],e[k]):(typeof e[k]==='number'?Math.abs(a[k]-e[k])<eps:a[k]===e[k]));};

// R6: clear height under the conceptual RCC waist/landing soffit, replacing the superseded
// flat 120 mm lid under each separate tread. Infinity when nothing is overhead.
const clearance=box=>stairSoffit(box,'ground');
const cm=box=>Math.round(clearance(box)*100)/100;
test('all door/window positions and all first/roof walls are unchanged',()=>{
 for(const l of ['ground','first','roof']){
  const fixtures=a=>a.filter(o=>!['opening','joinery'].includes(o.kind));
  const now=fixtures(openingsFor(l)),was=fixtures(baseline.openingsFor(l));
  assert.equal(now.length,was.length,l);
  // Every aperture keeps its width, sill, height, kind and position along its wall. On the ground
  // floor the external ones are simply 70 mm thicker and sit in the repositioned wall band.
  now.forEach((a,i)=>assert.ok(sameOpening(a,was[i],l),`${l} aperture ${i}`));
  if(l!=='ground'){const nw=wallPieces(l),bw=baseline.wallPieces(l);
   assert.equal(nw.length,bw.length,l);
   nw.forEach((p,i)=>assert.ok(samePiece(p,bw[i],l),`${l} wall ${i}`));}
 }
 // R9 is the first revision to change ground riser geometry; first/roof keep the original baseline.
 assert.deepEqual(stairTreads('first'),baseline.stairTreads());
 for(const r of rooms.filter(r=>r.id!=='g-living'&&!FIXTURE_ROOMS.includes(r.id)))assert.ok(sameBox(r.box,r8Room(r.id,baseline.rooms.find(b=>b.id===r.id).box)),r.id);
});
test('passage partition removed only in the requested ground living/stair interval',()=>{
 const pieces=wallPieces('ground');assert.ok(!pieces.some(p=>overlaps(p.box,[3.05,2.3,3.15,6.1])));
 assert.ok(pieces.some(p=>overlaps(p.box,[3.05,6.1,3.15,6.4])));
 assert.ok(pieces.some(p=>overlaps(p.box,[3.05,0,3.15,1.2])));
});
test('R2 stair, landing, wall, opening and room boundary preserved on first/roof; ground basin gets a direct archway, no free-standing sliver',()=>{
 for(const l of ['first','roof']){
  const walls=wallPieces(l),openings=openingsFor(l);
  assert.deepEqual(stairTreads(l),fixedArchitecture[l].stairs);assert.deepEqual(stairLandingExtensions(l),fixedArchitecture[l].landings);
  assert.equal(walls.length,fixedArchitecture[l].walls.length,l);
  walls.forEach((p,i)=>assert.ok(samePiece(p,fixedArchitecture[l].walls[i],l),`${l} wall ${i}`));
  assert.equal(openings.length,fixedArchitecture[l].openings.length,l);
  openings.forEach((a,i)=>assert.ok(sameOpening(a,fixedArchitecture[l].openings[i],l),`${l} opening ${i}`));
 }
 // R9 gave the basin a direct 0.90 m archway at the old store-door position (y = 5.2-6.1), with
 // no door leaves. R10 cuts the one remaining solid span of the same 100 mm stair-side partition,
 // y = 3.2-5.2, to a headed opening and puts the TV unit in it. Both apertures are joinery, so no
 // door or window count changes.
 const walls=wallPieces('ground'),openings=openingsFor('ground');
 assert.equal(storageWallOpenings.length,2);
 for(const o of storageWallOpenings)assert.ok(!('storeDoor' in o));
 const [unit,archway]=storageWallOpenings;
 assert.deepEqual(unit.box,[2.05,3.2,2.15,5.2]);
 assert.deepEqual(archway.box,[2.05,5.2,2.15,6.1]);
 assert.deepEqual(openings.filter(o=>o.kind==='joinery'),storageWallOpenings);
 assert.ok(!walls.some(p=>p.box[3]-p.box[1]<.06&&p.top-p.bottom>2.8),'no free-standing partition sliver');
 for(const o of storageWallOpenings)assert.ok(!walls.some(p=>overlaps(p.box,o.box)&&p.bottom===0&&p.top-p.bottom>1.9),'joinery apertures are open at walking height');
 // The opening over the unit is headed, not full height: the partition is cut away to +2.10 m and
 // the wall above it is retained as a plastered header to the 2.85 m slab soffit. This is the
 // coordinated R10 condition, it is what sheet 11 and structural-frame.json are drawn to, and no
 // revision may quietly widen it to a full-height removal - that needs separate verification.
 const header=revision.tv.wallOpening.header;
 near(unit.height,2.1);near(revision.tv.wallOpening.headerTop,2.85);
 assert.deepEqual(header.z,[unit.height,revision.tv.wallOpening.headerTop]);
 assert.ok(header.z[1]-header.z[0]>.7,'the retained header must be the coordinated 0.75 m zone');
 const over=walls.filter(p=>overlaps(p.box,unit.box));
 assert.equal(over.length,1,'exactly one piece of wall - the header - stands over the unit');
 near(over[0].bottom,unit.height);near(over[0].top,revision.tv.wallOpening.headerTop);
 assert.match(revision.demolitionStatus,/not assumed and must not be inferred/i);
 // Because that header stands from +2.10 m to the slab, the east side of the upper flight is
 // enclosed over its whole walking zone and no guard is required or drawn. The balustrade keeps
 // its coordinates only as the guard a verified full-height opening would need.
 const b=revision.tv.balustrade;near(b.x,2.05);assert.deepEqual(b.y,[4.2,5.2]);assert.ok(b.height>=.9);
 assert.equal(b.required,false);
 const treadTops=stairTreads('ground').filter(t=>t.box[0]>=1.15&&!t.landing&&!t.arrival).map(t=>t.height);
 assert.ok(Math.max(...treadTops)<revision.tv.wallOpening.headerTop,'the header must enclose the flight it replaces a guard for');
 assert.ok(b.y[0]>=revision.stair.trimmerY-eps&&b.y[1]<=unit.box[3]+eps);
 const boundaries=rooms.filter(r=>!FIXTURE_ROOMS.includes(r.id)).map(r=>({id:r.id,box:r.box,...(r.regions?{regions:r.regions}:{})}));
 assert.equal(boundaries.length,fixedArchitecture.rooms.length);
 boundaries.forEach((r,i)=>{
  const e=fixedArchitecture.rooms[i];assert.equal(r.id,e.id);
  assert.ok(sameBox(r.box,r8Room(e.id,e.box)),r.id);
  if(e.regions)r.regions.forEach((g,j)=>assert.ok(sameBox(g,r8Room(e.id,e.regions[j])),r.id+' region '+j));
 });
});
test('R9 removes the small under-flight cabinet and the under-landing store entirely',()=>{
 assert.ok(!('storage' in revision));assert.ok(!('store' in revision));assert.ok(!('partition' in revision));assert.ok(!('closingPanel' in revision));
});
test('R13 fits the reference composition into the real under-stair volume',()=>{
 const t=revision.tv,old=revision.oldSlopedStorageFootprint;
 // The approved screen centreline is unmoved since R5. The face itself grows to a 55-inch
 // 1.23 x 0.72 m panel and drops to centre +1.02 m so it sits just over the low cabinet.
 near((t.box[1]+t.box[3])/2,3.88);near(t.screenCenter,3.88);near(t.oldStorageCenter,4.125);
 near((t.screenTop+t.screenBottom)/2,t.screen.centerHeight);
 near(t.box[3]-t.box[1],t.screen.width);near(t.screenTop-t.screenBottom,t.screen.height);
 assert.ok(t.box[0]>old[2]);
 // The R10 wedge is gone: no bays, no niche, no full-height carcass.
 for(const k of ['bays','niche','nicheDepth','nicheTop','nicheBottom','serviceVoidNote2','flutedSlats'])
  assert.ok(!(k in t),`R10 key ${k} survives in R12`);
 assert.ok(!('foot' in t)&&!('support' in t));
 // Built footprint: the low cabinet only, from the stair entry to the back of the basin user's
 // standing zone, 0.50 m deep. The back 0.50 m of the 1.00 m zone stays an open service void.
 assert.deepEqual(t.unit,t.cabinet.box);
 assert.deepEqual(t.unit,[1.8,3.2,2.15,5.15]);
 near(t.unit[2]-t.unit[0],t.unitDepth);near(t.unit[3]-t.unit[1],t.unitLength);
 near(t.unit[3],revision.wash.standing[1]);
 assert.deepEqual(t.serviceVoid,[t.zone[0],t.unit[1],t.unit[0],t.unit[3]]);
 near(t.serviceVoid[2]-t.serviceVoid[0]+t.unitDepth,t.zone[2]-t.zone[0]);
 // Nothing passes the living wall line, so the 1.00 m passage is untouched. Face elements are
 // flush on it; the screen is 0.17 m behind it and the backing panel 0.22 m behind it.
 near(t.projection.intoPassage,0);near(t.faceX,2.15);
 for(const box of [t.unit,t.panel,t.screen.box,t.endReturn,...t.shelves.map(sh=>sh.x),...t.cubbies.map(c=>c.x)])
  assert.ok(Math.max(box[2]??box[1],box[0])<=t.faceX+eps,'nothing projects past the living wall line');
 near(t.box[2],t.faceX-t.projection.screenSetback);
 near(t.panel[2],t.faceX-t.projection.panelSetback);
 near(t.panel[2]-t.panel[0],t.panelThickness);
 // The panel's top edge follows the real raking soffit with a constant 60 mm shadow gap, and
 // levels off at the cap under the flat slab. 4 risers over 1.00 m is the fall of that soffit.
 const RAKE=4*R,top=y=>Math.min(t.panelTopCap,t.panelTopCap-(y-t.panelBreakY)*RAKE);
 for(const y of [4.3,4.5,4.74,5.0,t.panel[3]]){
  const soffit=stairSoffit([t.panel[0],y-.001,t.panel[2],y+.001],'ground');
  assert.ok(Math.abs(soffit-top(y)-t.panelSoffitGap)<.01,`panel top at y=${y} is ${top(y)} under a ${soffit} soffit`);
 }
 near(top(t.panelBreakY),t.panelTopCap);
 assert.ok(Math.abs(top(t.panel[3])-t.panelTopAt['5.15'])<.001);
 // The cap clears the slab trimmer zone over y = 3.95-4.20, whose soffit is about 2.70 m.
 assert.ok(t.clearances.underTrimmer-t.panelTopCap>=.1);
 // The composition tapers: the panel is at least 0.6 m lower at the archway jamb than at the
 // stair entry, so it reads as fitted into the triangle, not as a flat slab across the opening.
 assert.ok(top(t.panel[1])-top(t.panel[3])>.6,'the panel must rake, not run flat');
 // The backing surrounds the complete smaller screen, with modest clearances rather than a tower.
 assert.ok(t.screen.box[1]>=t.panel[1]&&t.screen.box[3]<=t.panel[3]);
 assert.ok(t.screenTop+.04<=top(t.screen.box[3]));
 assert.ok(t.panelTopCap-t.screenTop<=.20);
 assert.ok(t.panelTopCap<1.5&&t.panelSoffitGap>1.0);
 // Every element clears the structure over it, and nothing touches the stair itself.
 const boxes=[[...t.unit,t.cabinet.top],[...t.screen.box,t.screenTop],[...t.endReturn,t.endReturnTop],
  ...t.shelves.map(sh=>[sh.x[0],sh.y[0],sh.x[1],sh.y[1],sh.top]),
  ...t.cubbies.map(c=>[c.x[0],c.y[0],c.x[1],c.y[1],c.z[1]])];
 for(const b of boxes){
  const soffit=Math.min(stairSoffit(b.slice(0,4),'ground'),2.85);
  assert.ok(b[4]<soffit,`${b} does not clear its soffit ${soffit}`);
 }
 // The open boxes stay under the raking panel edge above them.
 for(const c of t.cubbies)assert.ok(c.z[1]<top(c.y[1])-eps,`${c.id} pokes through the panel edge`);
 // The composition never reaches the basin, its standing zone, or the stair entry band.
 for(const b of [t.unit,t.panel,t.screen.box])
  assert.ok(!overlaps(b,revision.wash.box)&&!overlaps(b,revision.wash.standing)&&!overlaps(b,[1.05,2.3,2.15,3.2]));
 // Storage is honestly reduced: thin and furniture-like cannot also be deep storage.
 assert.ok(t.storage.volume_m3>.15&&t.storage.volume_m3<.25);
 assert.match(t.storage.note,/3\.5 m3|elsewhere/);
 assert.equal(t.referenceDeviations.length,4);
 // The wall is the largest departure from the reference and it is recorded as a structural one.
 assert.ok(t.referenceDeviations.some(d=>/not removed full height/.test(d)));
});
test('R13 is joinery, not massing, and nothing is built under the lower/west flight',()=>{
 const t=revision.tv,j=t.joinery,cab=t.cabinet;
 // Only one element runs full height: the 50 mm oak jamb lining the basin archway reveal.
 // Everything else is furniture - a 0.45 m cabinet, floating shelves and open boxes lifted off it.
 const parts=[{id:'cabinet',z:[0,cab.top]},...t.shelves.map(sh=>({id:sh.id,z:[sh.top-sh.thickness,sh.top]})),
  ...t.cubbies.map(c=>({id:c.id,z:c.z}))];
 for(const e of parts){
  assert.ok(e.z[1]<=2.1,`${e.id} stands as tall as the withdrawn R10 wedge`);
  assert.ok(e.z[1]-e.z[0]<=cab.top+eps,`${e.id} is a tall carcass, not a piece of furniture`);
  assert.ok(e.z[0]===0?e.id==='cabinet':true,`${e.id} must be lifted off the floor`);
 }
 assert.deepEqual(t.endReturn,[2.05,t.unit[3],2.15,t.wallOpening.box[3]]);
 near(t.endReturnTop,0);assert.equal(t.shelves.length,0);assert.ok(t.panelTopCap<=1.40);near(t.endReturn[2]-t.endReturn[0],.1);near(t.endReturn[3]-t.endReturn[1],.05);
 // The low cabinet is long and low, on a recessed lit plinth, with reveals between its fronts.
 near(cab.top,.45);near(cab.depth,.35);near(cab.length,1.95);
 near(cab.frontWidth*cab.fronts,cab.length);
 assert.ok(cab.plinth>0&&cab.plinthSetback>0&&cab.reveal>0&&j.panelThickness>0);
 assert.ok(cab.top<t.screenBottom,'the screen sits above the cabinet, not behind it');
 assert.ok(t.screenBottom-cab.top<.3,'the screen sits close over the cabinet, as in the reference');
 // Shelving is at the tall end; the open boxes are in the low end of the wedge, past the screen.
 for(const sh of t.shelves)assert.ok(sh.y[1]<=t.panelBreakY+.01,`${sh.id} must sit at the tall end`);
 for(const c of t.cubbies)assert.ok(c.y[0]>=t.box[3]-eps,`${c.id} must sit past the screen, in the low wedge`);
 assert.ok(t.cubbies[0].z[0]===cab.top,'the open boxes stand on the cabinet top');
 // Three concealed warm sources: plinth, panel top and behind the screen. No fluted slats.
 assert.deepEqual(Object.keys(t.lighting),['plinth','panelTop','screenBacklight']);
 assert.match(j.flutedNote,/dropped/);
 // The composition sits only under the upper flight and the arrival slab. The lower/west flight,
 // its landing and the landing extension keep clear floor beneath them, as the drawing states.
 const westFlight=[[.15,3.2,1.05,4.7],revision.stair.landingExtension,[.15,2.3,1.05,3.2]];
 for(const w of westFlight)for(const b of [t.unit,t.panel,t.screen.box,t.serviceVoid])assert.ok(!overlaps(b,w));
 assert.ok(t.zone[0]>=1.15-eps&&t.unit[0]>=t.zone[0]-eps&&t.panel[0]>=t.zone[0]-eps);
});
test('basin sits against the bedroom wall, facing it, under the raised landing',()=>{
 const w=revision.wash;
 near(w.box[2]-w.box[0],.5);near(w.box[3]-w.box[1],.35);near(w.box[3],WALL);
 near(WALL-w.box[3],w.fromBedroomWall.basinBack);near(WALL-w.box[1],w.fromBedroomWall.basinFront);near(WALL-w.standing[1],w.fromBedroomWall.standingRear);
 near(w.fromBedroomWall.basinBack,0);near(w.fromBedroomWall.basinFront,.35);
 near(w.standing[3],w.box[1]); // standing zone starts at the basin front
 near(w.box[2],2.05);
 // R12: the vanity and the TV joinery are separate units that never meet in plan.
 for(const b of [revision.tv.unit,revision.tv.panel,revision.tv.screen.box,revision.tv.endReturn])assert.ok(!overlaps(w.box,b));
 assert.ok(w.box[1]>=revision.tv.unit[3]-eps,'the unit stops at the archway jamb, clear of the basin');
 near(w.standing[2]-w.standing[0],.75);near(w.standing[3]-w.standing[1],.6);
 const ch=w.clearHeights;
 near(cm(w.box),ch.overBowl);near(cm(w.standing),ch.standing);
 // R9: the basin sits entirely under the flat landing slab raised to riser 12, so clear height
 // is a near-uniform ~1.90-1.95 m, well above R6's 1.73 m at this position and close to (but
 // still short of) the 2.20 m benchmark used elsewhere in this design.
 assert.ok(clearance(w.box)>=1.85&&clearance(w.box)<revision.headroomBenchmark);
 assert.ok(clearance(w.standing)>=1.85&&clearance(w.standing)<revision.headroomBenchmark);
 assert.ok(w.mirror.z[1]<=1.85);assert.ok(w.mirror.x[0]>=w.box[0]&&w.mirror.x[1]<=w.box[2]);
 for(const b of [w.box,w.standing]){assert.ok(b[0]>=1.15&&b[2]<=2.05&&b[1]>=2.3&&b[3]<=6.1);assert.ok(!overlaps(b,[1.3,2.3,2.2,3.2]));}
 for(const b of [w.box,revision.tv.box,revision.tv.panel,revision.tv.unit])assert.ok(!overlaps(w.bedroomDoorLanding,b));
 assert.ok(!('backPanel' in w)&&!('bedroomReturn' in w));
 assert.equal(rooms.filter(r=>r.id.includes('bath')).length,3);
});
test('basin route passes the stair entry and avoids the TV panel',()=>{
 const t=revision.tv,w=revision.wash,blocks=[t.panel,t.box];
 assert.ok(w.approach[0][0]>2.15); // enters through the open stair-side wall
 for(let i=1;i<w.approach.length;i++){
  const a=w.approach[i-1],b=w.approach[i];
  for(let j=0;j<=20;j++){
   const x=a[0]+(b[0]-a[0])*j/20,y=a[1]+(b[1]-a[1])*j/20;
   for(const o of blocks)assert.ok(!(x>o[0]&&x<o[2]&&y>o[1]&&y<o[3]),`route enters ${o}`);
  }
 }
 const end=w.approach.at(-1);assert.ok(end[0]>w.standing[0]&&end[0]<w.standing[2]&&end[1]>w.standing[1]&&end[1]<w.standing[3]);
});
test('R9 riser shift: starter grows to 5, west flight keeps its tread positions 3 risers higher, upper flight shrinks to 4',()=>{
 const s=stairTreads();
 assert.equal(s.length,17);
 near(revision.stair.kitchenDepth,2.05);
 assert.equal(revision.stair.starterRisers,5);assert.equal(revision.stair.westRisers,7);
 assert.equal(revision.stair.landingRiser,12);assert.equal(revision.stair.upperFlightRisers,4);near(revision.stair.trimmerY,4.2);
 // 4 S-going starter risers, one riser apart, all landing on the y = 2.3-3.2 band.
 for(let i=0;i<4;i++){assert.equal(s[i].direction,'S');near(s[i].height,(i+1)*R);near(s[i].box[1],2.3);near(s[i].box[3],3.2);}
 near(s[0].box[0],s[1].box[2]);near(s[1].box[0],s[2].box[2]);near(s[2].box[0],s[3].box[2]);
 // The turn landing (riser 5) is the same 0.9 x 0.9 corner platform as before, just 3 risers higher.
 assert.ok(s[4].landing);near(s[4].height,5*R);near(s[3].box[0],s[4].box[2]);
 // West flight: same tread positions as R2/R6, renumbered risers 6-12 (was 3-9).
 for(let i=0;i<6;i++){assert.equal(s[5+i].direction,'W');near(s[5+i].height,(6+i)*R);}
 near(s[4].box[3],s[5].box[1]);
 const extension=stairLandingExtensions()[0];
 near(s[10].box[3],extension.box[1]);near(extension.box[3],s[11].box[1]);near(extension.height,s[11].height);near(extension.height,12*R);
 // Intermediate landing at riser 12 (was riser 9); upper flight now 4 risers (13-16) over the
 // same 250 mm going, ending at the new trimmer y = 4.2 (was y = 3.45 over 7 risers).
 assert.ok(s[11].landing);near(s[11].height,12*R);
 for(let i=0;i<4;i++)near(s[12+i].height,(13+i)*R);
 near(s[12].box[1],4.95);near(s[15].box[1],4.2);
 assert.ok(s[16].arrival);near(s[16].height,3);near(s[16].box[3],4.2);
 assert.ok(modeledHeadroom({...revision.stair,starterRisers:2,westRisers:7})>0); // study tool still runs on the R2 baseline shape
});
test('L wardrobe matches existing depth/height and avoids door, window and bed',()=>{
 const w=revision.wardrobe;assert.deepEqual(w.existing,[5.3,2.6,5.85,3.35]);near(w.extension[3]-w.extension[1],w.depth);near(w.height,2.1);
 for(const b of [w.extension,w.filler]){assert.ok(!overlaps(b,[3.25,2.5,4.05,3.3]));assert.ok(!overlaps(b,[5.85,3.5,6,4.8]));assert.ok(!overlaps(b,[3.25,3.9,5.25,5.1]));}
 assert.equal(w.corner,'paired doors with no fixed corner post');
});
test('reference bands are open, asymmetric custom cubic ribbons inside façade width',()=>{
 for(const l of ['ground','first']){
  const p=facadeProfiles[l],pts=profilePoints(l),m=facadeBand(l,new MeshBasicMaterial());
  assert.equal(p.width,.145);assert.ok(p.segments.filter(s=>s[0]==='C').length>=4);assert.ok(pts[0].distanceTo(pts.at(-1))>1);
  m.geometry.computeBoundingBox();const b=m.geometry.boundingBox;assert.ok(b.min.x>=0&&b.max.x<=6);assert.ok(b.max.y<(l==='first'?6.45:3.30));
  for(const v of m.geometry.attributes.position.array)assert.ok(Number.isFinite(v));
 }
 near(facadeProfiles.first.start[1],4.98);assert.equal(facadeProfiles.first.segments.at(-1)[1],3.14);
});
test('stair studies preserve all upper 8 risers and disclose target headroom shortfall',()=>{
 for(const o of stairOptions){const s=optionTreads(o);assert.equal(s.length,17);let last=0;for(const t of s){near(t.height-last,3/17);last=t.height;}assert.deepEqual(s.slice(8),baseline.stairTreads().slice(8));}
 for(const o of stairOptions)near(modeledHeadroom(o),o.minHeadroom);
 assert.ok(stairOptions[0].minHeadroom>2.2);assert.ok(stairOptions[1].minHeadroom<2.2);near(stairOptions[1].kitchenDepth,2.76);
});
test('R6 represents the stair as a continuous RCC waist/landing system carried on existing supports',()=>{
 const S=revision.structure;
 near(S.waist,.15);near(S.landingSlab,.15);near(S.finish,.02);assert.equal(S.indicative,true);
 assert.equal(S.status,'TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER');
 for(const re of [/CONCEPTUAL RCC WAIST-SLAB SYSTEM/,/DESIGNED BY STRUCTURAL ENGINEER/,/100 MM PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING/])assert.match(S.note,re);
 for(const re of [/stringer/i,/cantilever/i,/column/i])assert.ok(S.excluded.some(x=>re.test(x)));
 // Every flight is one unbroken waist between two named bearings; no flight floats.
 for(const l of ['ground','first'])for(const f of stairFlights(l)){
  assert.equal(f.bearing.length,2);
  const risers=Math.abs(f.b[1]-f.a[1])/R;assert.ok(Math.abs(risers-Math.round(risers))<eps,`${l}/${f.id}`);
  near(f.x[1]-f.x[0],.9);
 }
 // The upper flight springs off the intermediate landing; the lower flight's waist dies one riser
 // under it, which is where its last internal corner sits.
 for(const l of ['ground','first']){
  const [lower,upper]=stairFlights(l),landing=stairLandingSlabs(l).find(s=>s.id==='intermediate');
  near(upper.a[1],landing.top);near(landing.top-lower.b[1],R);near(upper.b[1],16*R);
 }
 // The waist top plane runs through the steps' internal corners: over every tread it carries it
 // rises from one riser below that tread to exactly its level, so solid steps sit on it with no
 // gap and the construction depth at each nosing is one riser plus the waist.
 for(const l of ['ground','first'])for(const f of stairFlights(l)){
  const line=y=>f.a[1]+(f.b[1]-f.a[1])*(y-f.a[0])/(f.b[0]-f.a[0]);
  const lo=Math.min(f.a[0],f.b[0]),hi=Math.max(f.a[0],f.b[0]);
  const treads=stairTreads(l).filter(t=>!t.landing&&!t.arrival&&t.box[0]>=f.x[0]-eps&&t.box[2]<=f.x[1]+eps&&t.box[1]>=lo-eps&&t.box[3]<=hi+eps);
  assert.ok(treads.length>=4,`${l}/${f.id} carries ${treads.length} treads`); // R9 ground upper flight carries only 4
  for(const t of treads){
   const ends=[line(t.box[1]),line(t.box[3])].sort((a,b)=>a-b);
   near(ends[1],t.height);near(ends[0],t.height-R);
  }
 }
 // Support zones stay inside walls and slab edges that already exist: no new element in any room,
 // no load on either 100 mm partition, no wall or column below the upper flight.
 // R9 moves the ground stairwell trimmer to y = 4.2; the first-to-roof trimmer stays at 3.2-3.45.
 assert.deepEqual(STAIR_BEAM_ZONES.map(z=>z.box),[[.15,6.1,3.05,6.2],[1.05,3.95,2.05,4.2]]);
 assert.deepEqual(stairBeamZones('first').map(z=>z.box),[[.15,6.1,3.05,6.2],[1.05,3.2,2.05,3.45]]);
 assert.ok(wallPieces('ground').some(p=>p.box[1]===6.1&&p.box[3]===6.2));
 for(const zone of STAIR_BEAM_ZONES){
  assert.ok(!overlaps(zone.box,[2.05,2.3,2.15,6.1]),'no bearing on the stair-side partition');
  assert.ok(!overlaps(zone.box,[3.15,1.35,5.85,6.1]),'nothing new inside the living area');
  for(const b of [revision.wash.box,revision.wash.standing])
   assert.ok(!overlaps(zone.box,b),'support zones must not eat the under-stair unit');
  assert.match(zone.note,/TO BE DESIGNED \/ VERIFIED BY STRUCTURAL ENGINEER/);
 }
 // The waist soffit is an inclined plane and always lower than the superseded flat tread lid.
 assert.ok(STAIR_STRUCTURE.waistVertical>S.supersededTreadZone);
 near(STAIR_STRUCTURE.pitchDeg,Math.atan2(R,.25)*180/Math.PI);
});
test('R9 raises the ground intermediate landing 3 risers above the first-to-roof one, unchanged',()=>{
 assert.deepEqual(stairTreads('first'),fixedArchitecture.first.stairs);
 assert.deepEqual(stairLandingExtensions('first'),fixedArchitecture.first.landings);
 // Landing slabs sit exactly under their own tread tops; walking levels do not move.
 for(const l of ['ground','first'])for(const s of stairLandingSlabs(l)){
  const tread=[...stairTreads(l),...stairLandingExtensions(l)].find(t=>sameBox(t.box,s.box));
  if(tread)near(s.top,tread.height);
 }
 near(stairLandingSlabs('ground').find(s=>s.id==='intermediate').top,stairLandingSlabs('first').find(s=>s.id==='intermediate').top+3*R);
 // Under-stair functions survive with their plan positions intact.
 for(const b of [revision.wash.box,revision.wash.standing,revision.tv.panel,revision.tv.unit,revision.tv.screen.box])assert.ok(b.every(Number.isFinite));
 near(revision.wash.height,.86);near(revision.tv.panelTopCap,1.40);near(revision.tv.cabinet.top,.45);
});
test('every waist slab is seated with its top face on the flight line, under every tread it carries',()=>{
 const house=createHouse(),FIN=STAIR_STRUCTURE.finish;house.root.updateMatrixWorld(true);
 for(const level of ['ground','first']){
  const z=LEVELS[level],group=house.levels[level].getObjectByName('stairs');
  const structure=group.children.find(c=>c.name.startsWith('Conceptual'));
  const slabs=structure.children.filter(m=>m.isMesh&&Math.abs(m.quaternion.x)>1e-9);
  assert.equal(slabs.length,stairFlights(level).length);
  const ray=new Raycaster();
  for(const f of stairFlights(level)){
   const line=y=>f.a[1]+(f.b[1]-f.a[1])*(y-f.a[0])/(f.b[0]-f.a[0]);
   const lo=Math.min(f.a[0],f.b[0]),hi=Math.max(f.a[0],f.b[0]),x=(f.x[0]+f.x[1])/2;
   for(let t=.1;t<=.9;t+=.2){
    const y=lo+(hi-lo)*t;
    ray.set(house.V(x,z+4,y),new Vector3(0,-1,0));
    const hits=ray.intersectObjects(slabs,false);
    assert.ok(hits.length,`${level}/${f.id} no waist slab over y=${y.toFixed(2)}`);
    // Top of the waist is the internal-corner line less the stone finish; the soffit follows below.
    near(Math.round((hits[0].point.y-z)*1e6)/1e6,Math.round((line(y)-FIN)*1e6)/1e6);
   }
  }
  // Solid steps bridge the waist without a void: each spans exactly from the line at its nosing
  // end to the line at its back edge, so consecutive steps and the slab form one mass. The
  // south-going starter tread is carried by the plinth, not by a flight.
  let carried=0;
  for(const step of stairTreads(level).filter(s=>!s.landing&&!s.arrival)){
   const f=stairFlights(level).find(f=>step.box[0]>=f.x[0]-eps&&step.box[2]<=f.x[1]+eps
    &&step.box[1]>=Math.min(f.a[0],f.b[0])-eps&&step.box[3]<=Math.max(f.a[0],f.b[0])+eps);
   if(!f){assert.equal(step.direction,'S');continue;}
   carried++;
   const line=y=>f.a[1]+(f.b[1]-f.a[1])*(y-f.a[0])/(f.b[0]-f.a[0]);
   const ends=[line(step.box[1]),line(step.box[3])].sort((a,b)=>a-b);
   near(ends[0],step.height-R);near(ends[1],step.height);
  }
  assert.equal(carried,level==='ground'?10:15); // R9: ground carries 6 west + 4 upper treads (4 S-going starter risers are on the plinth)
 }
});
test('R7 whole-house frame is set out on existing wall lines and adds only one new member',()=>{
 near(FRAME.slab,.15);near(FRAME.memberWidth,.23);
 assert.equal(FRAME.status,'TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER');
 for(const re of [/CONCEPTUAL FRAMING MASSING ONLY/,/TO BE DESIGNED BY STRUCTURAL ENGINEER/,/NOT TO BE ASSUMED LOAD-BEARING/,/NOT A STRUCTURAL DESIGN/])assert.match(FRAME.note,re);
 // Every grid line is set out on a wall band that already exists in the plan data.
 const walls=plan.levels.ground.filter(c=>c.op==='wall').map(c=>c.args.slice(0,4));
 for(const g of FRAME.gridX)assert.ok(walls.some(w=>Math.abs(w[0]-g.host[0])<eps&&Math.abs(w[2]-g.host[1])<eps),`grid ${g.id} has no host wall`);
 for(const g of FRAME.gridY)assert.ok(walls.some(w=>Math.abs(w[1]-g.host[0])<eps&&Math.abs(w[3]-g.host[1])<eps),`grid ${g.id} has no host wall`);
 const X=Object.fromEntries(FRAME.gridX.map(g=>[g.id,g.at])),Y=Object.fromEntries(FRAME.gridY.map(g=>[g.id,g.at]));
 const X_=Object.fromEntries(FRAME.gridX.map(g=>[g.id,g])),Y_=Object.fromEntries(FRAME.gridY.map(g=>[g.id,g]));
 for(const c of frameColumns()){
  near(c.x,X[c.id[0]]);near(c.y,Y[c.id[1]]);
  // Members are the host wall's thickness where that is 150 mm, otherwise 230 mm carried across
  // the 100 mm wall to one declared side. Either way the member sits on its grid intersection.
  for(const [lo,hi,g] of [[c.box[0],c.box[2],X_[c.id[0]]],[c.box[1],c.box[3],Y_[c.id[1]]]]){
   near(hi-lo,g.thickness>=.15-eps?g.thickness:FRAME.memberWidth);
   if(g.thickness<.15-eps)near(g.project==='+'?lo:hi,g.project==='+'?g.host[0]:g.host[1]);
  }
  assert.ok(c.x>=c.box[0]-eps&&c.x<=c.box[2]+eps&&c.y>=c.box[1]-eps&&c.y<=c.box[3]+eps,`${c.id} off its grid intersection`);
  const E=ENVELOPE.ground;
  assert.ok(c.box[0]>=E[0]-eps&&c.box[2]<=E[2]+eps&&c.box[1]>=E[1]-eps&&c.box[3]<=E[3]+eps,`${c.id} outside the envelope`);
  assert.ok(walls.some(w=>overlaps(w,c.box)),`${c.id} stands free of every wall`);
 }
 // Exactly one member is not already implied by an existing wall junction or pier.
 assert.deepEqual(frameColumns().filter(c=>/^ADDED/.test(c.within)).map(c=>c.id),['C4']);
 // No column stands on the stair, in the under-stair unit, or in the middle of a room.
 const clear=[revision.wash.box,revision.wash.standing,
  ...stairTreads().map(s=>s.box),...stairLandingExtensions().map(s=>s.box)];
 for(const m of [...frameColumns(),...frameBeams()])for(const b of clear)assert.ok(!overlaps(m.box,b),`${m.id??m.grid} intrudes on ${JSON.stringify(b)}`);
 // Grid 3 must not project over the stair starter landing: that would leave 2.20 m headroom.
 assert.equal(Y_['3'].project,'-');assert.equal(Y_['4'].project,'+');
 for(const m of [...frameColumns(),...frameBeams()])assert.ok(!overlaps(m.box,[.15,2.3,2.05,3.2]),`${m.id??m.grid} over the starter landing`);
 // Beams run centre to centre on their grid and stay within a sane span.
 for(const b of frameBeams()){
  assert.ok(b.span>0&&b.span<5,`${b.grid}: ${b.from}-${b.to} spans ${b.span}`);
  const [f,t]=[b.from,b.to].map(id=>frameColumns().find(c=>c.id===id));
  assert.ok(f&&t,`${b.grid}: ${b.from}-${b.to} has no end columns`);
  const run=b.runs==='y'?[b.box[1],b.box[3]]:[b.box[0],b.box[2]];
  assert.deepEqual(run,[Math.min(f[b.runs],t[b.runs]),Math.max(f[b.runs],t[b.runs])]);
 }
 // The R6 stair landing beam zone is the grid 4 beam between A4 and B4; the two agree.
 const landing=STAIR_BEAM_ZONES.find(z=>z.id==='landing-beam');
 const grid4=frameBeams().find(b=>b.grid==='4'&&b.from==='A4'&&b.to==='B4');
 assert.match(grid4.within,/landing beam/);
 assert.ok(landing.box[0]>=grid4.box[0]-eps&&landing.box[2]<=grid4.box[2]+eps&&landing.box[1]>=grid4.box[1]-eps&&landing.box[3]<=grid4.box[3]+eps);
 // Stairwell trimmers keep clear of everything stored under the stair; R9 splits the arrival
 // trimmer into a ground-only zone (moved to y = 4.2) and an unchanged roof-level zone (y = 3.45).
 for(const t of frameTrimmers()){
  assert.match(t.note,/TO BE DESIGNED \/ VERIFIED BY STRUCTURAL ENGINEER/);
  for(const b of [revision.wash.box])assert.ok(!overlaps(t.box,b),t.id);
 }
 assert.deepEqual(frameTrimmers().find(t=>t.id==='stair-arrival-ground').box,[1.05,3.95,2.05,4.2]);
 assert.deepEqual(frameTrimmers().find(t=>t.id==='stair-arrival-first').box,[1.05,3.2,2.05,3.45]);
 assert.ok(FRAME.coordination.some(c=>/wider than the wall/.test(c)&&/declared side/.test(c)));
 assert.ok(FRAME.coordination.some(c=>/Foundations/.test(c)));
});
test('R8 thickens the external walls per floor without moving a single inner face the stair needs',()=>{
 near(EXTERNAL_WALL.ground,.22);near(EXTERNAL_WALL.first,.17);
 assert.deepEqual(ENVELOPE.ground,[-.07,0,6,9.77]);
 assert.deepEqual(ENVELOPE.first,[-.02,0,6,9.72]);
 for(const level of ['ground','first']){
  const t=EXTERNAL_WALL[level],E=ENVELOPE[level],walls=plan.levels[level].filter(c=>c.op==='wall').map(c=>c.args.slice(0,4));
  const has=b=>walls.some(w=>sameBox(w,b));
  // West and rear grew outward; east and front thickened inward. Every inner face is unmoved.
  assert.ok(has([E[0],0,.15,E[3]]),`${level} west wall`);
  assert.ok(has([.15,9.55,3.15,E[3]]),`${level} rear wall`);
  assert.ok(has([6-t,1.2,6,8.3]),`${level} east wall`);
  assert.ok(has([.15,0,3.15,t]),`${level} front wall`);
  // Internal partitions are untouched at 100 mm.
  for(const b of [[3.05,0,3.15,E[3]],[.15,2.2,3.05,2.3],[.15,6.1,3.05,6.2],[2.05,2.3,2.15,6.1]])assert.ok(has(b),`${level} partition ${b}`);
  const thick=walls.map(w=>Math.min(w[2]-w[0],w[3]-w[1]));
  assert.ok(thick.every(v=>[.10,.15,t].some(k=>Math.abs(v-k)<eps)),`${level} has an unexpected wall thickness`);
 }
 // The stair and everything built under it depend on the west and rear inner faces, which is
 // exactly why those two walls were grown outward rather than inward.
 assert.deepEqual(stairTreads('first'),fixedArchitecture.first.stairs);
 for(const f of stairFlights('ground'))near(f.x[1]-f.x[0],.9);
 near(revision.bedroomWallFace,6.1);
 assert.ok(revision.wash.box[0]>=.15-eps,'under-stair unit must not cross the west inner face');
 // The tight setbacks are the reason for the hybrid: they must not have moved.
 const site=plan.dimensions;
 near(site.setbacks_m.north_path,1.0);near(site.setbacks_m.front_yard,3.0);
 near(site.setbacks_m.south_parking_strip,2.63);near(site.setbacks_m.rear_garden,4.03);
 near(1+site.ground_envelope_m[0]+site.setbacks_m.south_parking_strip,9.7);
 near(3+site.ground_envelope_m[1]+site.setbacks_m.rear_garden,16.8);
 assert.ok(site.first_envelope_sqft<=630,'first floor stays inside the published area guard');
});

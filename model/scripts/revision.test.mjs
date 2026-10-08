import test from 'node:test';
import fixedArchitecture from '../revisions/r2-architecture.json' with {type:'json'};
import assert from 'node:assert/strict';
import {wallPieces,openingsFor,stairTreads,stairLandingExtensions,rooms,plan,STAIR_STRUCTURE,STAIR_BEAM_ZONES,stairBeamZones,stairFlights,stairLandingSlabs,stairSoffit,FRAME,frameColumns,frameBeams,frameTrimmers,ENVELOPE,EXTERNAL_WALL} from '../src/geometry.js';
import * as baseline from '../revisions/baseline-v4/geometry.js';
import {revision,storageWallOpenings} from '../src/revision.js';
import {stairOptions,optionTreads,modeledHeadroom} from '../src/stair-options.js';
import {facadeProfiles,profilePoints,facadeBand} from '../src/facade.js';
import {MeshBasicMaterial,Raycaster,Vector3,Box3} from 'three';
import {createHouse} from '../src/house.js';
import {LEVELS} from '../src/geometry.js';
import storage from '../src/storage-layout.json' with {type:'json'};
const eps=1e-8,near=(a,b)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const overlaps=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>eps&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>eps;
const R=3/17,WALL=revision.bedroomWallFace;
const sameBox=(a,b)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<eps);
// R6: clear height under the conceptual RCC waist/landing soffit, replacing the superseded
// flat 120 mm lid under each separate tread. Infinity when nothing is overhead.
const clearance=box=>stairSoffit(box,'ground');
const cm=box=>Math.round(clearance(box)*100)/100;
test('R17 preserves exterior schedules, roof architecture and first-to-roof stair',()=>{
 assert.deepEqual(stairTreads('first'),baseline.stairTreads());
 assert.deepEqual(wallPieces('roof'),baseline.wallPieces('roof'));
 assert.deepEqual(openingsFor('roof'),baseline.openingsFor('roof'));
 for(const level of ['ground','first']){
  const now=plan.levels[level].filter(c=>['door','window','opening'].includes(c.op));
  const was=baseline.plan.levels[level].filter(c=>['door','window','opening'].includes(c.op));
  assert.equal(now.filter(c=>c.op==='door').length,was.filter(c=>c.op==='door').length);
  assert.equal(now.filter(c=>c.op==='window').length,was.filter(c=>c.op==='window').length);
  for(const op of ['door','window','opening']){
   assert.deepEqual(now.filter(c=>c.op===op).map(c=>c.args[2]).sort(),was.filter(c=>c.op===op&&!(level==='first'&&op==='opening'&&c.args[0]===.95&&c.args[1]===2.2)&&!(level==='ground'&&op==='opening'&&c.args[0]===3.05&&[2.45,5.2].includes(c.args[1]))).map(c=>level==='ground'&&op==='window'&&c.args[0]===3.23?1.10:c.args[2]).sort(),`${level} ${op} widths`);
  }
 }
 for(const name of ['FRONT_GF','FRONT_FF','REAR_FF'])assert.deepEqual(plan.openings[name],baseline.plan.openings[name]);
});
test('passage partition removed only in the requested ground living/stair interval',()=>{
 const pieces=wallPieces('ground');assert.ok(!pieces.some(p=>overlaps(p.box,[3.05,2.3,3.15,6.1])));
 assert.ok(pieces.some(p=>overlaps(p.box,[3.05,6.1,3.15,6.4])));
 assert.ok(pieces.some(p=>overlaps(p.box,[3.05,0,3.15,1.2])));
});
test('R17 preserves upper stairs and coordinates the thicker headed stair wall and basin archway',()=>{
 for(const l of ['first','roof']){
  assert.deepEqual(stairTreads(l),fixedArchitecture[l].stairs);
  assert.deepEqual(stairLandingExtensions(l),fixedArchitecture[l].landings);
 }
 // R9 gave the basin a direct 0.90 m archway at the old store-door position (y = 5.2-6.1), with
 // no door leaves. R10 cuts the one remaining solid span of the same 100 mm stair-side partition,
 // y = 3.2-5.2, to a headed opening and puts the TV unit in it. Both apertures are joinery, so no
 // door or window count changes.
 const walls=wallPieces('ground'),openings=openingsFor('ground');
 assert.equal(storageWallOpenings.length,2);
 for(const o of storageWallOpenings)assert.ok(!('storeDoor' in o));
 const [unit,archway]=storageWallOpenings;
 assert.deepEqual(unit.box,[2.05,3.2,2.2,5.2]);
 assert.deepEqual(archway.box,[2.05,5.2,2.2,6.1]);
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

});
test('R9 removes the small under-flight cabinet and the under-landing store entirely',()=>{
 assert.ok(!('storage' in revision));assert.ok(!('store' in revision));assert.ok(!('partition' in revision));assert.ok(!('closingPanel' in revision));
});
test('R14 builds the joinery into the lower-flight bay, on the real soffit',()=>{
 const t=revision.tv;
 assert.equal(t.revision,'R14');assert.equal(t.under,'lower/west flight');
 // It lives wholly inside the lower flight's own footprint and clear of that flight's guard line.
 const flight=stairFlights('ground').find(f=>f.id==='lower');
 for(const b of [t.unit,t.panel,t.screen.box,...t.shelves.map(sh=>[sh.x[0],sh.y[0],sh.x[1],sh.y[1]])]){
  assert.ok(b[0]>=flight.x[0]-eps&&b[2]<=flight.x[1]+eps,`${b} leaves the lower-flight footprint`);
 }
 near(t.faceX,1.04);assert.ok(t.faceX<1.05,'the face must stay behind the flight edge');
 assert.ok(t.faceX+t.projection.faceToBalustrade<=1.07+eps);
 // The R13/R12 joinery on the stair-side wall line is gone, and so are its keys.
 for(const k of ['panelTopCap','panelBreakY','endReturn','endReturnTop','serviceVoid','oldStorageCenter','bays','niche'])
  assert.ok(!(k in t),`R13 key ${k} survives in R14`);
 assert.ok(t.unit[2]<2.05,'nothing is built against the stair-side wall any more');
 // Built footprint and the screen it carries.
 assert.deepEqual(t.unit,t.cabinet.box);
 assert.deepEqual(t.unit,[.69,3.2,1.04,5.45]);
 near(t.unit[2]-t.unit[0],t.unitDepth);near(t.unit[3]-t.unit[1],t.unitLength);
 near(t.unitDepth,.35);near(t.unitLength,2.25);
 near((t.box[1]+t.box[3])/2,t.screenCenter);near(t.screenCenter,4.64);
 near((t.screenTop+t.screenBottom)/2,t.screen.centerHeight);
 near(t.box[3]-t.box[1],t.screen.width);near(t.screenTop-t.screenBottom,t.screen.height);
 assert.ok(Math.abs(Math.hypot(t.screen.width,t.screen.height)/.0254-t.screen.diagonalInches)<.5,'the stated diagonal must match the face');
 near(t.panel[2]-t.panel[0],t.panelThickness);
 // The published top edge is the measured stair underside. It must rise, span the backing, and
 // keep at least the published clearance under the structure the whole way.
 const prof=t.panelTopProfile,top=y=>{
  for(let i=1;i<prof.length;i++){const a=prof[i-1],b=prof[i];
   if(y>=a[0]-1e-9&&y<=b[0]+1e-9&&b[0]>a[0])return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);}
  throw new Error('y outside the published profile');};
 near(prof[0][0],t.panel[1]);near(prof.at(-1)[0],t.panel[3]);
 for(let i=1;i<prof.length;i++)assert.ok(prof[i][1]>=prof[i-1][1]-eps,'the profile must not fall');
 assert.ok(top(t.panel[3])-top(t.panel[1])>1.0,'the backing must rake with the flight');
 // stairSoffit reports the lowest point over the window it is given, so compare it against the
 // profile at that same low edge. The published gap is now met exactly, not with slack.
 for(const y of [3.3,3.7,4.1,4.5,4.7,5.0,5.4]){
  const lo=y-.001,soffit=Math.min(stairSoffit([t.panel[0],lo,t.panel[2],y+.001],'ground'),2.85);
  const gap=soffit-top(lo);
  assert.ok(gap>=t.panelSoffitGap-.0005,`backing at y=${y} clears the soffit by ${gap}, under the published gap`);
  assert.ok(gap<=t.panelSoffitGap+.003,`backing at y=${y} clears the soffit by ${gap}, over the published gap`);
 }
 // Everything built clears the structure over it and stays below the +2.10 m opening head.
 const boxes=[[...t.unit,t.cabinet.top],[...t.screen.box,t.screenTop],
  ...t.shelves.map(sh=>[sh.x[0],sh.y[0],sh.x[1],sh.y[1],sh.top]),
  ...t.dividers.map(d=>[d.x[0],d.y[0],d.x[1],d.y[1],d.z[1]])];
 for(const b of boxes){
  const soffit=Math.min(stairSoffit(b.slice(0,4),'ground'),2.85);
  assert.ok(b[4]<soffit,`${b} does not clear its soffit ${soffit}`);
  assert.ok(b[4]<=t.wallOpening.height,`${b} stands above the +2.10 m opening head`);
 }
 // The screen sits inside the backing and under its raking edge at the tight (low) end.
 assert.ok(t.screen.box[1]>=t.panel[1]&&t.screen.box[3]<=t.panel[3]);
 assert.ok(t.screenTop+.04<=top(t.screen.box[1]),'the screen must clear the backing edge at its low end');
 assert.ok(t.screenBottom>t.cabinet.top,'the screen sits above the cabinet, not behind it');
 // It never reaches the basin, its standing zone, the basin access or the living passage.
 for(const b of [t.unit,t.panel,t.screen.box])
  for(const clear of [revision.wash.box,revision.wash.standing,[2.05,5.2,2.2,6.1],[2.15,3.2,3.15,5.2],[1.05,2.3,2.15,3.2]])
   assert.ok(!overlaps(b,clear),`${b} fouls ${clear}`);
 near(t.projection.intoPassage,0);
 // Storage is stated honestly and is still far short of the store R9 deleted.
 assert.ok(t.storage.volume_m3>.2&&t.storage.volume_m3<.35);
 assert.match(t.storage.note,/3\.5 m3|elsewhere/);
 // One reconciled profile only. A real divergence between model and drawings fails at build time.
 assert.ok(!('panelTopProfileDrawn' in t),'one reconciled profile only - the drawn variant is withdrawn');
 assert.match(t.panelProfileNote,/measures the built stair meshes/);
 assert.equal(t.referenceDeviations.length,4);
 assert.ok(t.referenceDeviations.some(d=>/not removed full height/.test(d)));
});
test('R15 basin continues the TV run in the same band, same depth, same face plane',()=>{
 const w=revision.wash,t=revision.tv;
 // Rotated out of the corner: the depth is now on x and the length on y.
 near(w.box[2]-w.box[0],.35);near(w.box[3]-w.box[1],.62);near(w.box[3],WALL);
 near(w.box[0],w.backX);near(w.box[2],w.faceX);
 // The whole point of R15: one run, one depth, one face plane, facing the same way as the screen.
 near(w.faceX,t.faceX);near(w.box[2],t.cabinet.box[2]);near(w.box[2]-w.box[0],t.unitDepth);
 assert.equal(w.face,t.face);
 // Dimensioned off the backing line the way the R9 nook was dimensioned off the bedroom wall.
 near(w.box[0]-w.backX,w.fromBackPanel.basinBack);near(w.box[2]-w.backX,w.fromBackPanel.basinFront);
 near(w.standing[2]-w.backX,w.fromBackPanel.standingRear);
 near(w.fromBackPanel.basinBack,0);near(w.fromBackPanel.basinFront,.35);
 near(w.standing[0],w.box[2]); // standing zone starts at the vanity front
 near(w.standing[2]-w.standing[0],.6);near(w.standing[3]-w.standing[1],.75);
 // The full-height fin is the only thing between the joinery and the wet zone, and it touches both.
 const dv=w.finish.divider.box;
 near(dv[1],t.endBay[1]);near(dv[3],w.box[1]);near(w.finish.divider.top,w.finish.panelling.top);
 for(const b of [t.unit,t.panel,t.screen.box,t.cabinet.box])assert.ok(!overlaps(w.box,b)&&!overlaps(dv,b));
 // The backing is the TV unit's own panel carried on, so it stays on the published panel line.
 near(w.finish.panelling.box[0],t.panel[0]);near(w.finish.panelling.box[2],t.panel[2]);
 near(w.finish.panelling.box[1],w.box[1]);near(w.finish.panelling.box[3],w.box[3]);
 // Clear height is now uniform, because the standing zone no longer reaches the landing edge.
 const ch=w.clearHeights;
 near(cm(w.box),ch.overBowl);near(cm(w.standing),ch.standing);near(cm(w.box),cm(w.standing));
 assert.ok(clearance(w.box)>=1.85&&clearance(w.box)<revision.headroomBenchmark);
 assert.ok(clearance(w.standing)>=1.85&&clearance(w.standing)<revision.headroomBenchmark);
 // The mirror is carried across unchanged, now measured along y and sitting on the backing.
 assert.ok(w.mirror.z[1]<=1.85);near(w.mirror.z[1]-w.mirror.z[0],.8);near(w.mirror.y[1]-w.mirror.y[0],.4);
 assert.ok(w.mirror.y[0]>=w.box[1]&&w.mirror.y[1]<=w.box[3]);
 assert.ok(!('x' in w.mirror),'the mirror is measured along y in this position');
 // Everything stays inside the stair footprint, clear of the starter flight and the bedroom door.
 for(const b of [w.box,w.standing,dv]){
  assert.ok(b[0]>=.15&&b[2]<=2.05&&b[1]>=2.3&&b[3]<=6.1);
  assert.ok(!overlaps(b,[1.3,2.3,2.2,3.2]));
  assert.ok(!overlaps(b,[2.05,5.2,2.2,6.1]),'the archway stays a clear 0.90 m opening');
  assert.ok(!overlaps(w.bedroomDoorLanding,b));
 }
 assert.ok(!('backPanel' in w)&&!('bedroomReturn' in w)&&!('fromBedroomWall' in w));
 assert.match(w.servicesNote,/TO BE COORDINATED WITH THE PLUMBING DESIGN/);
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
 const w=revision.wardrobe;assert.deepEqual(w.existing,[5.28,2.625,5.83,3.33]);near(w.extension[3]-w.extension[1],w.depth);near(w.height,2.1);
 const door=openingsFor('first').find(o=>o.kind==='door'&&o.y===2.375);
 const window=openingsFor('first').find(o=>o.kind==='window'&&o.y===3.5&&o.axis==='v');
 const bed=plan.levels.first.filter(c=>c.op==='bed').at(-1).args.slice(0,4);
 const swing=[door.x,door.y+door.t,door.x+door.w,door.y+door.t+door.w];
 for(const b of [w.existing,w.extension,w.filler]){assert.ok(!overlaps(b,swing));assert.ok(!overlaps(b,window.box));assert.ok(!overlaps(b,bed));}
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
 for(const re of [/CONCEPTUAL RCC WAIST-SLAB SYSTEM/,/DESIGNED BY STRUCTURAL ENGINEER/,/150 MM FINISHED PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING/])assert.match(S.note,re);
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
 assert.deepEqual(STAIR_BEAM_ZONES.map(z=>z.box),[[.15,6.1,2.05,6.2],[1.05,3.95,2.05,4.2]]);
 assert.deepEqual(stairBeamZones('first').map(z=>z.box),[[.15,6.1,2.05,6.2],[1.05,3.2,2.05,3.45]]);
 assert.ok(wallPieces('ground').some(p=>p.box[1]===6.1&&p.box[3]===6.25));
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
 near(revision.wash.height,.86);near(revision.tv.cabinet.top,.45);near(revision.tv.unitLength,2.25);
});
test('every waist slab is seated with its top face on the flight line, under every tread it carries',()=>{
 const house=createHouse(),FIN=STAIR_STRUCTURE.finish;house.root.updateMatrixWorld(true);
 for(const level of ['ground','first']){
  const z=LEVELS[level],group=house.levels[level].getObjectByName('stairs');
  const structure=group.children.find(c=>c.name.startsWith('Conceptual'));
  // The waist slabs are extruded prisms with vertical ends, not rotated boxes, so they are
  // identified by name rather than by having a tilted quaternion.
  const slabs=structure.children.filter(m=>m.isMesh&&m.name==='RCC waist slab');
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
    // 0.1 mm: the extruded prism carries a little more float noise than the old box did.
    near(Math.round((hits[0].point.y-z)*1e4)/1e4,Math.round((line(y)-FIN)*1e4)/1e4);
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
   near(hi-lo,['B','3','4','5'].includes(g.id)?FRAME.memberWidth:g.thickness);
   assert.ok(lo<=g.at+eps&&hi>=g.at-eps,`${g.id} retained member crosses its grid`);
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
  assert.ok(has([.15,9.55,3.25,E[3]]),`${level} rear wall`);
  assert.ok(has([6-t,1.2,6,8.5]),`${level} east wall`);
  assert.ok(has([.15,0,3.25,t]),`${level} front wall`);
  // Internal walls retain the stair faces and keep the new 150 mm finished allowance.
  for(const b of [[3.1,0,3.25,2.3],[.15,6.1,3.25,6.25],[2.05,2.3,2.2,6.1],...(level==='ground'?[[.15,2.15,3.25,2.3]]:[])])assert.ok(has(b),`${level} partition ${b}`);
  const thick=walls.map(w=>Math.min(w[2]-w[0],w[3]-w[1]));
  assert.ok(thick.every(v=>[.15,t].some(k=>Math.abs(v-k)<eps)),`${level} has an unexpected wall thickness`);
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

test('150 mm finished walls keep the upstairs passage, stairs, rooms and fittings clear',()=>{
 near(plan.dimensions.internal_wall_mm,150);
 assert.match(plan.dimensions.internal_wall_spec.basis,/including plaster/i);
 // Walkable passage is defined independently of labels: opposed faces must remain 900 mm apart.
 const first=plan.levels.first.filter(c=>c.op==='wall').map(c=>c.args.slice(0,4));
 const stairWall=first.find(b=>sameBox(b,[2.05,2.3,2.2,6.1]));
 const bedroomWall=first.find(b=>sameBox(b,[3.1,2.3,3.25,6.1]));
 assert.ok(stairWall&&bedroomWall);near(bedroomWall[0]-stairWall[2],.9);
 for(const level of ['ground','first']){
  for(const wall of Object.values(plan.dimensions.internal_wall_boxes_m[level==='ground'?'GF':'FF']))near(Math.min(wall[2]-wall[0],wall[3]-wall[1]),.15);
  for(const tread of stairTreads(level))for(const wall of wallPieces(level))assert.ok(!overlaps(tread.box,wall.box),`${level} wall intrudes on a stair or landing`);
  for(const room of rooms.filter(r=>r.level===level&&/kitchen|study|master|child|^g-bed$|bath/.test(r.id))){
   for(const wall of wallPieces(level))assert.ok(!overlaps(room.box,wall.box),`${room.id} clear floor overlaps a wall`);
  }
  const bedrooms=rooms.filter(r=>r.level===level&&['g-bed','f-master','f-child'].includes(r.id));
  for(const bed of plan.levels[level].filter(c=>c.op==='bed'))assert.ok(bedrooms.some(r=>bed.args[0]>=r.box[0]-eps&&bed.args[1]>=r.box[1]-eps&&bed.args[2]<=r.box[2]+eps&&bed.args[3]<=r.box[3]+eps),'bed fits within finished room faces');
 }
 const room=rooms.find(r=>r.id==='f-child');
 for(const b of [revision.wardrobe.existing,revision.wardrobe.extension,revision.wardrobe.filler])assert.ok(b[0]>=room.box[0]-eps&&b[1]>=room.box[1]-eps&&b[2]<=room.box[2]+eps&&b[3]<=room.box[3]+eps,'wardrobe fits inside finished bedroom');
 const door=openingsFor('first').find(o=>o.kind==='door'&&o.y===2.375);
 assert.ok(door.x+door.w<revision.wardrobe.extension[0],'north-bedroom entrance stays clear of wardrobe');
 near(rooms.find(r=>r.id==='g-bed').box[2]-.15,2.95);
 near(rooms.find(r=>r.id==='g-bed').box[3]-rooms.find(r=>r.id==='g-bed').box[1],3.3);
});

test('R17 wall junctions are flush in plan and the rear vent stays inside its bathroom',()=>{
 for(const floor of ['GF','FF']){
  const w=plan.dimensions.internal_wall_boxes_m[floor];
  assert.deepEqual([w.bedroom_front[1],w.bedroom_front[3]],[w.ensuite_front[1],w.ensuite_front[3]]);
  assert.deepEqual([w.front_spine[0],w.front_spine[2]],[w.rear_spine[0],w.rear_spine[2]]);
  if(floor==='FF')assert.deepEqual([w.rear_spine[0],w.rear_spine[2]],[w.passage_spine[0],w.passage_spine[2]]);
  const level=floor==='GF'?'ground':'first';
  const drawn=plan.levels[level].filter(c=>c.op==='wall').map(c=>c.args.slice(0,4));
  for(const y of [0,9.55]){
   const cap=drawn.find(b=>nearValue(b[0],3.1)&&nearValue(b[1],y)&&nearValue(b[2],3.25)&&b[3]-b[1]<.3);
   assert.ok(cap,`${level} rear/front pier cap is aligned`);
  }
  assert.ok(!drawn.some(b=>nearValue(b[0],3.05)&&nearValue(b[2],3.2)),'old projecting pier is absent');
 }
 const bath=rooms.find(r=>r.id==='g-bath').box;
 const vent=openingsFor('ground').find(o=>o.kind==='obscured'&&o.y>8);
 assert.ok(vent.x>=bath[0]+.049&&vent.x+vent.w<=bath[2]-.049,'rear window has a jamb on both sides');
});
function nearValue(a,b){return Math.abs(a-b)<1e-7;}
test('R17 compact fixtures, private door routes and bed circulation are usable',()=>{
 const house=createHouse();house.root.updateMatrixWorld(true);
 for(const level of ['ground','first']){
  const floor=level==='ground'?'GF':'FF',fits=plan.dimensions.bathroom_layout_m[floor];
  for(const fit of fits){
   const b=fit.box;
   for(const fixture of [fit.wc_box,fit.basin_box,fit.shower])assert.ok(fixture[0]>=b[0]-eps&&fixture[1]>=b[1]-eps&&fixture[2]<=b[2]+eps&&fixture[3]<=b[3]+eps,'fixture stays inside finished room');
   assert.ok(!overlaps(fit.wc_box,fit.basin_box)&&!overlaps(fit.wc_box,fit.shower),'toilet is clear of basin and shower');
   assert.ok(fit.wc_front_clear_m>=.65);near(fit.shower[3]-fit.shower[1],.9);near(fit.shower_entry_width_m,.6);
   const route=fit.room==='ensuite_main'?[b[0],6.6,b[0]+.6,7.35]:[5,6.25,5.75,6.85];
   assert.ok(!overlaps(route,fit.wc_box)&&!overlaps(route,fit.basin_box),'750 mm private doorway has a clear approach inside the bath');
   const wc=house.levels[level].getObjectByName(`Compact WC ${level} ${fit.wc[0]}`);assert.ok(wc);
   const mesh=new Box3().setFromObject(wc);
   assert.ok(Math.abs(mesh.min.x+3-fit.wc_box[0])<1e-5&&Math.abs(mesh.max.x+3-fit.wc_box[2])<1e-5,'built WC uses the published installed projection');
   assert.ok(Math.abs(4.85-mesh.max.z-fit.wc_box[1])<1e-5&&Math.abs(4.85-mesh.min.z-fit.wc_box[3])<1e-5,'built WC uses the published width');
  }
  const bed=plan.levels[level].find(c=>c.op==='bed').args.slice(0,4),sw=rooms.find(r=>r.id===(level==='ground'?'g-bed':'f-master')).box;
  near(bed[1]-6.8,.625);near(sw[3]-bed[3],.625);near(sw[2]-.035-bed[2],.865);
  const door=openingsFor(level).find(o=>o.kind==='surface-slider'&&o.axis==='v');near(door.w,.75);near(door.y,6.6);
 }
 const child=plan.levels.first.filter(c=>c.op==='bed').at(-1).args.slice(0,4),room=rooms.find(r=>r.id==='f-child').box;
 near(child[1]-revision.wardrobe.existing[3],.625);near(6.055-child[3],.6);near(room[2]-child[2],.58);
 assert.ok(openingsFor('first').some(o=>o.kind==='surface-slider'&&o.axis==='h'&&o.x===5&&o.y===6.1));
 const work=rooms.find(r=>r.id==='g-work').box;near(work[3]-8.95,.82);
});
test('R17 area totals use actual envelopes and clear zones without overlap',()=>{
 const d=plan.dimensions;
 near(d.both_floors_m2,6.07*9.77+6.02*9.72);
 near(d.total_including_roof_m2,d.both_floors_m2+2.2*4.1);
 near(d.total_including_roof_sqft,Math.round(d.total_including_roof_m2/.09290304*100)/100);
 assert.ok(!('gross_envelope_sqft_per_floor' in d),'obsolete equal-floor total is withdrawn');
 for(const level of ['ground','first']){
  const actual=rooms.filter(r=>r.level===level&&r.clearAreaM2!==undefined);
  for(let i=0;i<actual.length;i++)for(let j=i+1;j<actual.length;j++)
   for(const a of actual[i].regions??[actual[i].box])for(const b of actual[j].regions??[actual[j].box])
    assert.ok(!overlaps(a,b),`${actual[i].id} double-counts ${actual[j].id}`);
  const sum=actual.reduce((v,r)=>v+r.clearAreaM2,0);near(sum,d.named_clear_zone_totals_m2[level]);
  assert.ok(sum<d.gross_envelope_m2_by_floor[level]);
 }
});

test('R18 fitted storage keeps its footprints and clears beams, windows and doors',()=>{
 assert.deepEqual(plan.dimensions.storage_layout,storage);
 const h=createHouse();h.root.updateMatrixWorld(true,true);
 const planBox=o=>{const b=new Box3().setFromObject(o);return [b.min.x+3,4.85-b.max.z,b.max.x+3,4.85-b.min.z,b.min.y,b.max.y];};
 let loftGross=0;
 for(const unit of storage.units){
  const g=h.levels[unit.level].getObjectByName(unit.label);assert.ok(g);
  const z=LEVELS[unit.level],room=rooms.find(r=>r.id===unit.room).box;
  const boxes=unit.segments.map(s=>s.box).concat(unit.corner?[unit.corner]:[]);
  const area=boxes.reduce((v,b)=>v+(b[2]-b[0])*(b[3]-b[1]),0);
  near(area*(storage.loftTop-storage.mainHeight),unit.grossLoftM3);loftGross+=unit.grossLoftM3;
  g.traverse(o=>{
   if(!o.isMesh)return;const b=planBox(o);
   assert.ok(b[0]>=room[0]-.001&&b[1]>=room[1]-.001&&b[2]<=room[2]+.001&&b[3]<=room[3]+.001,'cabinet remains inside room');
   for(const beam of frameBeams(unit.level)){
    const lo=z+2.85-FRAME.indicativeBeam,hi=z+2.85;
    assert.ok(!(overlaps(b,beam.box)&&Math.min(b[5],hi)-Math.max(b[4],lo)>1e-7),`${unit.id} ${o.name} enters beam`);
   }
   for(const ap of openingsFor(unit.level)){
    const box=ap.box;
    if(!box)continue;
    assert.ok(!(overlaps(b,box)&&Math.min(b[5],z+ap.sill+ap.height)-Math.max(b[4],z+ap.sill)>1e-7),`${unit.id} blocks aperture`);
   }
   if(o.name==='main door'||o.name==='loft door')assert.ok(Math.max(b[2]-b[0],b[3]-b[1])<=.271,'door leaf stays narrow');
   if(o.name==='top / loft shelf')assert.ok(b[5]<=z+2.5+1e-7);
  });
 }
 near(loftGross,storage.capacity.additionalLoftsGrossM3);
 near(plan.dimensions.total_including_roof_sqft,1365.28);
});

test('R18 wardrobe lofts and lift-up bed bases contain actual storage cavities',()=>{
 const h=createHouse();h.root.updateMatrixWorld(true,true);
 let beds=0;
 for(const level of ['ground','first']){
  const z=LEVELS[level];
  for(const unit of storage.units.filter(u=>u.level===level)){
   const g=h.levels[level].getObjectByName(unit.label);
   for(const s of unit.segments){
    const b=s.box,along=s.face==='y1',a=along?(b[0]+(b[2]-b[0])/s.modules/2):(b[1]+(b[3]-b[1])/s.modules/2);
    const point=h.V(along?a:(b[0]+b[2])/2,z+2.3,along?(b[1]+b[3])/2:a);
    g.traverse(o=>{if(o.isMesh)assert.ok(!new Box3().setFromObject(o).containsPoint(point),'loft cavity is not a solid block');});
   }
  }
  h.levels[level].traverse(g=>{
   if(g.name!=='Lift-up storage bed base')return;beds++;
   const b=new Box3().setFromObject(g),point=b.getCenter(new Vector3());
   g.traverse(o=>{if(o.isMesh)assert.ok(!new Box3().setFromObject(o).containsPoint(point),'bed cavity is not a solid block');});
   near(b.max.y-b.min.y,.2);
  });
 }
 assert.equal(beds,3);
 near((2-2*storage.panel)*(1.5-2*storage.panel)*storage.beds.clearHeight,.471548544);
});

test('R18 Bedroom 3 has a continuous right-angle corner and no cosmetic ceiling bands',()=>{
 const unit=storage.units.find(u=>u.id==='bedroom3'),[front,side]=unit.segments;
 assert.equal(unit.cornerAngleDeg,90);assert.equal(front.face,'y1');assert.equal(side.face,'x0');
 near(front.box[2],side.box[0]);near(front.box[3],side.doorRange[0]);near(side.box[3],side.doorRange[1]);
 assert.equal(storage.ceilingInfill,false);
 const h=createHouse();h.root.updateMatrixWorld(true,true);
 for(const unit of storage.units){
  const group=h.levels[unit.level].getObjectByName(unit.label);
  group.traverse(o=>{
   assert.ok(!o.name.includes('cosmetic ceiling infill')&&!o.name.includes('closed corner return'));
   if(o.isMesh)assert.ok(new Box3().setFromObject(o).max.y<=LEVELS[unit.level]+storage.loftTop+1e-7);
  });
 }
 const group=h.levels.first.getObjectByName(unit.label),cornerPoint=h.V(5.28,LEVELS.first+2.3,3.0);
 group.traverse(o=>{if(o.isMesh)assert.ok(!new Box3().setFromObject(o).containsPoint(cornerPoint),'corner has no solid filler or dividing end wall');});
});

test('R18 opens study to stairs, keeps the gallery boundary and fits the tailoring workspace',()=>{
 const strip=storage.study.removedPartition;
 assert.ok(!wallPieces('first').some(p=>overlaps(p.box,strip)),'study/stair partition is absent at every height');
 assert.ok(wallPieces('ground').some(p=>overlaps(p.box,strip)),'ground kitchen wall retained');
 assert.ok(wallPieces('first').some(p=>overlaps(p.box,[3.1,.3,3.25,1.2])),'gallery/balcony boundary retained');
 assert.ok(!openingsFor('first').some(o=>o.x===.95&&o.y===2.15),'obsolete doorway removed with wall');
 const study=rooms.find(r=>r.id==='f-study').box;near(study[3],2.3);near(study[3]-study[1],2.13);
 near(plan.dimensions.room_clear_areas_m2['f-study'],2.95*2.13);
 near(plan.dimensions.room_clear_areas_m2['f-study']-2.95*1.98,.4425);
 const linen=storage.units.find(u=>u.id==='linen').segments[0].box;
 for(const table of storage.study.tables){
  assert.ok(!overlaps(table.box,linen));
  for(const route of [strip,[2.2,2.3,3.1,6.1],[3.1,1.35,3.25,2.15]])assert.ok(!overlaps(table.box,route),'workbench keeps routes clear');
 }
 assert.ok(!overlaps(linen,[.6,2.15,3.1,2.3]),'cabinet keeps a 2500 mm clear stair connection beside the west edge');
 const h=createHouse();let machines=0;h.levels.first.traverse(o=>{if(o.name==='Sewing machine')machines++});assert.equal(machines,3);
 near((2.15-.225)-(1.05+.225),storage.study.workingAisleM);
 assert.ok(frameBeams('first').some(b=>overlaps(b.box,strip)),'existing cross beam remains');
 near(plan.dimensions.total_including_roof_sqft,1365.28);
});


test('stair landing support meshes leave both bedroom entrances clear',()=>{
 const h=createHouse();h.root.updateMatrixWorld(true,true);
 for(const level of ['ground','first']){
  const group=h.levels[level].getObjectByName('Landing beam and trimmer zones (indicative)');
  assert.ok(group);
  const doors=openingsFor(level).filter(o=>['door','slider','surface-slider'].includes(o.kind));
  for(const mesh of group.children){
   const b=new Box3().setFromObject(mesh);
   const footprint=[b.min.x+3,4.85-b.max.z,b.max.x+3,4.85-b.min.z];
   for(const door of doors){
    const heightOverlap=Math.min(b.max.y,LEVELS[level]+door.sill+door.height)-Math.max(b.min.y,LEVELS[level]+door.sill)>1e-6;
    assert.ok(!heightOverlap||!overlaps(footprint,door.box),`${level} stair support blocks door at ${door.x},${door.y}`);
   }
  }
  const entrance=openingsFor(level).find(o=>o.kind==='door'&&o.axis==='h'&&Math.abs(o.y-6.1)<eps);
  assert.ok(entrance);assert.ok(stairBeamZones(level)[0].box[2]<=entrance.box[0]);
 }
 assert.equal(plan.dimensions.total_including_roof_sqft,1365.28);
});

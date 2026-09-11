import test from 'node:test';
import fixedArchitecture from '../revisions/r2-architecture.json' with {type:'json'};
import assert from 'node:assert/strict';
import {wallPieces,openingsFor,stairTreads,stairLandingExtensions,rooms,plan,STAIR_STRUCTURE,STAIR_BEAM_ZONES,stairFlights,stairLandingSlabs,stairSoffit,FRAME,frameColumns,frameBeams,frameTrimmers,ENVELOPE,EXTERNAL_WALL} from '../src/geometry.js';
import * as baseline from '../revisions/baseline-v4/geometry.js';
import {revision,storageWallOpenings} from '../src/revision.js';
import {stairOptions,optionTreads,modeledHeadroom} from '../src/stair-options.js';
import {facadeProfiles,profilePoints,facadeBand} from '../src/facade.js';
import {MeshBasicMaterial,Raycaster,Vector3} from 'three';
import {createHouse} from '../src/house.js';
import {LEVELS} from '../src/geometry.js';
const eps=1e-8,near=(a,b)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const overlaps=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>eps&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>eps;
const FIXTURE_ROOMS=['g-wash','g-storage','g-store'];
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
 assert.deepEqual(stairTreads().slice(8),baseline.stairTreads().slice(8));
 assert.deepEqual(stairTreads('first'),baseline.stairTreads());
 for(const r of rooms.filter(r=>r.id!=='g-living'&&!FIXTURE_ROOMS.includes(r.id)))assert.ok(sameBox(r.box,r8Room(r.id,baseline.rooms.find(b=>b.id===r.id).box)),r.id);
});
test('passage partition removed only in the requested ground living/stair interval',()=>{
 const pieces=wallPieces('ground');assert.ok(!pieces.some(p=>overlaps(p.box,[3.05,2.3,3.15,6.1])));
 assert.ok(pieces.some(p=>overlaps(p.box,[3.05,6.1,3.15,6.4])));
 assert.ok(pieces.some(p=>overlaps(p.box,[3.05,0,3.15,1.2])));
});
test('R5 preserves EVERY R2 stair, landing, wall, opening and room boundary except the single disclosed store-door aperture',()=>{
 const door=storageWallOpenings.find(o=>o.storeDoor);
 for(const l of ['ground','first','roof']){
  const walls=wallPieces(l),openings=openingsFor(l);
  assert.deepEqual(stairTreads(l),fixedArchitecture[l].stairs);assert.deepEqual(stairLandingExtensions(l),fixedArchitecture[l].landings);
  if(l!=='ground'){
   assert.equal(walls.length,fixedArchitecture[l].walls.length,l);
   walls.forEach((p,i)=>assert.ok(samePiece(p,fixedArchitecture[l].walls[i],l),`${l} wall ${i}`));
   assert.equal(openings.length,fixedArchitecture[l].openings.length,l);
   openings.forEach((a,i)=>assert.ok(sameOpening(a,fixedArchitecture[l].openings[i],l),`${l} opening ${i}`));
   continue;}
  // R6 second disclosed change: the joinery opening used to start 50 mm clear of the stair-entry
  // opening, leaving a 50 mm x 2.85 m sliver of the partition standing alone in the stair entry.
  // The two now meet at y = 3.20 and the sliver is gone. Nothing else in the wall set moves.
  const widened=fixedArchitecture.ground.openings.map(o=>o.kind==='joinery'&&o.y===3.25?{...o,y:3.2,w:2,box:[2.05,3.2,2.15,5.2]}:o);
  const got=openings.filter(o=>!o.storeDoor);
  assert.equal(got.length,widened.length);
  got.forEach((a,i)=>assert.ok(sameOpening(a,widened[i]),`opening ${i}`));
  assert.deepEqual(openings.filter(o=>o.storeDoor),[door]);
  assert.ok(!wallPieces('ground').some(p=>p.box[3]-p.box[1]<.06&&p.top-p.bottom>2.8),'no free-standing partition sliver');
  // The retained partition beside the bedroom door keeps its wall above the 1.40 m door head; nothing else moves.
  const sliver=[2.05,3.2,2.15,3.25];
  const expected=fixedArchitecture.ground.walls
   .filter(p=>!sameBox(p.box,sliver))
   .map(p=>sameBox(p.box,[2.05,3.25,2.15,5.2])?{...p,box:[2.05,3.2,2.15,5.2]}:p)
   .map(p=>sameBox(p.box,door.box)&&p.bottom===0?{...p,bottom:door.height}:p);
  assert.equal(walls.length,expected.length);
  walls.forEach((p,i)=>assert.ok(samePiece(p,expected[i]),`wall piece ${i}: ${JSON.stringify(p.box)}`));
  assert.equal(walls.filter(p=>sameBox(p.box,door.box)).length,1);
  assert.notDeepEqual(walls,fixedArchitecture.ground.walls);
 }
 const boundaries=rooms.filter(r=>!FIXTURE_ROOMS.includes(r.id)).map(r=>({id:r.id,box:r.box,...(r.regions?{regions:r.regions}:{})}));
 assert.equal(boundaries.length,fixedArchitecture.rooms.length);
 boundaries.forEach((r,i)=>{
  const e=fixedArchitecture.rooms[i];assert.equal(r.id,e.id);
  assert.ok(sameBox(r.box,r8Room(e.id,e.box)),r.id);
  if(e.regions)r.regions.forEach((g,j)=>assert.ok(sameBox(g,r8Room(e.id,e.regions[j])),r.id+' region '+j));
 });
});
test('rectangular cabinet stays beneath the high end of the lower flight; doors now clear the basin and are reached from the wash side',()=>{
 assert.equal(revision.storage.length,1);const c=revision.storage[0],w=revision.wash;
 near(c.box[3]-c.box[1],.5);near(c.box[2]-c.box[0],.55);near(c.height,.8);
 assert.ok(c.box[1]>=4.2&&c.box[3]<=4.7&&c.box[0]>=.15&&c.box[2]<=1.05);
 assert.ok(!('topHeights' in c));assert.equal(c.doorLeaves,2);
 assert.ok(c.height<=clearance(c.box)-.045); // R6: 0.80 m under the 0.851 m lower-flight waist soffit
 for(const b of [w.box,revision.partition.box,revision.store.box,revision.tv.box,revision.tv.panel,revision.closingPanel.box])assert.ok(!overlaps(c.doorSweep,b));
 near(c.standing[2]-c.standing[0],.4);near(c.standing[0],1.15);near(c.standing[2],w.box[0]);
 assert.ok(!overlaps(c.standing,w.box));assert.ok(clearance(c.standing)>=1.73);assert.ok(clearance(c.standing)<2.0); // stoop access, not a passage
 near(c.box[3],revision.partition.box[1]); // the cabinet's west face is the same line as the mirror partition
});
test('TV stays centered on OLD storage span; the closing panel continues its line to the retained wall',()=>{
 const t=revision.tv,old=revision.oldSlopedStorageFootprint,c=revision.storage[0],cp=revision.closingPanel;
 near((t.box[1]+t.box[3])/2,(old[1]+old[3])/2);near(t.oldStorageCenter,4.125);
 near((t.screenTop+t.screenBottom)/2,1.1);
 assert.ok((c.box[1]+c.box[3])/2>t.oldStorageCenter);
 assert.ok(t.box[0]>old[2]);near(t.panel[0],2.05);assert.ok(t.box[2]<=2.15);
 near((t.panel[1]+t.panel[3])/2,t.oldStorageCenter);
 assert.ok(!('foot' in t)&&!('support' in t));
 near(t.box[0],t.panel[2]);assert.ok(t.panelHeight>=t.screenTop);
 near(cp.box[1],t.panel[3]);near(cp.box[3],5.2);near(cp.box[0],t.panel[0]);near(cp.box[2],t.panel[2]);near(cp.height,t.panelHeight);
 assert.ok(cp.box[0]>=2.05); // beside the treads, never beneath them
 for(const b of [t.panel,t.box,cp.box])assert.ok(!Number.isFinite(stairSoffit(b)),'joinery on the TV line must stay clear of the flight');
});
test('under-landing store fills the 1.42 m zone with a stepped top clear of every RCC soffit and a passage-face door',()=>{
 const s=revision.store,zones=s.zones,cabinet=revision.storage[0];
 near(zones.reduce((a,z)=>a+(z.box[2]-z.box[0])*(z.box[3]-z.box[1]),0),(s.box[2]-s.box[0])*(s.box[3]-s.box[1]));
 for(let i=0;i<zones.length;i++)for(let j=i+1;j<zones.length;j++)assert.ok(!overlaps(zones[i].box,zones[j].box));
 for(const z of zones){
  assert.ok(z.box[0]>=s.box[0]-eps&&z.box[2]<=s.box[2]+eps&&z.box[1]>=s.box[1]-eps&&z.box[3]<=s.box[3]+eps);
  const c=clearance(z.box);assert.ok(Number.isFinite(c),z.over);near(Math.round(c*100)/100,z.clear);assert.ok(z.top<=c-.045,z.over);
 }
 near(WALL-s.box[3],0);near(WALL-s.box[1],1.35);near(revision.partition.box[3],s.box[1]);
 const floor=(s.box[2]-s.box[0])*(s.box[3]-s.box[1]),volume=zones.reduce((a,z)=>a+(z.box[2]-z.box[0])*(z.box[3]-z.box[1])*z.top,0);
 assert.ok(floor>2.5&&floor<2.7);assert.ok(volume>3.4&&volume<3.7); // R6 waist/landing soffit: about 3.5 m3, was 3.7
 assert.ok(volume>10*(cabinet.box[2]-cabinet.box[0])*(cabinet.box[3]-cabinet.box[1])*cabinet.height);
 const d=s.door;assert.deepEqual(d.box,[2.05,5.2,2.15,6.1]);assert.equal(d.leaves,2);near(d.leaves*d.leafWidth,d.box[3]-d.box[1]);
 assert.ok(d.height<=9*R-STAIR_STRUCTURE.landingZone); // the approved 900 x 1400 mm opening still clears the landing slabassert.ok(d.sweep[3]<=6.1+eps&&d.sweep[2]-2.15<=.25+eps);
 const aperture=storageWallOpenings.find(o=>o.storeDoor);near(aperture.height,d.height);assert.deepEqual(aperture.box,d.box);
 assert.ok(wallPieces('ground').some(p=>sameBox(p.box,d.box)&&Math.abs(p.bottom-d.height)<eps&&p.top===2.85));
 assert.ok(!overlaps(s.box,cabinet.box));assert.ok(!overlaps(s.box,revision.wash.box));assert.ok(!overlaps(s.box,revision.wash.standing));
 assert.match(s.wallCut,/engineer/);assert.match(s.fallback,/no wall change/);
});
test('basin sits 1.40-1.75 m from the bedroom wall; the user faces WEST under the RCC waist soffit',()=>{
 const w=revision.wash,pt=revision.partition;
 near(w.box[2]-w.box[0],.5);near(w.box[3]-w.box[1],.35);assert.equal(w.userFaces,'W');assert.equal(w.front,'E');
 near(WALL-w.box[3],w.fromBedroomWall.basinBack);near(WALL-w.box[1],w.fromBedroomWall.basinFront);near(WALL-w.standing[1],w.fromBedroomWall.standingRear);
 near(w.fromBedroomWall.basinBack,1.4);near(w.fromBedroomWall.basinFront,1.75);
 near(w.box[3],pt.box[1]);near(w.standing[3],w.box[1]); // basin backs onto the partition; standing zone starts at the basin front (west is increasing plan y)
 near(w.box[2],2.05);assert.ok(w.box[2]<=revision.tv.panel[0]+eps);
 near(w.standing[2]-w.standing[0],.75);near(w.standing[3]-w.standing[1],.6);
 const ch=w.clearHeights;
 near(cm(w.box),ch.overBowl);near(cm(w.leanStrip),ch.leanStrip);near(cm(w.bodyLine),ch.bodyLine);
 near(cm(w.standing),ch.leanStrip);near(cm([1.3,WALL-2.6,2.05,WALL-2.3499]),ch.rear);
 near(cm([1.3,WALL-2.6,2.05,WALL-w.fallbackFront]),ch.fallbackFront);
 // R6 disclosure: an inclined waist soffit is lower than the superseded flat tread lid, so the
 // whole standing zone now sits under the 2.20 m benchmark - 1.98 m over the leaning strip,
 // 2.09 m over the body line, 2.40 m at the rear. Plan positions and the basin are unchanged.
 assert.ok(clearance(w.standing)>=1.98&&clearance(w.standing)<revision.headroomBenchmark);
 assert.ok(clearance(w.bodyLine)<revision.headroomBenchmark);
 assert.ok(clearance(w.standing)>revision.structure.supersededTreadZone+1.8);
 assert.ok(pt.height<=clearance(pt.box)-.045);assert.ok(pt.mirror.z[1]<=pt.height);assert.ok(pt.mirror.x[0]>=w.box[0]&&pt.mirror.x[1]<=w.box[2]);
 for(const b of [w.box,w.standing,pt.box]){assert.ok(b[0]>=1.15&&b[2]<=2.05&&b[1]>=2.3&&b[3]<=5.2);assert.ok(!overlaps(b,[1.3,2.3,2.2,3.2]));}
 for(const b of [w.box,pt.box,revision.tv.box,revision.tv.panel,revision.closingPanel.box,revision.store.box,...revision.storage.map(c=>c.box)])assert.ok(!overlaps(w.bedroomDoorLanding,b));
 assert.ok(!('backPanel' in w)&&!('bedroomReturn' in w));
 assert.equal(rooms.filter(r=>r.id.includes('bath')).length,3);
});
test('basin and cabinet routes pass the stair entry and avoid every fixture, panel and the store',()=>{
 const t=revision.tv,obstacles={tv:[t.panel,t.box,revision.closingPanel.box],fixed:[revision.partition.box,revision.store.box]};
 for(const [fixture,others] of [[revision.wash,[...revision.storage.map(c=>c.box)]],[revision.storage[0],[revision.wash.box]]]){
  const blocks=[...obstacles.tv,...obstacles.fixed,...others];
  assert.ok(fixture.approach[0][0]>2.15&&fixture.approach[1][1]>2.3&&fixture.approach[1][1]<3.2); // enters through the 900 mm stair-entry opening
  for(let i=1;i<fixture.approach.length;i++){
   const a=fixture.approach[i-1],b=fixture.approach[i];
   for(let j=0;j<=20;j++){
    const x=a[0]+(b[0]-a[0])*j/20,y=a[1]+(b[1]-a[1])*j/20;
    for(const o of blocks)assert.ok(!(x>o[0]&&x<o[2]&&y>o[1]&&y<o[3]),`route enters ${o}`);
   }
  }
  const end=fixture.approach.at(-1);assert.ok(end[0]>fixture.standing[0]&&end[0]<fixture.standing[2]&&end[1]>fixture.standing[1]&&end[1]<fixture.standing[3]);
 }
});
test('lower turn connects continuously to the fixed intermediate landing',()=>{
 const s=stairTreads(),extension=stairLandingExtensions()[0];
 near(s[0].box[0],s[1].box[2]);near(s[1].box[3],s[2].box[1]);
 for(let i=2;i<7;i++)near(s[i].box[3],s[i+1].box[1]);
 near(s[7].box[3],extension.box[1]);near(extension.box[3],s[8].box[1]);near(extension.height,s[8].height);
 near(revision.stair.kitchenDepth,2.05);
 assert.ok(modeledHeadroom(revision.stair)>=revision.headroomBenchmark);
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
  assert.ok(treads.length>=6,`${l}/${f.id} carries ${treads.length} treads`);
  for(const t of treads){
   const ends=[line(t.box[1]),line(t.box[3])].sort((a,b)=>a-b);
   near(ends[1],t.height);near(ends[0],t.height-R);
  }
 }
 // Support zones stay inside walls and slab edges that already exist: no new element in any room,
 // no load on either 100 mm partition, no wall or column below the upper flight.
 assert.deepEqual(STAIR_BEAM_ZONES.map(z=>z.box),[[.15,6.1,3.05,6.2],[1.05,3.2,2.05,3.45]]);
 assert.ok(wallPieces('ground').some(p=>p.box[1]===6.1&&p.box[3]===6.2));
 for(const zone of STAIR_BEAM_ZONES){
  assert.ok(!overlaps(zone.box,[2.05,2.3,2.15,6.1]),'no bearing on the stair-side partition');
  assert.ok(!overlaps(zone.box,[3.15,1.35,5.85,6.1]),'nothing new inside the living area');
  for(const b of [revision.store.box,revision.wash.box,revision.wash.standing,revision.storage[0].box,revision.partition.box])
   assert.ok(!overlaps(zone.box,b),'support zones must not eat the under-stair unit');
  assert.match(zone.note,/TO BE DESIGNED \/ VERIFIED BY STRUCTURAL ENGINEER/);
 }
 // The waist soffit is an inclined plane and always lower than the superseded flat tread lid.
 assert.ok(STAIR_STRUCTURE.waistVertical>S.supersededTreadZone);
 near(STAIR_STRUCTURE.pitchDeg,Math.atan2(R,.25)*180/Math.PI);
 for(const b of [revision.wash.leanStrip,revision.storage[0].box,revision.store.zones[3].box])
  assert.ok(clearance(b)<Math.min(...stairTreads().filter(s=>overlaps(s.box,b)).map(s=>s.height))-S.supersededTreadZone);
});
test('R6 changes nothing but joinery heights: every riser, tread, landing and floor level is untouched',()=>{
 for(const l of ['ground','first']){
  assert.deepEqual(stairTreads(l),fixedArchitecture[l].stairs);
  assert.deepEqual(stairLandingExtensions(l),fixedArchitecture[l].landings);
 }
 // Landing slabs sit exactly under the approved landing tops; walking levels do not move.
 for(const l of ['ground','first'])for(const s of stairLandingSlabs(l)){
  const tread=[...stairTreads(l),...stairLandingExtensions(l)].find(t=>sameBox(t.box,s.box));
  if(tread)near(s.top,tread.height);
 }
 // Under-stair functions all survive with their plan positions intact.
 for(const b of [revision.store.box,revision.wash.box,revision.wash.standing,revision.partition.box,revision.storage[0].box,revision.tv.panel,revision.closingPanel.box])
  assert.ok(b.every(Number.isFinite));
 near(revision.store.box[2]-revision.store.box[0],1.9);near(revision.store.box[3]-revision.store.box[1],1.35);
 near(revision.store.door.height,1.4);assert.deepEqual(revision.store.door.box,[2.05,5.2,2.15,6.1]);
 near(revision.wash.height,.86);near(revision.tv.panelHeight,1.7);
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
  assert.equal(carried,level==='ground'?13:15);
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
 const clear=[revision.store.box,revision.wash.box,revision.wash.standing,revision.partition.box,revision.storage[0].box,
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
 // Stairwell trimmers keep clear of everything stored under the stair.
 for(const t of frameTrimmers()){
  assert.match(t.note,/TO BE DESIGNED \/ VERIFIED BY STRUCTURAL ENGINEER/);
  for(const b of [revision.store.box,revision.wash.box,revision.storage[0].box])assert.ok(!overlaps(t.box,b),t.id);
 }
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
 assert.deepEqual(stairTreads('ground'),fixedArchitecture.ground.stairs);
 assert.deepEqual(stairTreads('first'),fixedArchitecture.first.stairs);
 for(const f of stairFlights('ground'))near(f.x[1]-f.x[0],.9);
 near(revision.store.box[0],.15);near(revision.bedroomWallFace,6.1);
 for(const b of [revision.store.box,revision.wash.box,revision.partition.box,revision.storage[0].box])assert.ok(b[0]>=.15-eps,'under-stair unit must not cross the west inner face');
 // The tight setbacks are the reason for the hybrid: they must not have moved.
 const site=plan.dimensions;
 near(site.setbacks_m.north_path,1.0);near(site.setbacks_m.front_yard,3.0);
 near(site.setbacks_m.south_parking_strip,2.63);near(site.setbacks_m.rear_garden,4.03);
 near(1+site.ground_envelope_m[0]+site.setbacks_m.south_parking_strip,9.7);
 near(3+site.ground_envelope_m[1]+site.setbacks_m.rear_garden,16.8);
 assert.ok(site.first_envelope_sqft<=630,'first floor stays inside the published area guard');
});

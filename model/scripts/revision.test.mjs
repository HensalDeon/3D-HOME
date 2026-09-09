import test from 'node:test';
import fixedArchitecture from '../revisions/r2-architecture.json' with {type:'json'};
import assert from 'node:assert/strict';
import {wallPieces,openingsFor,stairTreads,stairLandingExtensions,rooms} from '../src/geometry.js';
import * as baseline from '../revisions/baseline-v4/geometry.js';
import {revision,storageWallOpenings} from '../src/revision.js';
import {stairOptions,optionTreads,modeledHeadroom} from '../src/stair-options.js';
import {facadeProfiles,profilePoints,facadeBand} from '../src/facade.js';
import {MeshBasicMaterial} from 'three';
const eps=1e-8,near=(a,b)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const overlaps=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>eps&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>eps;
const FIXTURE_ROOMS=['g-wash','g-storage','g-store'];
const R=3/17,T=revision.assumedStairThickness,WALL=revision.bedroomWallFace;
const sameBox=(a,b)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<eps);
// Clear height beneath everything the ground stair places over a plan box (treads, landing, extension); Infinity when nothing is overhead.
function clearance(box){
 const over=[...stairTreads(),...stairLandingExtensions()].map(s=>({box:s.box,under:s.height-T}));
 return Math.min(Infinity,...over.filter(o=>overlaps(o.box,box)).map(o=>o.under));
}
test('all door/window positions and all first/roof walls are unchanged',()=>{
 for(const l of ['ground','first','roof']){
  const fixtures=a=>a.filter(o=>!['opening','joinery'].includes(o.kind));
  assert.deepEqual(fixtures(openingsFor(l)),fixtures(baseline.openingsFor(l)));
  if(l!=='ground')assert.deepEqual(wallPieces(l),baseline.wallPieces(l));
 }
 assert.deepEqual(stairTreads().slice(8),baseline.stairTreads().slice(8));
 assert.deepEqual(stairTreads('first'),baseline.stairTreads());
 for(const r of rooms.filter(r=>r.id!=='g-living'&&!FIXTURE_ROOMS.includes(r.id)))assert.deepEqual(r.box,baseline.rooms.find(b=>b.id===r.id).box);
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
  if(l!=='ground'){assert.deepEqual({walls,openings},{walls:fixedArchitecture[l].walls,openings:fixedArchitecture[l].openings});continue;}
  assert.deepEqual(openings.filter(o=>!o.storeDoor),fixedArchitecture.ground.openings);
  assert.deepEqual(openings.filter(o=>o.storeDoor),[door]);
  // The retained partition beside the bedroom door keeps its wall above the 1.40 m door head; nothing else moves.
  const expected=fixedArchitecture.ground.walls.map(p=>sameBox(p.box,door.box)&&p.bottom===0?{...p,bottom:door.height}:p);
  assert.deepEqual(walls,expected);
  assert.equal(walls.filter(p=>sameBox(p.box,door.box)).length,1);
  assert.notDeepEqual(walls,fixedArchitecture.ground.walls);
 }
 const boundaries=rooms.filter(r=>!FIXTURE_ROOMS.includes(r.id)).map(r=>({id:r.id,box:r.box,...(r.regions?{regions:r.regions}:{})}));
 assert.deepEqual(boundaries,fixedArchitecture.rooms);
});
test('rectangular cabinet stays beneath the high end of the lower flight; doors now clear the basin and are reached from the wash side',()=>{
 assert.equal(revision.storage.length,1);const c=revision.storage[0],w=revision.wash;
 near(c.box[3]-c.box[1],.5);near(c.box[2]-c.box[0],.55);near(c.height,1.08);
 assert.ok(c.box[1]>=4.2&&c.box[3]<=4.7&&c.box[0]>=.15&&c.box[2]<=1.05);
 assert.ok(!('topHeights' in c));assert.equal(c.doorLeaves,2);
 for(const step of stairTreads().slice(2,8).filter(s=>overlaps(s.box,c.box)))assert.ok(c.height<=step.height-T);
 for(const b of [w.box,revision.partition.box,revision.store.box,revision.tv.box,revision.tv.panel,revision.closingPanel.box])assert.ok(!overlaps(c.doorSweep,b));
 near(c.standing[2]-c.standing[0],.4);near(c.standing[0],1.15);near(c.standing[2],w.box[0]);
 assert.ok(!overlaps(c.standing,w.box));assert.ok(clearance(c.standing)>=1.99);assert.ok(clearance(c.standing)<2.2);
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
 for(const step of stairTreads().slice(9).filter(s=>s.box[3]>t.panel[1]&&s.box[1]<t.panel[3]))assert.ok(t.panelHeight<step.height-T);
});
test('under-landing store fills the 1.47 m zone with a stepped top clear of every soffit and a passage-face door',()=>{
 const s=revision.store,zones=s.zones,cabinet=revision.storage[0];
 near(zones.reduce((a,z)=>a+(z.box[2]-z.box[0])*(z.box[3]-z.box[1]),0),(s.box[2]-s.box[0])*(s.box[3]-s.box[1]));
 for(let i=0;i<zones.length;i++)for(let j=i+1;j<zones.length;j++)assert.ok(!overlaps(zones[i].box,zones[j].box));
 for(const z of zones){
  assert.ok(z.box[0]>=s.box[0]-eps&&z.box[2]<=s.box[2]+eps&&z.box[1]>=s.box[1]-eps&&z.box[3]<=s.box[3]+eps);
  const c=clearance(z.box);assert.ok(Number.isFinite(c),z.over);near(Math.round(c*100)/100,z.clear);assert.ok(z.top<=c-.045,z.over);
 }
 near(WALL-s.box[3],0);near(WALL-s.box[1],1.35);near(revision.partition.box[3],s.box[1]);
 const floor=(s.box[2]-s.box[0])*(s.box[3]-s.box[1]),volume=zones.reduce((a,z)=>a+(z.box[2]-z.box[0])*(z.box[3]-z.box[1])*z.top,0);
 assert.ok(floor>2.5&&floor<2.7);assert.ok(volume>3.6&&volume<3.9);
 assert.ok(volume>10*(cabinet.box[2]-cabinet.box[0])*(cabinet.box[3]-cabinet.box[1])*cabinet.height);
 const d=s.door;assert.deepEqual(d.box,[2.05,5.2,2.15,6.1]);assert.equal(d.leaves,2);near(d.leaves*d.leafWidth,d.box[3]-d.box[1]);
 assert.ok(d.height<=9*R-T);assert.ok(d.sweep[3]<=6.1+eps&&d.sweep[2]-2.15<=.25+eps);
 const aperture=storageWallOpenings.find(o=>o.storeDoor);near(aperture.height,d.height);assert.deepEqual(aperture.box,d.box);
 assert.ok(wallPieces('ground').some(p=>sameBox(p.box,d.box)&&Math.abs(p.bottom-d.height)<eps&&p.top===2.85));
 assert.ok(!overlaps(s.box,cabinet.box));assert.ok(!overlaps(s.box,revision.wash.box));assert.ok(!overlaps(s.box,revision.wash.standing));
 assert.match(s.wallCut,/engineer/);assert.match(s.fallback,/no wall change/);
});
test('basin sits 1.40-1.75 m from the bedroom wall; the user faces WEST with 2.17 m or more overhead',()=>{
 const w=revision.wash,pt=revision.partition;
 near(w.box[2]-w.box[0],.5);near(w.box[3]-w.box[1],.35);assert.equal(w.userFaces,'W');assert.equal(w.front,'E');
 near(WALL-w.box[3],w.fromBedroomWall.basinBack);near(WALL-w.box[1],w.fromBedroomWall.basinFront);near(WALL-w.standing[1],w.fromBedroomWall.standingRear);
 near(w.fromBedroomWall.basinBack,1.4);near(w.fromBedroomWall.basinFront,1.75);
 near(w.box[3],pt.box[1]);near(w.standing[3],w.box[1]); // basin backs onto the partition; standing zone starts at the basin front (west is increasing plan y)
 near(w.box[2],2.05);assert.ok(w.box[2]<=revision.tv.panel[0]+eps);
 near(w.standing[2]-w.standing[0],.75);near(w.standing[3]-w.standing[1],.6);
 assert.ok(clearance(w.box)>=1.99);assert.ok(clearance(w.leanStrip)>=2.17);assert.ok(clearance(w.bodyLine)>=2.35);assert.ok(clearance(w.standing)>=2.17);
 assert.ok(clearance(w.bodyLine)>=revision.headroomBenchmark);
 assert.ok(clearance(w.leanStrip)<revision.headroomBenchmark); // disclosed: the 150 mm leaning strip is 30 mm under the 2.20 m benchmark
 assert.ok(clearance([1.3,WALL-2.6,2.05,WALL-w.fallbackFront])>=2.35); // disclosed fallback keeps 2.35 m everywhere
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

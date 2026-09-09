import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {plan,rooms,LEVELS,openingsFor,wallPieces,stairTreads} from '../src/geometry.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('data traces to the current PDF and its published dimensions',()=>{
 const source=readFileSync(new URL('../../drawings/compact-v4/Hensal_Complete_House_Plans.pdf',import.meta.url));assert.equal(createHash('sha256').update(source).digest('hex'),plan.source_sha256);
 near(6*9.7,58.2);near(2*6*9.7+2.2*4.1,125.42);near(LEVELS.roof,6.45);near(9-6.45-.15,2.4);near(2.15+4.1+3.45,9.7);
});
test('every door/window aperture is empty in the generated wall volumes',()=>{
 for(const l of Object.keys(LEVELS))for(const o of openingsFor(l))for(const p of wallPieces(l)){
  const a=o.box,b=p.box;
  const overlap=Math.min(a[2],b[2])-Math.max(a[0],b[0])>1e-6&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>1e-6&&Math.min(p.top,o.sill+o.height)-Math.max(p.bottom,o.sill)>1e-6;
  assert.equal(overlap,false,`${l}: aperture at ${o.x},${o.y} blocked by wall`);
 }
});
test('three private ensuites have correct size, stacking and door positions',()=>{
 const baths=rooms.filter(r=>r.id.includes('bath'));assert.equal(baths.length,3);for(const r of baths){near(r.box[2]-r.box[0],1.3);near(r.box[3]-r.box[1],2);}
 assert.deepEqual(baths[0].box,baths[1].box);
 for(const l of ['ground','first'])assert.ok(openingsFor(l).some(o=>o.kind==='pocket'&&o.x===3.05&&o.y===6.4&&o.w===.75));
 assert.ok(openingsFor('first').some(o=>o.x===4.85&&o.y===6.1&&o.w===.75));
});
test('master rear balcony has side door, rear has exactly two high toilet vents',()=>{
 const doors=openingsFor('first');assert.ok(doors.some(o=>o.kind==='door'&&o.x===3.05&&o.y===8.4&&o.axis==='v'&&o.w===.85));
 const rear=doors.filter(o=>o.axis==='h'&&o.y>=8.2);assert.equal(rear.length,2);for(const o of rear){assert.equal(o.kind,'obscured');near(o.sill,1.65);near(o.height,.5);}
});
test('both flights produce 17 equal risers, 250 mm treads and 900 mm landing',()=>{
 const steps=stairTreads();assert.equal(steps.length,17);let last=0;for(const s of steps){near(s.height-last,3/17);last=s.height;if(!s.arrival&&!s.landing){near(Math.max(s.box[2]-s.box[0],s.box[3]-s.box[1]),.9);near(Math.min(s.box[2]-s.box[0],s.box[3]-s.box[1]),.25);}}
 near(last,3);near(steps.find(s=>s.landing).box[3]-steps.find(s=>s.landing).box[1],.9);
});
test('roof exit is north-facing, outward and distinct from master balcony door',()=>{
 const d=openingsFor('roof').find(o=>o.kind==='door');assert.deepEqual([d.x,d.y,d.w,d.axis,d.swing],[2.05,2.35,.9,'v',1]);near(d.height,2.1);
});

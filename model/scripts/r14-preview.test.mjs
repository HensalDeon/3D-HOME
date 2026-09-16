import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createHouse} from '../src/house.js';
import {revision} from '../src/revision.js';
import {TV_PREVIEW as t} from '../src/tv-joinery-preview.js';
import {stairLandingSlabs,STAIR_STRUCTURE} from '../src/geometry.js';
import layout from '../src/under-stair-layout.json' with {type:'json'};
const h=createHouse(),g=h.root.getObjectByName('R14 fitted TV joinery under the lower flight');
const profile=g.userData.preview.profile,stairs=h.levels.ground.getObjectByName('stairs');
// The soffit is the structural group only, on the same rule the joinery itself is set out from:
// the 20 mm stone riser plates are finish on the face of the step above, one of which hangs 26 mm
// below the landing slab in a 20 mm strip at the foot of the flight. Where the landing concrete is
// set back behind its riser plate there is no structural mesh overhead, and the landing's own
// soffit is the answer - which is what the drawn section shows.
const structure=stairs.children.find(c=>c.isGroup&&/RCC stair structure/.test(c.name));
const soffit=(x,y)=>{
 const ray=new THREE.Raycaster(h.V(x,.46,y),new THREE.Vector3(0,1,0));
 const hit=ray.intersectObject(structure,true).find(hh=>hh.object.isMesh);
 const landing=stairLandingSlabs('ground').filter(s=>!s.onGround&&y>=s.box[1]&&y<=s.box[3]&&x>=s.box[0]&&x<=s.box[2]);
 const over=[...(hit?[hit.point.y-.45]:[]),...landing.map(s=>s.top-STAIR_STRUCTURE.landingZone)];
 return over.length?Math.min(...over):null;
};
const overlap=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>1e-7&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>1e-7;
const top=y=>{for(let i=1;i<profile.length;i++){const a=profile[i-1],b=profile[i];if(y>=a[0]-1e-8&&y<=b[0]+1e-8&&b[0]>a[0])return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);}throw Error('outside profile');};
test('R14 joinery stays shallow, within the lower-flight footprint and clear of all access',()=>{
 assert.ok(t.cabinet[0]>=.15 && t.cabinet[2]<1.05);
 assert.ok(Math.abs(t.cabinet[2]-t.cabinet[0]-.35)<1e-6);
 for(const b of [t.cabinet,t.panel,t.screen])for(const clear of [revision.wash.box,revision.wash.standing,[2.05,5.2,2.15,6.1],[2.15,3.2,3.15,5.2]])assert.ok(!overlap(b,clear));
 assert.ok(t.screen[1]>4.1&&t.screen[3]<t.endBay[0]);
 assert.ok(t.screenTop+.05<top(t.screen[1]));
 assert.ok(t.screenBottom>t.cabinetTop);
});
test('R14 backing follows the actual diagonal mesh, with at least 60 mm vertical clearance',()=>{
 stairs.updateWorldMatrix(true,true);
 for(let y=t.panel[1]+.001;y<t.panel[3];y+=.007){
  for(const x of [t.panel[0]+.001,.99]){
   const s=soffit(x,y);
   assert.ok(s!==null,`no stair over joinery at ${x},${y}`);
   assert.ok(s-top(y)>=.0599,`insufficient gap at ${x},${y}`);
  }
 }
 // The dominant run is the actual lower-flight slope; no translated upper-flight diagonal. It runs
 // to the foot of the flight at the published y, not past it - the 0.13 m plan overrun the rotated
 // waist box used to add is gone, so the rake is 1.47 m rather than the 1.60 m it used to measure.
 const rake=profile[1];assert.ok(rake[0]-profile[0][0]>1.4);
 assert.ok(Math.abs(rake[0]-layout.tv.panelTopProfile[1][0])<.01,`rake ends at ${rake[0]}`);
 assert.ok(Math.abs((rake[1]-profile[0][1])/(rake[0]-profile[0][0])-12/17)<1e-6);
 assert.ok(profile.at(-1)[1]<1.90);
 assert.equal(revision.tv.wallOpening.height,2.1);assert.equal(revision.tv.wallOpening.headerTop,2.85);
});

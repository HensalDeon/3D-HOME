// Export the approved mesh coordinates verbatim; rendering materials are assigned separately.
import * as THREE from 'three';
import {createHouse} from '../src/house.js';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),h=createHouse();
h.root.updateMatrixWorld(true,true);
const aliases=new Map(Object.entries(h.materials).map(([name,m])=>[m.uuid,name]));
const objects=[];
function collect(group){group.traverse(o=>{
 if(!o.isMesh)return;
 const g=o.geometry,p=g.getAttribute('position'),n=g.getAttribute('normal');
 const normalMatrix=new THREE.Matrix3().getNormalMatrix(o.matrixWorld),v=new THREE.Vector3();
 const positions=[],normals=[];
 for(let i=0;i<p.count;i++){
  v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);positions.push([v.x,-v.z,v.y]);
  if(n){v.fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);normals.push([v.x,-v.z,v.y]);}
 }
 const indices=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,i)=>i);
 const path=[];for(let p=o;p;p=p.parent)if(p.name)path.unshift(p.name);
 // Wall/aperture materials are cloned for UI controls, so UUID alone cannot identify them.
 // Invisible room-picking planes must remain transparent to all render rays.
 const m=o.material;
 const matched=Object.entries(h.materials).find(([,candidate])=>candidate.color.equals(m.color)&&candidate.transparent===m.transparent);
 let material=aliases.get(m.uuid)||matched?.[0]||'stone';
 if(m.transparent&&m.opacity===0)material='invisible';
 let visible=true;for(let p=o;p;p=p.parent)visible&&=p.visible;
 objects.push({id:objects.length,name:path.join(' / ')||'house mesh',material,visible,positions,normals,indices});
 });}
collect(h.levels.ground);
// The exact ceiling slab selection used by the approved R14 eye-level render.
for(const mesh of h.levels.first.children.filter(o=>o.isMesh)){
 const b=new THREE.Box3().setFromObject(mesh);
 if(Math.abs(b.min.y-3.30)<.001&&Math.abs(b.max.y-3.45)<.001)collect(mesh);
}
const sourceFiles=['house.js','geometry.js','tv-joinery-preview.js','under-stair-layout.json','plan-data.json','structural-frame.json','revision.js'];
const sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async name=>[name,createHash('sha256').update(await readFile(new URL('model/src/'+name,root))).digest('hex')])));
const cameras=[
 {file:'02-living-wide.png',eye:[5.0,3.1,1.55],at:[1.0,4.72,1.13],fov:59},
 {file:'03-stair-tv-wide.png',eye:[3.95,3.3,1.55],at:[1.0,4.60,1.05],fov:62},
 // Same approved close-up viewpoint; a tighter lens frames the cabinet and shelves.
 {file:'04-storage-wide.png',eye:[3.95,3.3,1.55],at:[1.0,4.60,1.05],fov:43},
];
const payload={revision:'R14 approved',coordinateTransform:'Blender (x,y,z) = Three (x,-z,y)',sourceHashes,cameras,objects};
await mkdir(new URL('interiors/.source/render/',root),{recursive:true});
await writeFile(new URL('interiors/.source/render/approved-model.json',root),JSON.stringify(payload));
console.log(`Exported ${objects.length} unchanged meshes, ${objects.reduce((a,o)=>a+o.indices.length/3,0)} triangles.`);

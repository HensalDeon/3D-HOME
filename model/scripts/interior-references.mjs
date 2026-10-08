// Software projection of the actual Three.js model: geometry references, never final photos.
import {PerspectiveCamera,Vector3,Box3} from 'three';
import {createHouse} from '../src/house.js';
import {LEVELS} from '../src/geometry.js';
import {revision} from '../src/revision.js';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const option=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
const out=pathToFileURL(resolve(option('--output')??'/tmp/hensal-interior-references')+'/');
await mkdir(out,{recursive:true});
const views=[
 // Living camera faces the bedroom/ensuite frontage squarely; lens shift includes the TV bay.
 {id:'02-living-wide',level:'ground',eye:[4.9,1.55,1.55],at:[4.9,6.8,1.55],fov:85,shiftX:-230},
 // Overview footprint review; the finished photograph retains its own composition.
 {id:'02-ground-floor-overview-wide',level:'ground',eye:[5.0,2.2,1.55],at:[2.6,5.8,1.3],fov:75},
 {id:'07-bedroom1-opposite',level:'ground',eye:[2.75,9.25,1.5],at:[1.5,6.6,1.35],fov:65},
 {id:'08-bedroom2-opposite',level:'first',eye:[2.75,9.05,1.5],at:[1.5,6.6,1.35],fov:65},
 {id:'09-bedroom3-wide',level:'first',eye:[4.8,5.85,1.5],at:[5.04,2.98,1.3],fov:65},
 {id:'09-bedroom3-detail',level:'first',eye:[4.95,4.25,1.4],at:[5.15,3.0,1.5],fov:65},
 {id:'10-study-storage',level:'first',eye:[1.75,3.00,1.5],at:[1.65,.50,1.35],fov:78},
 {id:'10-passage-wide',level:'first',eye:[2.65,5.95,1.5],at:[2.65,.75,1.35],fov:70}
];
const selectedViews=views.filter(v=>!option('--view')||v.id===option('--view'));
if(!selectedViews.length)throw new Error('Unknown --view; use one of: '+views.map(v=>v.id).join(', '));
const h=createHouse();h.root.updateMatrixWorld(true,true);
const W=1536,H=1024;
function clip(poly){
 const result=[];
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],ia=a.z<=-.05,ib=b.z<=-.05;
  if(ia)result.push(a);
  if(ia!==ib){const t=(-.05-a.z)/(b.z-a.z);result.push(a.clone().lerp(b,t));}
 }
 return result;
}
const hashes={};
for(const n of ['house.js','geometry.js','storage-layout.json','storage-joinery.js','plan-data.json','structural-frame.json','under-stair-layout.json','stair-passage-layout.json','revision.js'])hashes[n]=createHash('sha256').update(await readFile(new URL('../src/'+n,import.meta.url))).digest('hex');
for(const view of views.filter(v=>!option('--view')||v.id===option('--view'))){
 const camera=new PerspectiveCamera(view.fov,W/H,.05,100);
 if(view.shiftX)camera.setViewOffset(W,H,view.shiftX,0,W,H);
 camera.position.copy(h.V(view.eye[0],LEVELS[view.level]+view.eye[2],view.eye[1]));
 camera.lookAt(h.V(view.at[0],LEVELS[view.level]+view.at[2],view.at[1]));camera.updateMatrixWorld();
 const tris=[];let count=0;
 function collect(group){group.traverse(o=>{
  if(!o.isMesh||o.material.opacity===0)return;
  const bounds=new Box3().setFromObject(o);
  if(!o.material.transparent&&bounds.containsPoint(camera.position))throw Error(view.id+' camera inside '+o.name);
  const p=o.geometry.attributes.position,ix=o.geometry.index?.array??Array.from({length:p.count},(_,i)=>i),verts=[];
  for(let i=0;i<p.count;i++)verts.push(new Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse));
  count++;
  for(let i=0;i<ix.length;i+=3){
   const raw=[verts[ix[i]],verts[ix[i+1]],verts[ix[i+2]]],poly=clip(raw);if(poly.length<3)continue;
   const depth=poly.reduce((s,v)=>s-v.z,0)/poly.length;
   const normal=raw[1].clone().sub(raw[0]).cross(raw[2].clone().sub(raw[0])).normalize();
   const shade=.68+.32*Math.abs(normal.dot(new Vector3(.3,.7,.4).normalize()));
   const color=o.material.color.clone().multiplyScalar(shade).getStyle();
   const points=poly.map(v=>{const q=v.clone().applyMatrix4(camera.projectionMatrix);return [(q.x+1)*W/2,(1-q.y)*H/2,-1/v.z];});
   if(points.every(p=>p[0]<0)||points.every(p=>p[0]>W)||points.every(p=>p[1]<0)||points.every(p=>p[1]>H))continue;
   const hex=o.material.color.clone().multiplyScalar(shade).getHex();
   tris.push({depth,points,color,rgb:[hex>>16,(hex>>8)&255,hex&255],opacity:o.material.transparent?o.material.opacity:1});
  }
 });}
 collect(h.levels[view.level]);
 // Actual slab above the selected level; no artificial open ceiling or cutaway walls.
 const upper=h.levels[view.level==='ground'?'first':'roof'];
 for(const o of upper.children.filter(o=>o.isMesh)){
  const b=new Box3().setFromObject(o);if(Math.abs(b.min.y-(LEVELS[view.level]+2.85))<.001&&Math.abs(b.max.y-(LEVELS[view.level]+3))<.001)collect(o);
 }
 tris.sort((a,b)=>b.depth-a.depth);
 // Perspective-correct depth buffer avoids painter-order errors where cabinets meet walls.
 const pixels=Buffer.alloc(W*H*3),depths=new Float64Array(W*H);depths.fill(Infinity);
 for(let i=0;i<W*H;i++){pixels[i*3]=234;pixels[i*3+1]=230;pixels[i*3+2]=221;}
 for(const tri of tris){
  if(tri.opacity<1)continue; // glazing is transparent in this geometry-only reference
  for(let fan=1;fan<tri.points.length-1;fan++){
   const [a,b,c]=[tri.points[0],tri.points[fan],tri.points[fan+1]],den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
   if(Math.abs(den)<1e-8)continue;
   const x0=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),x1=Math.min(W-1,Math.ceil(Math.max(a[0],b[0],c[0]))),y0=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),y1=Math.min(H-1,Math.ceil(Math.max(a[1],b[1],c[1])));
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const u=((b[1]-c[1])*(x+.5-c[0])+(c[0]-b[0])*(y+.5-c[1]))/den,v=((c[1]-a[1])*(x+.5-c[0])+(a[0]-c[0])*(y+.5-c[1]))/den,w=1-u-v;
    if(u<0||v<0||w<0)continue;
    const d=1/(u*a[2]+v*b[2]+w*c[2]),i=y*W+x;if(d>=depths[i]-1e-8)continue;
    depths[i]=d;pixels[i*3]=tri.rgb[0];pixels[i*3+1]=tri.rgb[1];pixels[i*3+2]=tri.rgb[2];
   }
  }
 }
 await writeFile(new URL(view.id+'.ppm',out),Buffer.concat([Buffer.from(`P6\n${W} ${H}\n255\n`),pixels]));
 view.meshCount=count;view.triangleCount=tris.length;
}
await writeFile(new URL('geometry-audit.json',out),JSON.stringify({revision:revision.id,method:'Perspective projection of actual Three.js meshes; flat geometry reference only; no photographic presentation substituted',sourceHashes:hashes,views:selectedViews},null,2)+'\n');
console.log(`Exported ${selectedViews.length} current-model geometry references.`);

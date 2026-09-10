// Internal geometry reference only. Captures the existing COMPLETE house, no cutaways.
import {chromium} from '../../model/node_modules/playwright/index.mjs';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {readdir,mkdir,readFile,writeFile} from 'node:fs/promises';
const out=resolve('interiors/.source/qa/source-cameras');await mkdir(out,{recursive:true});
let executablePath;
if(!existsSync(chromium.executablePath()))for(const f of(await readdir(join(homedir(),'Library/Caches/ms-playwright'))).filter(n=>/^chromium-/.test(n)).sort().reverse()){
 const p=join(homedir(),'Library/Caches/ms-playwright',f,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');if(existsSync(p)){executablePath=p;break;}
}
const browser=await chromium.launch({headless:true,...executablePath?{executablePath}:{}});
const page=await browser.newPage({viewport:{width:1536,height:1024}});
await page.goto('http://127.0.0.1:5173/');
const filter=process.argv.slice(2);
const views=JSON.parse(await readFile('interiors/.source/cameras.json','utf8')).filter(v=>!filter.length||filter.includes(v.id));
const log=[];
for(const v of views){
 await page.setViewportSize({width:v.width??1536,height:v.height??1024});
 const check=await page.evaluate(async v=>{
  const THREE=await import('/node_modules/three/build/three.module.js');
  const {createHouse}=await import('/src/house.js');
  const {wallPieces,LEVELS,rooms,openingsFor}=await import('/src/geometry.js');
  const h=createHouse(),scene=new THREE.Scene();scene.background=new THREE.Color('#d9e7ed');
  if(v.familyLayout){
   // User's 10 September preference: restore sofa + side desk within the unchanged study.
   const f=h.furnitureGroups[1];f.traverse(o=>{if(o.isMesh){const b=new THREE.Box3().setFromObject(o),p=b.getCenter(new THREE.Vector3()),x=p.x+3,y=4.85-p.z;if(x>.15&&x<3.05&&y>.15&&y<2.2)o.visible=false;}});
   const g=new THREE.Group();g.name='User preferred family sofa and side desk';h.levels.first.add(g);
   const box=(b,lo,hi,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(b[2]-b[0],hi-lo,b[3]-b[1]),m);o.position.copy(h.V((b[0]+b[2])/2,3.45+(lo+hi)/2,(b[1]+b[3])/2));g.add(o);};
   box([.25,.15,1.75,.8],.12,.45,h.materials.oak);box([.25,.15,1.75,.8],.45,.55,h.materials.fabric);
   box([.25,.15,1.75,.26],.45,.92,h.materials.fabric);
   box([.25,.15,.35,.8],.4,.7,h.materials.fabric);box([1.65,.15,1.75,.8],.4,.7,h.materials.fabric);
   box([2.6,.3,3.05,1.3],.72,.78,h.materials.oak);
   box([2.62,.3,3.02,.35],0,.72,h.materials.oak);box([2.62,1.25,3.02,1.3],0,.72,h.materials.oak);
   box([2.0,.57,2.42,1.0],.40,.47,h.materials.fabric);box([1.97,.57,2.04,1.0],.4,.82,h.materials.oak);
   for(const x of [2.01,2.35])for(const y of [.60,.94])box([x,y,x+.04,y+.04],0,.4,h.materials.oak);
   const stool=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.4,24),h.materials.oak);stool.position.copy(h.V(1,.4/2+3.45,1.15));g.add(stool);
   box([.35,.85,1.75,1.85],.011,.018,h.materials.linen);
  }
  if(v.closeKitchenDoor){
   // Articulate the EXISTING west-entry leaf about its existing hinge; no aperture is moved.
   const ap=h.levels.ground.getObjectByName('apertures');let found=0;
   ap.traverse(o=>{if(o.isMesh&&Math.abs(o.position.x+.9)<1e-5&&Math.abs(o.position.z-3.05)<1e-5&&Math.abs((o.geometry.parameters?.depth??0)-.8)<1e-5){
    const pivot=h.V(2.1,.45,2.2),axis=new THREE.Vector3(0,1,0);
    o.position.sub(pivot).applyAxisAngle(axis,Math.PI/2).add(pivot);o.rotateY(Math.PI/2);found++;
   }});
   if(found!==1)throw new Error('Could not identify the approved kitchen leaf: '+found);
  }
  scene.add(h.root);h.dimensions.visible=false;
  // Remove only diagrammatic line overlays, retaining every wall, opening, flight and furnishing.
  h.root.traverse(o=>{if(o.isLine)o.visible=false;});
  const width=v.width??1536,height=v.height??1024;
  const camera=new THREE.PerspectiveCamera(v.fov??65,width/height,.02,100);
  camera.position.copy(h.V(v.from[0],LEVELS[v.level]+v.from[2],v.from[1]));
  camera.lookAt(h.V(v.to[0],LEVELS[v.level]+v.to[2],v.to[1]));
  const [x,y,eye]=v.from;
  const wallHits=wallPieces(v.level).filter(p=>x>p.box[0]&&x<p.box[2]&&y>p.box[1]&&y<p.box[3]&&eye>p.bottom&&eye<p.top);
  const inRooms=rooms.filter(r=>r.level===v.level&&(r.regions??[r.box]).some(b=>x>b[0]&&x<b[2]&&y>b[1]&&y<b[3])).map(r=>r.id);
  if(wallHits.length)throw new Error(v.id+' camera inside wall');
  scene.add(new THREE.HemisphereLight('#fff8eb','#a5a098',1.8));
  const sun=new THREE.DirectionalLight('#fff7e9',2);sun.position.set(5,13,12);scene.add(sun);
  // Fill light represents exposure for a geometry audit, not an architectural fixture proposal.
  const fill=new THREE.PointLight('#fff6e5',2,20,2);fill.position.copy(camera.position);scene.add(fill);
  const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});r.setSize(width,height);r.setPixelRatio(1);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.0;
  document.body.replaceChildren(r.domElement);r.domElement.style.cssText=`position:fixed;inset:0;width:${width}px;height:${height}px`;
  r.render(scene,camera);
  const openingProjections=openingsFor(v.level).filter(o=>o.kind==='window').map(o=>{
   const corners=[0,o.w].flatMap(d=>[o.sill,o.sill+o.height].map(z=>{const p=h.V(o.x+(o.axis==='h'?d:0),LEVELS[v.level]+z,o.y+(o.axis==='v'?d:0)).project(camera);return [Math.round((p.x+1)*width/2),Math.round((1-p.y)*height/2),p.z];}));return {plan:[o.x,o.y,o.w],sill:o.sill,head:o.sill+o.height,corners};
  });
  const meshes=[];h.root.traverse(o=>{if(o.isMesh)meshes.push(o);});
  const withinMeshes=meshes.filter(o=>{const b=new THREE.Box3().setFromObject(o);return b.containsPoint(camera.position)&&!o.material.transparent;}).map(o=>o.name||o.parent.name||'unnamed mesh');
  return {id:v.id,level:v.level,planCamera:v.from,planTarget:v.to,verticalFov:camera.fov,inRooms,wallHits:wallHits.length,possibleMeshIntersections:withinMeshes,fullModel:true,architectureClipped:false,kitchenDoorPose:v.closeKitchenDoor?'closed on existing hinge':'source open pose',familyLayout:!!v.familyLayout,openingProjections};
 },v);
 await page.screenshot({path:join(out,v.id+'.png')});log.push(check);
}
let prior=[];try{prior=JSON.parse(await readFile(join(out,'camera-audit.json'),'utf8'));}catch{}
await writeFile(join(out,'camera-audit.json'),JSON.stringify([...prior.filter(v=>!log.some(n=>n.id===v.id)),...log],null,2)+'\n');
await browser.close();console.log(JSON.stringify(log));

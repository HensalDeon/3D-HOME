import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createHouse} from './house.js';
import {rooms,LEVELS,plan} from './geometry.js';
import assets from './assets.json';
import revisionAssets from './revision-assets.json';
import {revision} from './revision.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const viewport=$('#viewport'),scene=new THREE.Scene();scene.background=new THREE.Color('#e9ece3');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});}
catch(e){$('#loading').textContent='This device could not start the 3D view. Enable hardware acceleration or open this file in a WebGL-capable browser.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.localClippingEnabled=true;viewport.prepend(renderer.domElement);
const perspective=new THREE.PerspectiveCamera(36,1,.1,150),ortho=new THREE.OrthographicCamera(-10,10,10,-10,.1,150);let camera=perspective;
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.maxPolarAngle=Math.PI*.495;controls.minDistance=4;controls.maxDistance=65;controls.minZoom=.4;controls.maxZoom=5;
scene.add(new THREE.HemisphereLight('#fffcef','#8a9b77',1.9));const sun=new THREE.DirectionalLight('#fff7e3',2.8);sun.position.set(-9,18,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.04;sun.shadow.bias=-.00015;sun.shadow.camera.far=65;sun.shadow.radius=4;scene.add(sun);scene.add(sun.target);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#e9ece3',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.28;floor.receiveShadow=true;scene.add(floor);
const house=createHouse();scene.add(house.root);
const state={mode:'exterior',view:'perspective',cutaway:false,explode:false,wallHeight:2.85,labels:true,dimensions:false,structure:false,furniture:true,site:true,selected:null};
const horizontalPlanes={};for(const level of Object.keys(LEVELS))horizontalPlanes[level]=new THREE.Plane(new THREE.Vector3(0,-1,0),20);
const cutPlane=new THREE.Plane(new THREE.Vector3(0,0,-1),.30);
let cameraTween=null,needsRender=true,toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000);}
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h);perspective.aspect=w/h;perspective.updateProjectionMatrix();const size=state.explode?15:11;ortho.left=-size*w/h;ortho.right=size*w/h;ortho.top=size;ortho.bottom=-size;ortho.updateProjectionMatrix();needsRender=true;}
new ResizeObserver(resize).observe(viewport);
const initialColors=new Map(house.pickables.map(m=>[m,m.material.color.clone()]));
function clearSelection(){state.selected=null;for(const mesh of house.pickables)mesh.material.color.copy(initialColors.get(mesh));}
function offsets(){return state.explode?{ground:0,first:4.4,roof:8.8}:{ground:0,first:0,roof:0};}
function setCamera(view='perspective',animate=true){
 if(view!=='perspective')animate=false;
 state.view=view;$$('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));
 const isFloor=['ground','first','roof'].includes(state.mode),lev=isFloor?LEVELS[state.mode]:0;
 let target=new THREE.Vector3(0,isFloor?lev+.25:state.explode?7.7:3.05,0),pos;
 const mobile=viewport.clientWidth<600,span=state.explode?1.36:1;
 if(view==='perspective'){const distance=isFloor?18:mobile?36:27;pos=new THREE.Vector3(-distance*.63*span,target.y+distance*(isFloor?.94:.62)*span,distance*.93*span);}
 else if(view==='front')pos=new THREE.Vector3(0,target.y,35);
 else if(view==='rear')pos=new THREE.Vector3(0,target.y,-35);
 else{pos=new THREE.Vector3(0,target.y+38,.001);target.z=0;}
 const nextCamera=view==='perspective'?perspective:ortho;
 if(nextCamera!==camera){camera=nextCamera;controls.object=camera;animate=false;}
 controls.enableRotate=view==='perspective';
 if(camera===ortho){camera.up.set(0,1,0);ortho.zoom=isFloor?1.5:state.explode?.78:1.04;ortho.updateProjectionMatrix();}
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){cameraTween={from:camera.position.clone(),to:pos,fromTarget:controls.target.clone(),toTarget:target,start:performance.now()};}
 else{camera.position.copy(pos);controls.target.copy(target);camera.lookAt(target);controls.update();cameraTween=null;}
 resize();needsRender=true;
}
function defaultDetail(){
 const text={exterior:['A HOME WITH THREE LEVELS','Start outside. Then step into each floor.','Choose a level to see inside. Select a room to inspect its dimensions and design details.','+9.00 m','Roof enclosure cap'],ground:['GROUND FLOOR · +0.45 M','Everyday living, with a private bedroom.','Built-in stair-boundary TV with an open living floor. One built-in unit under the stair: store under the landing, mirror partition and west-facing basin.','58.20 m²','Gross floor envelope'],first:['FIRST FLOOR · +3.45 M','Private rooms. Shared breathing space.','Two bedroom suites, a family study, two covered balconies and the continuing stair to the roof.','58.20 m²','Gross floor envelope'],roof:['ROOF · +6.45 M','A full stair to an open terrace.','Setback enclosure, north-side exit, continuous guarding and an open services reserve.','9.02 m²','Additional enclosure area']}[state.mode];
 $('#detail-kicker').textContent=text[0];$('#detail-name').textContent=text[1];$('#detail-description').textContent=text[2];$('#detail-dimension').textContent=text[3];$('#detail-metric-caption').textContent=text[4];
}
function selectRoom(room){
 if(!room)return;
 clearSelection();state.selected=room;$('#room-picker').value=room.id;for(const m of house.pickables)if(m.userData.room.id===room.id&&!m.material.transparent)m.material.color.set('#bbcfa7');
 $('#detail-kicker').textContent=`${room.level.toUpperCase()} · SHEET ${String(room.sheet).padStart(2,'0')}`;$('#detail-name').textContent=room.name;$('#detail-description').textContent=room.description;$('#detail-dimension').textContent=room.dimensions;$('#detail-metric-caption').textContent='Drawing dimensions';needsRender=true;
}
$('#room-picker').addEventListener('change',e=>selectRoom(rooms.find(r=>r.id===e.target.value)));
const labelElements=house.labels.map(label=>{
 const el=document.createElement(label.type==='room'?'button':'span');el.className='room-label'+(label.type==='dimension'?' dimension-label':'');el.textContent=label.text;const sm=document.createElement('small');sm.textContent=label.detail;el.append(sm);el.hidden=true;$('#room-labels').append(el);if(label.room)el.addEventListener('click',()=>selectRoom(label.room));return {el,label};
});
function apply(){
 const isFloor=state.mode!=='exterior',off=offsets();
 for(const [level,g]of Object.entries(house.levels)){
  g.visible=!isFloor||level===state.mode;g.position.y=off[level];
  horizontalPlanes[level].constant=LEVELS[level]+off[level]+state.wallHeight;
  const cover=g.getObjectByName('cover');if(cover)cover.visible=!(isFloor||state.cutaway||state.explode);
 }
 floor.receiveShadow=!isFloor;house.site.visible=state.site&&!isFloor;house.dimensions.visible=state.dimensions;house.structuralFrame.visible=state.structure;house.siteDimensions.visible=!isFloor&&state.site;house.roofDimensions.visible=state.mode==='exterior'||state.mode==='roof';house.roofDimensions.position.y=off.roof;house.arrivalStair.visible=state.mode==='roof';
 for(const g of house.furnitureGroups)g.visible=state.furniture;
 for(const {group,level} of house.facades)group.visible=!isFloor&&!state.cutaway&&!state.explode&&state.wallHeight>=2.8;
 for(const {material,level} of house.wallMaterials){material.clippingPlanes=[...(state.wallHeight<2.85?[horizontalPlanes[level]]:[]),...(state.cutaway?[cutPlane]:[])];material.clipShadows=true;}
 // Interior cutaway removes the east half of the upper slabs and roof furniture too.
 for(const [level,g]of Object.entries(house.levels))g.traverse(o=>{
  if(!o.isMesh||house.wallMaterials.some(w=>w.material===o.material))return;
  if(!o.userData.originalMaterial)o.userData.originalMaterial=o.material;
  if(state.cutaway){if(!o.userData.cutMaterial){o.userData.cutMaterial=o.userData.originalMaterial.clone();o.userData.cutMaterial.clippingPlanes=[cutPlane];o.userData.cutMaterial.clipShadows=true;}o.material=o.userData.cutMaterial;}
  else o.material=o.userData.originalMaterial;
 });
 $$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));$('#cutaway').setAttribute('aria-pressed',state.cutaway);$('#explode').setAttribute('aria-pressed',state.explode);
 const titles={exterior:['THE COMPLETE PICTURE','Your home, from every angle.','6.00 × 9.70 m footprint · full roof access'],ground:['GROUND FLOOR / +0.45 M','A place for everyday life.','58.20 m² envelope · one bedroom with private ensuite'],first:['FIRST FLOOR / +3.45 M','Room to retreat. Space to connect.','58.20 m² envelope · two bedrooms, two ensuites'],roof:['ROOF TERRACE / +6.45 M','An open sky above your home.','9.02 m² stair enclosure · cap at +9.00 m']}[state.mode];
 $('#scene-kicker').textContent=titles[0];$('#scene-title').textContent=state.explode?'A closer look, layer by layer.':state.cutaway?'See how the spaces connect.':titles[1];$('#scene-subtitle').textContent=state.explode?'Floors separated by 4.40 m for inspection · levels remain in the notes':titles[2];
 $('#wall-output').textContent=state.wallHeight>=2.85?'Full':`${state.wallHeight.toFixed(2)} m`;$('#model-status').textContent=isFloor?'Select a room · dimensions from source':state.explode?'Separated view · display gaps are illustrative':'Dimensioned model · conceptual finishes';
 defaultDetail();
 const picker=$('#room-picker');picker.hidden=!isFloor&&!state.explode;picker.replaceChildren(new Option('Select a room…',''));
 for(const room of rooms.filter(r=>!isFloor||r.level===state.mode))picker.add(new Option(room.name,room.id));if(state.selected)selectRoom(state.selected);
 needsRender=true;
}
function setMode(mode){state.mode=mode;state.explode=false;state.cutaway=false;clearSelection();state.wallHeight=mode==='exterior'?2.85:.85;$('#wall-height').value=state.wallHeight;apply();setCamera('perspective');}
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>setCamera(b.dataset.view)));
$('#reset').addEventListener('click',()=>setCamera('perspective'));
$('#cutaway').addEventListener('click',()=>{state.cutaway=!state.cutaway;state.explode=false;state.mode='exterior';state.wallHeight=2.85;$('#wall-height').value=2.85;clearSelection();apply();setCamera('perspective');});
$('#explode').addEventListener('click',()=>{state.explode=!state.explode;state.cutaway=false;state.mode='exterior';state.wallHeight=state.explode?.9:2.85;$('#wall-height').value=state.wallHeight;clearSelection();apply();setCamera('perspective');});
for(const name of ['furniture','labels','dimensions','structure','site'])$('#'+name).addEventListener('change',e=>{state[name]=e.target.checked;apply();});
$('#wall-height').addEventListener('input',e=>{state.wallHeight=+e.target.value;apply();});
$('#screenshot').addEventListener('click',()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download=`Hensal-${state.mode}-${state.view}.png`;a.href=renderer.domElement.toDataURL('image/png');a.click();toast('3D view saved as a PNG.');});
let pointerStart;renderer.domElement.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};cameraTween=null;});
renderer.domElement.addEventListener('pointerup',e=>{
 if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>5||e.button!==0)return;
 const rect=renderer.domElement.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);
 const hits=ray.intersectObjects(house.pickables.filter(m=>m.parent.visible));if(hits.length&&state.mode!=='exterior')selectRoom(hits[0].object.userData.room);
});
viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;const d=.5;if(e.key==='ArrowLeft')controls.target.x-=d;else if(e.key==='ArrowRight')controls.target.x+=d;else if(e.key==='ArrowUp')controls.target.z-=d;else if(e.key==='ArrowDown')controls.target.z+=d;else if(e.key.toLowerCase()==='r')setCamera();else return;e.preventDefault();needsRender=true;});
const sheetTitles=['Cover & drawing index','Site & parking','Ground floor','First floor','Roof plan','Front & rear elevations','Stair geometry & Vastu','Stair section & headroom','Conceptual structural framing','Roof setbacks & exit','Historical style references','Current exterior appearance'];
let currentSheet=1;
function showSheet(n){currentSheet=n;$('#sheet-image').src=assets.sheets[n-1];$('#sheet-image').alt=`Sheet ${n}: ${sheetTitles[n-1]}`;$('#sheet-caption').textContent=`Sheet ${String(n).padStart(2,'0')} / 12 · ${sheetTitles[n-1]} · Coordinated set · R6 conceptual RCC stair on 03/07/08, R7 framing on 09`;$$('#sheet-list button').forEach((b,i)=>b.classList.toggle('active',i===n-1));}
for(let i=0;i<sheetTitles.length;i++){const b=document.createElement('button');b.textContent=`${String(i+1).padStart(2,'0')}  ${sheetTitles[i]}`;b.addEventListener('click',()=>showSheet(i+1));$('#sheet-list').append(b);}
$('#pdf-download').href=assets.pdf;
$('#stair-review').src=revisionAssets.stairReview;$('#facade-reference').src=revisionAssets.facadeReference;$('#revision-button').addEventListener('click',()=>$('#revision-dialog').showModal());
function openLibrary(n){showSheet(n);$('#library').showModal();}
$('#source-button').addEventListener('click',()=>openLibrary(currentSheet));$('#detail-source').addEventListener('click',()=>openLibrary(state.selected?.sheet??({ground:3,first:4,roof:5,exterior:6}[state.mode])));
$('#mobile-notes').addEventListener('click',()=>$('#assumptions').showModal());
$('#assumptions-button').addEventListener('click',()=>$('#assumptions').showModal());$$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('.brand').addEventListener('click',e=>{e.preventDefault();setMode('exterior');});
controls.addEventListener('change',()=>{needsRender=true;});
function updateLabels(){
 const w=viewport.clientWidth,h=viewport.clientHeight,off=offsets(),occupied=[];
 for(const {el,label} of labelElements){
  let visible=label.type==='dimension'?state.dimensions:state.labels&&(state.mode!=='exterior'||state.explode);
  if(label.level&&state.mode!=='exterior'&&label.level!==state.mode)visible=false;
  if(label.type==='dimension'&&!label.level&&(state.mode!=='exterior'||!state.site))visible=false;
  if(label.type==='room'&&state.view!=='top'&&state.wallHeight>1.6)visible=false;
  const pos=label.position.clone();if(label.level)pos.y+=off[label.level];pos.project(camera);
  const x=(pos.x*.5+.5)*w;let y=(-pos.y*.5+.5)*h;
  if(pos.z>1||pos.z< -1||x<20||x>w-20||y<115||y>h-90)visible=false;
  if(visible){
   el.hidden=false;const ew=el.offsetWidth,eh=el.offsetHeight;
   const overlap=(yy)=>occupied.some(b=>Math.abs(x-b.x)<(ew+b.w)/2+3&&Math.abs(yy-b.y)<(eh+b.h)/2+3);
   if(overlap(y)){if(!overlap(y-eh-6))y-=eh+6;else if(!overlap(y+eh+6))y+=eh+6;else visible=false;}
   if(visible)occupied.push({x,y,w:ew,h:eh});
  }
  el.hidden=!visible;if(visible){el.style.left=`${x}px`;el.style.top=`${y}px`;el.classList.toggle('selected',state.selected?.id===label.room?.id);}
 }
 const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion),north=new THREE.Vector3(1,0,0);const angle=Math.atan2(north.dot(right),north.dot(up));$('#north-arrow').style.transform=`rotate(${angle}rad)`;
}
let lastRender=0;
function animate(time){requestAnimationFrame(animate);
 if(document.hidden)return;
 if(cameraTween){const t=Math.min(1,(time-cameraTween.start)/750),e=t*t*(3-2*t);camera.position.lerpVectors(cameraTween.from,cameraTween.to,e);controls.target.lerpVectors(cameraTween.fromTarget,cameraTween.toTarget,e);if(t===1)cameraTween=null;needsRender=true;}
 controls.update();
 if(needsRender&&time-lastRender>16){renderer.render(scene,camera);updateLabels();needsRender=false;lastRender=time;}
}
apply();setCamera('perspective',false);$('#loading').remove();requestAnimationFrame(animate);
// Read-only QA summary exposes the source and the rendered state without changing it.
Object.defineProperty(window,'houseExplorer',{value:{get state(){return {...state,selected:state.selected?.id??null};},get audit(){return {revision:revision.status,source:plan.source,sha256:plan.source_sha256,camera:camera.position.toArray(),levelVisibility:Object.fromEntries(Object.entries(house.levels).map(([k,g])=>[k,g.visible])),roofArrivalVisible:house.arrivalStair.visible,counts:house.counts,rooms:rooms.length,levels:LEVELS,geometryMeshes:house.root.children.reduce((n,g)=>{g.traverse(o=>{if(o.isMesh)n++;});return n;},0),renderer:renderer.info.render};}}});

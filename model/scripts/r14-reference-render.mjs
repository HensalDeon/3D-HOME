// R14 LOCAL REVIEW / one eye-level view from the living room, framed to the approved reference image.
//
// The primary frame stands on the living floor, looking south-west, with the
// whole open staircase, the fitted TV composition under it and the separate washbasin nook in the
// same shot - the comparison the reference image asks for. Lighting is warm and interior-like
// rather than the flat QA lighting the other check scripts use, because the thing being judged is
// the composition, not the geometry.
//
// Requires the Vite dev server (npm run dev); override with DEV_SERVER=http://127.0.0.1:5178/.
import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const modelRoot=fileURLToPath(new URL('../',import.meta.url));
import {readdir,writeFile} from 'node:fs/promises';
let executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
if(!executablePath&&!existsSync(chromium.executablePath())&&process.platform==='darwin')for(const folder of(await readdir(join(homedir(),'Library/Caches/ms-playwright'))).filter(n=>/^chromium-/.test(n)).sort().reverse()){const p=join(homedir(),'Library/Caches/ms-playwright',folder,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');if(existsSync(p)){executablePath=p;break;}}
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
const page=await browser.newPage({viewport:{width:1800,height:1200}});
await page.goto(process.env.DEV_SERVER??'http://127.0.0.1:5173/');
// Plan coordinates: x increases north, y increases west, ground floor datum +0.45.
const views=[
 {name:'qa/approved-living-reference.png',eye:[5.0,3.1,1.55],at:[1.0,4.72,1.13],fov:59},
 {name:'qa/approved-joinery-reference.png',eye:[3.95,3.3,1.55],at:[1.0,4.60,1.05],fov:62},
 {name:'qa/approved-geometry-reference.png',eye:[5.2,1.55,3.8],at:[1.0,4.50,1.35],fov:50,geometry:true},
];
const results=[];
for(const v of views.filter(v=>!process.env.RENDER_ONLY||v.name.endsWith(process.env.RENDER_ONLY))){
 const result=await page.evaluate(async v=>{
  const THREE=await import('/node_modules/three/build/three.module.js');
  const {createHouse}=await import('/src/house.js');
  const h=createHouse(),scene=new THREE.Scene();scene.background=new THREE.Color('#efece4');
  // Finish detail only; no geometry is substituted or removed for the approval renders.
  h.materials.oak.onBeforeCompile=shader=>{
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vOakWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\nvOakWorld=(modelMatrix*vec4(position,1.0)).xyz;');
   shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vOakWorld;').replace('#include <color_fragment>',`#include <color_fragment>
    float grain=sin(vOakWorld.z*270.0+sin(vOakWorld.y*3.0+vOakWorld.z*12.0)*2.4);
    float fine=sin(vOakWorld.z*1100.0+sin(vOakWorld.y*11.0)*0.8);
    diffuseColor.rgb*=0.98+0.018*grain+0.008*fine;`);
  };
  h.materials.oak.needsUpdate=true;

  if(v.geometry){
   // Isolated inspection screenshot. All selected objects retain their real model transforms.
   for(const name of ['stairs','R14 fitted TV joinery under the lower flight','R12 washbasin nook against the bedroom (west) wall; basin faces east'])scene.add(h.levels.ground.getObjectByName(name).clone(true));
   const {wallPieces}=await import('/src/geometry.js');
   const header=wallPieces('ground').find(p=>p.box[0]===2.05&&p.box[1]===3.2&&Math.abs(p.bottom-2.1)<.001);
   if(!header)throw Error('Retained header missing');
   const b=header.box,bounds=new THREE.Box3(new THREE.Vector3(b[0]-3,.45+header.bottom,4.85-b[3]),new THREE.Vector3(b[2]-3,.45+header.top,4.85-b[1]));
   scene.add(new THREE.Box3Helper(bounds,'#728c9d'));
   const floor=h.levels.ground.children.find(o=>o.isMesh&&o.geometry.parameters.height===.45);
   if(floor)scene.add(floor.clone(true));
  }else scene.add(h.levels.ground.clone(true));
  // Use the actual first-floor slab meshes, preserving the real stairwell aperture.
  for (const mesh of (v.geometry?[]:h.levels.first.children.filter(o=>o.isMesh))) {
   const bounds=new THREE.Box3().setFromObject(mesh);
   if(Math.abs(bounds.min.y-3.30)<.001 && Math.abs(bounds.max.y-3.45)<.001)scene.add(mesh.clone(true));
  }
  const V=(x,z,y)=>new THREE.Vector3(x-3,z,4.85-y);
  // Warm interior light: a soft overall fill, one cool daylight wash from the living-room side,
  // and three warm point sources standing in for the concealed strips and the nook downlight.
  scene.add(new THREE.HemisphereLight('#fff4e0','#7e7c70',1.05));
  const day=new THREE.DirectionalLight('#fff1d6',.65);day.position.copy(V(4.5,3.0,2.5));day.target.position.copy(V(.8,1.2,4.4));
  day.castShadow=true;day.shadow.mapSize.set(2048,2048);day.shadow.camera.left=-4;day.shadow.camera.right=4;day.shadow.camera.top=4;day.shadow.camera.bottom=-4;day.shadow.normalBias=.008;day.shadow.bias=-.00005;scene.add(day,day.target);
  for(const [x,y,z,c,i,d] of [[2.55,4.10,2.60,'#ffd39a',1.2,3.0],[1.06,3.65,.075,'#ffcb8c',.025,.7],[1.06,4.35,.075,'#ffcb8c',.025,.7],[1.06,5.1,.075,'#ffcb8c',.025,.7],[1.80,5.90,1.85,'#ffd6a2',.35,1.8],[3.60,4.60,2.72,'#ffe8c6',1.5,4.2]])
   {const l=new THREE.PointLight(c,i,d);l.position.copy(V(x,.45+z,y));scene.add(l);}
  const camera=new THREE.PerspectiveCamera(v.fov,1800/1200,.05,60);
  camera.position.copy(V(v.eye[0],.45+v.eye[2],v.eye[1]));
  camera.lookAt(V(v.at[0],.45+v.at[2],v.at[1]));
  const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
  r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.setSize(1800,1200);r.setPixelRatio(1);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.0;
  document.body.replaceChildren(r.domElement);
  r.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%';
  const {EffectComposer}=await import('/node_modules/three/examples/jsm/postprocessing/EffectComposer.js');
  const {RenderPass}=await import('/node_modules/three/examples/jsm/postprocessing/RenderPass.js');
  const {SSAOPass}=await import('/node_modules/three/examples/jsm/postprocessing/SSAOPass.js');
  const {UnrealBloomPass}=await import('/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js');
  const {OutputPass}=await import('/node_modules/three/examples/jsm/postprocessing/OutputPass.js');
  const composer=new EffectComposer(r),ao=new SSAOPass(scene,camera,1800,1200,32);
  ao.kernelRadius=.18;ao.minDistance=.0002;ao.maxDistance=.012;
  composer.addPass(new RenderPass(scene,camera));composer.addPass(ao);composer.addPass(new UnrealBloomPass(new THREE.Vector2(1800,1200),.12,.25,1.0));composer.addPass(new OutputPass());composer.render();
  // Check screen corners against the actual opaque model from this exact approval camera.
  scene.updateMatrixWorld(true);
  const preview=scene.getObjectByName('R14 fitted TV joinery under the lower flight').userData.preview;
  const checks=[];
  for(const y of [preview.screen[1]+.002,preview.screen[3]-.002])for(const z0 of [preview.screenBottom+.002,preview.screenTop-.002]){
   const point=V(preview.screen[2]+.002,.45+z0,y),d=point.clone().sub(camera.position),distance=d.length();
   const ray=new THREE.Raycaster(camera.position,d.normalize(),.001,distance-.003);
   const hit=ray.intersectObjects(scene.children,true).find(i=>i.object.isMesh&&!i.object.material.transparent);
   checks.push({y,height:z0,clear:!hit,occluder:hit?.object.parent.name??null});
  }
  if(v.geometry){
   const label=document.createElement('div');label.textContent='R14 LOCAL STUDY · Geometry inspection · Retained header shown as outline · Stair and basin unchanged';
   label.style.cssText='position:fixed;left:28px;top:24px;padding:12px 18px;background:#faf8f0ed;color:#24463f;font:15px system-ui;border-radius:8px;';document.body.append(label);
  }
  return {name:v.name,eye:v.eye,screenCorners:checks};
 },v);
 await page.screenshot({path:join(modelRoot,v.name)});
 results.push({...result,geometryInspection:!!v.geometry});
 console.log('saved',v.name,JSON.stringify(result.screenCorners));
 if(!v.geometry&&result.screenCorners.some(c=>!c.clear))throw new Error('Screen corner obscured in '+v.name);
}
await browser.close();
if(!process.env.RENDER_ONLY)await writeFile(join(modelRoot,'qa/approved-camera-visibility.json'),JSON.stringify({revision:'R14',status:'local visual study',views:results},null,2)+'\n');

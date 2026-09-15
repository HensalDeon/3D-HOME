import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {readdir} from 'node:fs/promises';
let executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
if(!executablePath&&!existsSync(chromium.executablePath())&&process.platform==='darwin')for(const folder of(await readdir(join(homedir(),'Library/Caches/ms-playwright'))).filter(n=>/^chromium-/.test(n)).sort().reverse()){const p=join(homedir(),'Library/Caches/ms-playwright',folder,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');if(existsSync(p)){executablePath=p;break;}}
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
// Requires the Vite dev server on 127.0.0.1:5173 (npm run dev). Renders only the stair and the R13 under-stair composition.
const page=await browser.newPage({viewport:{width:1400,height:1000}});
await page.goto(process.env.DEV_SERVER??'http://127.0.0.1:5173/');
const views=[
 {name:'qa/R13-under-stair-detail.png',from:[3.5,2.55,3.1],to:[-1.75,1.65,.6]},       // from the passage: the fitted composition and the basin archway
 {name:'qa/R13-under-stair-wash.png',from:[.6,1.7,-.75],to:[-1.2,1.05,-1.05]},         // through the basin archway: R13 leaves the nook and its standing depth untouched
 {name:'qa/R13-under-stair-panel.png',from:[1.5,3.1,2.7],to:[-1.3,1.25,.5]},            // from over the living side: the raking top edge of the backing panel, held 60 mm under the waist soffit
 {name:'qa/R13-under-stair-living-eye.png',from:[2.2,2.0,2.05],to:[-.9,1.5,.55],full:true},// eye level in the living passage, under the retained +2.10 header: the intended read
];
for(const v of views){
 await page.evaluate(async v=>{
  const THREE=await import('/node_modules/three/build/three.module.js');
  const {createHouse}=await import('/src/house.js');
  const h=createHouse(),scene=new THREE.Scene();scene.background=new THREE.Color('#eeeee7');
  const names=['stairs','R13 under-stair TV composition','R12 washbasin nook against the bedroom (west) wall; basin faces east'];
  if(v.full){
   // Whole ground level, so the retained +2.10 header over the unit and the archway jamb are in
   // the frame: this is what the unit actually looks like from the living side.
   const level=h.levels.ground.clone(true);scene.add(level);
  }else for(const n of names){const o=h.levels.ground.getObjectByName(n);if(!o)throw new Error('missing '+n);scene.add(o.clone(true));}
  if(!v.full){const floor=new THREE.Mesh(new THREE.BoxGeometry(4,.1,5),new THREE.MeshStandardMaterial({color:'#deded1'}));floor.position.set(-1,.4,.6);scene.add(floor);}
  const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(2,7,4);scene.add(light,new THREE.HemisphereLight('#fffbee','#89988f',2));
  const camera=new THREE.PerspectiveCamera(40,1.4,.1,50);camera.position.set(...v.from);camera.lookAt(...v.to);
  const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});r.setSize(1400,1000);r.setPixelRatio(1);
  document.body.replaceChildren(r.domElement);r.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%';r.render(scene,camera);
 },v);
 await page.screenshot({path:v.name});
}
await browser.close();console.log('Saved R13 under-stair detail views.');

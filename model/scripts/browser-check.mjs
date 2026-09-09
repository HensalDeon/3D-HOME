import {chromium} from 'playwright';
import {mkdir,readFile,readdir,unlink} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
let executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
if(!executablePath&&!existsSync(chromium.executablePath())&&process.platform==='darwin'){
 const cache=join(homedir(),'Library/Caches/ms-playwright');
 for(const folder of (await readdir(cache)).filter(n=>/^chromium-/.test(n)).sort().reverse()){
  const candidate=join(cache,folder,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');if(existsSync(candidate)){executablePath=candidate;break;}
 }
}
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
await mkdir('qa',{recursive:true});
await page.goto(new URL('../../drawings/compact-v4/interactive-3d.html',import.meta.url).href);
await page.waitForFunction(()=>window.houseExplorer?.audit.renderer.calls>0);
await page.screenshot({path:'qa/exterior.png'});
const beforeOrbit=await page.evaluate(()=>window.houseExplorer.audit.camera);
await page.mouse.move(900,500);await page.mouse.down();await page.mouse.move(1040,555,{steps:12});await page.mouse.up();await page.waitForTimeout(350);
assert.notDeepEqual(await page.evaluate(()=>window.houseExplorer.audit.camera),beforeOrbit);
const beforeZoom=await page.evaluate(()=>window.houseExplorer.audit.camera);await page.mouse.wheel(0,-300);await page.waitForTimeout(350);assert.notDeepEqual(await page.evaluate(()=>window.houseExplorer.audit.camera),beforeZoom);
await page.getByRole('button',{name:'Reset camera',exact:true}).click();await page.waitForTimeout(900);
console.log('audit',await page.evaluate(()=>window.houseExplorer.audit));
await page.locator('[data-mode="ground"]').click();await page.waitForTimeout(1000);
await page.locator('[data-view="top"]').click();await page.waitForTimeout(250);
await page.screenshot({path:'qa/ground-top.png'});
await page.getByLabel('Select a room',{exact:true}).selectOption('g-bath');
assert.equal(await page.locator('#detail-name').textContent(),'Ensuite 1');
await page.locator('#detail-source').click();
assert.equal(await page.locator('#sheet-image').getAttribute('alt'),'Sheet 3: Ground floor');
for(let i=0;i<11;i++){await page.locator('#sheet-list button').nth(i).click();await page.waitForFunction(()=>{const img=document.querySelector('#sheet-image');return img.complete&&img.naturalWidth>0;});}
const dl=page.waitForEvent('download');await page.locator('#pdf-download').click();const downloaded=await dl;await downloaded.saveAs('qa/downloaded-plan.pdf');
const hash=b=>createHash('sha256').update(b).digest('hex');assert.equal(hash(await readFile('qa/downloaded-plan.pdf')),hash(await readFile('../drawings/compact-v4/Hensal_Complete_House_Plans.pdf')));
await unlink('qa/downloaded-plan.pdf');
await page.getByRole('button',{name:'Close plan library'}).click();
await page.locator('[data-mode="first"]').click();await page.waitForTimeout(900);await page.locator('[data-view="top"]').click();await page.waitForTimeout(250);await page.screenshot({path:'qa/first-top.png'});
await page.getByLabel('Select a room',{exact:true}).selectOption('f-drying');assert.match(await page.locator('#detail-description').textContent(),/master side wall/);
await page.locator('[data-mode="roof"]').click();await page.waitForTimeout(900);await page.locator('[data-view="top"]').click();await page.waitForTimeout(250);await page.screenshot({path:'qa/roof-top.png'});assert.equal(await page.evaluate(()=>window.houseExplorer.audit.roofArrivalVisible),true);assert.deepEqual(await page.evaluate(()=>window.houseExplorer.audit.levelVisibility),{ground:false,first:false,roof:true});
await page.locator('#dimensions').check();assert.equal(await page.evaluate(()=>window.houseExplorer.state.dimensions),true);
await page.locator('#furniture').uncheck();assert.equal(await page.evaluate(()=>window.houseExplorer.state.furniture),false);await page.locator('#furniture').check();await page.locator('#dimensions').uncheck();
await page.locator('#explode').click();await page.waitForTimeout(1000);await page.screenshot({path:'qa/exploded.png'});assert.equal(await page.evaluate(()=>window.houseExplorer.state.explode),true);
await page.locator('#cutaway').click();await page.waitForTimeout(1000);await page.screenshot({path:'qa/cutaway.png'});assert.equal(await page.evaluate(()=>window.houseExplorer.state.cutaway),true);assert.equal(await page.evaluate(()=>window.houseExplorer.state.explode),false);
await page.locator('[data-mode="exterior"]').click();await page.locator('[data-view="rear"]').click();await page.waitForTimeout(250);await page.screenshot({path:'qa/rear.png'});assert.ok((await page.evaluate(()=>window.houseExplorer.audit.camera))[2]<0);
await page.locator('[data-view="front"]').click();await page.waitForTimeout(250);await page.screenshot({path:'qa/front.png'});assert.ok((await page.evaluate(()=>window.houseExplorer.audit.camera))[2]>0);
const pngWait=page.waitForEvent('download');await page.getByRole('button',{name:'Save image',exact:true}).click();await(await pngWait).saveAs('qa/export.png');assert.ok((await readFile('qa/export.png')).length>20000);
await page.locator('#assumptions-button').click();assert.ok(await page.getByText('Visual assumptions',{exact:true}).isVisible());await page.keyboard.press('Escape');
await page.setViewportSize({width:390,height:844});await page.locator('[data-mode="ground"]').click();await page.waitForTimeout(1000);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'qa/mobile.png',fullPage:true});
await page.getByLabel('Model assumptions',{exact:true}).click();assert.ok(await page.getByText('Visual assumptions',{exact:true}).isVisible());await page.keyboard.press('Escape');
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS: 11 sheets, exact PDF download, floor selection, room details, camera modes, layer controls, exports, source notes, responsive layout, zero external requests and zero JS errors.');
await browser.close();

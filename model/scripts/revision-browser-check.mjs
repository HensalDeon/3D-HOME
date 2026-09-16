import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
let executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
if(!executablePath&&!existsSync(chromium.executablePath())&&process.platform==='darwin')for(const folder of(await readdir(join(homedir(),'Library/Caches/ms-playwright'))).filter(n=>/^chromium-/.test(n)).sort().reverse()){const p=join(homedir(),'Library/Caches/ms-playwright',folder,'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');if(existsSync(p)){executablePath=p;break;}}
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(new URL('../../drawings/compact-v4/interactive-3d.html',import.meta.url).href);await page.waitForFunction(()=>window.houseExplorer?.audit.renderer.calls>0);
assert.equal(await page.evaluate(()=>window.houseExplorer.audit.revision.startsWith('R15 moves the washbasin')),true);
await page.locator('[data-view="front"]').click();await page.mouse.move(900,500);await page.mouse.wheel(0,-650);await page.waitForTimeout(400);await page.locator('#viewport').screenshot({path:'qa/R15-front-detail.png'});
await page.locator('[data-mode="ground"]').click();await page.waitForTimeout(900);await page.locator('#labels').uncheck();await page.mouse.move(950,500);await page.mouse.wheel(0,-350);await page.waitForTimeout(400);await page.locator('#viewport').screenshot({path:'qa/R15-interior.png'});
await page.getByLabel('Select a room',{exact:true}).selectOption('g-wash');await page.waitForTimeout(400);await page.locator('#viewport').screenshot({path:'qa/R15-wash.png'});assert.match(await page.locator('#detail-description').textContent(),/east-facing orientation/);assert.match(await page.locator('#detail-description').textContent(),/uniform 1\.95 m/);assert.match(await page.locator('#detail-description').textContent(),/continuing that run/);
await page.getByLabel('Select a room',{exact:true}).selectOption('g-media');await page.waitForTimeout(400);await page.locator('#viewport').screenshot({path:'qa/R15-media.png'});assert.match(await page.locator('#detail-description').textContent(),/oak backing/);assert.match(await page.locator('#detail-description').textContent(),/0\.265 m3/);assert.match(await page.locator('#detail-description').textContent(),/lower\/west flight/);assert.match(await page.locator('#detail-description').textContent(),/faces EAST/);
await page.locator('#structure').check();await page.waitForTimeout(500);await page.locator('#viewport').screenshot({path:'qa/R7-structure.png'});
assert.equal(await page.evaluate(()=>window.houseExplorer.state.structure),true);await page.locator('#structure').uncheck();await page.waitForTimeout(300);
await page.locator('#revision-button').click();await page.waitForFunction(()=>[...document.querySelectorAll('#revision-dialog img')].every(i=>i.complete&&i.naturalWidth>0));
const dialog=await page.locator('#revision-dialog').textContent();for(const re of [/1\.91.?1\.95 m/,/riser 12/,/riser 9/,/y = 4\.2/,/4\.64/,/SOUTH → WEST → EAST/,/archway/,/engineer/,/CONCEPTUAL RCC WAIST-SLAB SYSTEM/,/NOT TO BE ASSUMED LOAD-BEARING/,/176\.47 mm/,/2\.25 \u00d7 0\.35 m/,/lower \/ west flight/,/nothing enters the 1\.00 m living passage|Nothing projects into the 1\.00 m passage/,
 // The corrected wall condition has to be stated in the dialog, not just in the data.
 /below \+2\.10 m/,/retained above as a plastered header/,/not assumed and must not be inferred/,/no balustrade is required/])assert.match(dialog,re);
await page.locator('#stair-review').scrollIntoViewIfNeeded();await page.locator('#stair-review').screenshot({path:'qa/R15-stair-detail.png'});await page.getByRole('button',{name:'Close revision review'}).click();
await page.setViewportSize({width:390,height:844});await page.locator('#revision-button').click();assert.ok(await page.getByRole('button',{name:'Close revision review'}).isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.keyboard.press('Escape');assert.deepEqual(errors,[]);await browser.close();console.log('PASS: R15 revision views, conceptual structure layer, wash room details, embedded reference/section sheet, mobile dialog and no JS errors.');

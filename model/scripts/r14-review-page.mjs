import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../../',import.meta.url);
const files=['R14-living-room-eye.png','R14-joinery-close.png','R14-geometry-in-stair.png'];
const images=Object.fromEntries(await Promise.all(files.map(async file=>[file,'data:image/png;base64,'+(await readFile(new URL('interiors/images/'+file,root))).toString('base64')])));
const template=await readFile(new URL('./r14-review.template.html',import.meta.url),'utf8');
const html=template.replaceAll('__R14_PRIMARY__',images[files[0]]).replace('__R14_IMAGES__',JSON.stringify(images));
await writeFile(new URL('interiors/R14-review.html',root),html);
console.log('Saved self-contained R14 review page.');

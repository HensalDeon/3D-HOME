// Embed the current coordinated stair detail rather than superseded option studies.
import {readFile,writeFile} from 'node:fs/promises';
await writeFile('src/revision-assets.json',JSON.stringify({
 stairReview:'data:image/png;base64,'+(await readFile('../drawings/compact-v4/05-stair-vastu.png')).toString('base64'),
 facadeReference:'data:image/jpeg;base64,'+(await readFile('references/front-original.jpeg')).toString('base64')
}));

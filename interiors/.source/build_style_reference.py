"""Build a visual board from original house photographs; no image transformations."""
from pathlib import Path
from html import escape
import hashlib, json

ROOT = Path(__file__).resolve().parent.parent
swatches = [
    ('Warm ivory', '#E7DECE', 'Plaster and ceiling'),
    ('Sandy stone', '#CEC0A8', 'Floors, stairs and counters'),
    ('Warm greige', '#C4B69F', 'Matte cabinet fronts'),
    ('Muted oak', '#AE916B', 'Natural fine-grained timber'),
    ('Oatmeal', '#D9CDB9', 'Linen and upholstery'),
    ('Charcoal', '#30302B', 'Hardware and frames'),
    ('Sage', '#8B9078', 'Bedroom 1 and study'),
    ('Olive', '#79765A', 'Master bedroom'),
    ('Clay', '#B07D60', 'Bedroom 3 accent'),
]
groups = [
    ('Kitchen', ['06-kitchen-wide', '06-kitchen-detail', '06-kitchen-opposite'], 'Primary palette, daylight, material texture and task-light reference.'),
    ('Dining', ['16-dining-wide'], 'Oak furniture, cream upholstery, pale floor and gentle daylight.'),
    ('Bedroom 1', ['07-bedroom1-wide', '07-bedroom1-detail', '07-bedroom1-opposite'], 'Sage accents, textured ivory linen and natural oak.'),
    ('Master bedroom', ['08-bedroom2-wide', '08-bedroom2-detail', '08-bedroom2-opposite'], 'Olive textiles, oatmeal upholstery, woven runner and oak.'),
    ('Bedroom 3', ['09-bedroom3-wide', '09-bedroom3-detail', '09-bedroom3-opposite'], 'Clay accent, quiet oak wardrobe and dark pulls.'),
    ('Study', ['10-study-wide'], 'Beige sofa, sage cushion, woven rug and soft daylight.'),
    ('Passage and gallery', ['10-passage-wide', '17-front-gallery-wide'], 'Ivory and stone continuity, oak and charcoal edges, greenery.'),
    ('Bathrooms', ['11-bathroom1-wide', '12-bathroom2-wide', '13-bathroom3-wide'], 'Stone, oak vanity, white ceramic, dark fittings and gentle mirror light.'),
    ('Entrance and outdoor rooms', ['01-entrance-wide', '14-balcony-wide', '15-terrace-wide'], 'Timber, woven seating, pale stone and tropical context; natural daylight variations.'),
]
images = []
for group, files, role in groups:
    for name in files:
        file = 'images/' + name + '.png'
        images.append(dict(file=file, group=group, role=role,
            sha256=hashlib.sha256((ROOT/file).read_bytes()).hexdigest()))
manifest = dict(version=1, established='2026-09-15',
    authority='Original kitchen wide and detail govern appearance; approved model governs layout.',
    swatchNote='Approximate visual swatches chosen by eye; not sampled paint specifications.',
    swatches=[dict(name=n, hex=c, role=r) for n,c,r in swatches], references=images)
(ROOT/'.source/house-style.json').write_text(json.dumps(manifest,indent=2)+'\n')

def figure(name, title, caption):
    return f'<figure><a href="images/{name}.png"><img src="images/{name}.png" alt="{escape(caption)}" loading="lazy"></a><figcaption><strong>{escape(title)}</strong><span>{escape(caption)}</span></figcaption></figure>'

palette=''.join(f'<div class="swatch"><div style="background:{c}"></div><strong>{n}</strong><small>{c}</small><span>{r}</span></div>' for n,c,r in swatches)
primary = figure('06-kitchen-wide','01 / The daylight reference','Muted natural oak, creamy walls, sandy stone and restrained black accents.') + figure('06-kitchen-detail','02 / The material reference','Fine wood grain, subtle mineral texture, ceramic detail and diffused task lighting.')
examples=''.join(figure(*item) for item in [
    ('16-dining-wide','Living-area atmosphere','Oak furniture, cream fabric and soft reflections across the pale floor.'),
    ('07-bedroom1-detail','Texture and sage','Linen weave, small folds, matte oak and a muted green accent.'),
    ('08-bedroom2-wide','Olive and oatmeal','The same house palette with olive textiles and a woven runner.'),
    ('09-bedroom3-wide','A restrained clay accent','Terracotta stays in small textile accents; the oak and ivory base continues.'),
    ('11-bathroom1-wide','Stone and ceramic','Pale tile, natural timber and white ceramic have distinct surface responses.'),
    ('10-study-wide','Soft daylight and comfort','Beige upholstery, a sage cushion and real woven texture beside greenery.'),
])
library=''.join('<details><summary>'+escape(group)+f' <small>· {len(files)} views</small></summary><p>'+escape(role)+'</p><div class="grid library">'+''.join(figure(name,name+'.png',role) for name in files)+'</div></details>' for group,files,role in groups)
html='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Hensal House · Interior style reference</title>
<style>
:root{color-scheme:light;font-family:system-ui,sans-serif;background:#f5f1e9;color:#39372f}*{box-sizing:border-box}body{margin:0}main{max-width:1440px;margin:auto;padding:38px 32px 48px}.eyebrow{text-transform:uppercase;font-size:11px;letter-spacing:.18em;color:#736952}h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(34px,5vw,66px);letter-spacing:-.04em;margin:12px 0}h2{font-family:Georgia,serif;font-size:30px;font-weight:400;margin:0 0 12px}h3{font-size:17px;margin:0 0 9px}p{line-height:1.65;max-width:840px;margin:10px 0;color:#655e50}header{padding-bottom:26px}nav{display:flex;gap:20px;flex-wrap:wrap;margin-top:18px}a{color:#554832;text-underline-offset:4px}a:focus-visible,summary:focus-visible{outline:3px solid #8b9078;outline-offset:5px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0;min-width:0}figure img{display:block;width:100%;aspect-ratio:3/2;object-fit:contain;background:#e7dece}figcaption{padding:12px 0;line-height:1.5}figcaption strong,figcaption span{display:block}figcaption strong{font-size:14px;font-weight:600}figcaption span{font-size:13px;color:#726855;margin-top:4px}section{padding:30px 0;border-top:1px solid #d9d0c0}.palette{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:12px;margin:22px 0 12px}.swatch>div{height:78px;border:1px solid #0000000c}.swatch strong,.swatch small,.swatch span{display:block}.swatch strong{font-size:13px;margin-top:9px}.swatch small{font-size:11px;color:#766b59;margin:5px 0}.swatch span{font-size:11px;line-height:1.5;color:#766b59}.note{font-size:12px}.rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:24px}.rules article{padding-left:18px;border-left:2px solid #ae916b}.rules p{font-size:14px}.examples{grid-template-columns:repeat(3,minmax(0,1fr))}.library{padding:14px 0}.library figcaption strong{overflow-wrap:anywhere}details{border-bottom:1px solid #d9d0c0;padding:18px 0}summary{cursor:pointer;font-weight:550}summary small{font-weight:400;color:#776c59}footer{padding-top:20px;border-top:1px solid #d9d0c0;font-size:13px}li{line-height:1.7;margin:7px 0}@media(max-width:900px){.palette{grid-template-columns:repeat(5,minmax(0,1fr))}.examples{grid-template-columns:repeat(2,minmax(0,1fr))}.rules{grid-template-columns:1fr}}@media(max-width:600px){main{padding:24px 18px}.grid{grid-template-columns:1fr}.palette{grid-template-columns:repeat(3,minmax(0,1fr))}.swatch>div{height:60px}nav{gap:12px;font-size:13px}h2{font-size:26px}}@media print{main{padding:0}nav,.library-section{display:none}section{break-inside:avoid}a{color:inherit;text-decoration:none}}
</style></head><body><main>
<header><div class="eyebrow">Hensal House / Original interior collection / September 2026</div><h1>One house. A consistent feeling.</h1><p>Creamy walls, quiet oak, pale stone and natural light. These original photographs define the materials, color relationships and photographic finish for future room revisions.</p><nav><a href="R14-review.html">Revised living, stair &amp; storage</a><a href="STYLE_REFERENCE.md">Detailed style brief</a><a href="#library">All original references</a></nav></header>
<section><div class="eyebrow">Start here</div><h2>The kitchen sets the standard.</h2><div class="grid">__PRIMARY__</div></section>
<section><h2>A warm, restrained palette.</h2><p>Keep the ivory, stone and timber distinct. Let charcoal hardware and small textile accents provide contrast.</p><div class="palette">__PALETTE__</div><p class="note">Approximate visual swatches chosen by eye. The photographs govern appearance; these are not paint specifications or sampled material values.</p></section>
<section><h2>What makes the images feel real.</h2><div class="rules"><article><h3>Materials you can read</h3><p>Fine oak grain, subtle mineral variation, woven fabric and soft ceramic reflections. Keep the timber muted and its grain in proportion.</p></article><article><h3>Light that belongs to the room</h3><p>Daylight enters through existing openings. Warm task lights blend into it with gentle falloff, controlled highlights and soft shadows.</p></article><article><h3>The approved room, photographed</h3><p>Retain the camera, openings, stairs and furniture positions. Keep straight verticals, believable scale, natural contrast and clear circulation.</p></article></div></section>
<section><h2>The same palette, room by room.</h2><div class="grid examples">__EXAMPLES__</div></section>
<section><h2>Carry the style forward.</h2><ol><li>Use the kitchen wide and detail as the finish references for every revision.</li><li>Use the current approved geometry view for the camera, layout, fixtures and joinery profiles.</li><li>Compare every view of the same room together for matching oak, stone, lighting and details.</li><li>Check texture and realism at full size before replacing the presentation image.</li></ol><p>Fluting belongs only where the selected joinery design calls for it. Preserve each room’s approved details and material balance.</p></section>
<section id="library" class="library-section"><h2>The original reference library.</h2><p>Twenty-two original photographs, grouped by room. Open any group to see every view. These establish visual style; the current approved model governs layout.</p>__LIBRARY__</section>
<footer><p>Style reference established 15 September 2026. Full material rules, reusable generation brief and review criteria: <a href="STYLE_REFERENCE.md">STYLE_REFERENCE.md</a>. Source hashes: <a href=".source/house-style.json">house-style.json</a>.</p></footer>
</main></body></html>'''
html=html.replace('__PRIMARY__',primary).replace('__PALETTE__',palette).replace('__EXAMPLES__',examples).replace('__LIBRARY__',library)
# Count is derived from the exact reference library rather than maintained by hand.
html=html.replace('Twenty-two original photographs',f'{len(images)} original photographs')
(ROOT/'STYLE_REFERENCE.html').write_text(html)
print(f'Built style reference with {len(images)} original images and {len(swatches)} palette swatches.')

"""Build the offline R18 review from canonical photos and measured storage data."""
from pathlib import Path
import base64
import html
import json

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'interiors'
SOURCE = OUT / '.source/storage-r18'
LAYOUT = json.loads((ROOT / 'model/src/storage-layout.json').read_text())

VIEWS = [
    ('07-bedroom1-opposite', 'Bedroom 1', '1500 × 550 mm wardrobe; six narrow leaves at each level. Sage textiles and one oak bay.'),
    ('08-bedroom2-opposite', 'Master bedroom', 'Matching fitted wardrobe with olive textiles. The existing passage remains clear.'),
    ('09-bedroom3-wide', 'Bedroom 3 · right-angle corner', 'Connected 90° L cabinet, with an accessible corner and no solid filler. The short exposed return face is 255 mm.'),
    ('09-bedroom3-detail', 'Bedroom 3 · corner detail', 'The two perpendicular door faces meet at the inner corner. Main and loft fronts have paired leaves.'),
    ('09-bedroom3-opposite', 'Bedroom 3 · opposite view', 'The visible wardrobe edge now carries the same ivory finish. This is a local finish edit to the existing opposite photograph.'),
    ('10-study-storage', 'Open family / tailoring room and shared storage', '750 × 450 mm cabinet at the side of the tailoring workspace: linen shelves, a separate tall household bay and an occasional-use loft. The room opens to the stair base; three sewing stations and their workbenches follow the preferred tailoring use.'),
]

def embedded(path):
    return 'data:image/png;base64,' + base64.b64encode(path.read_bytes()).decode()

def height_diagram():
    main, top, ceiling = (LAYOUT[k]*1000 for k in ['mainHeight','loftTop','ceiling'])
    def y(mm): return 380-mm*.105
    return f'''<svg viewBox="0 0 550 430" role="img" aria-label="Wardrobe height diagram in millimetres">
      <path d="M50 {y(ceiling)}H450 M50 380H450" stroke="#333" stroke-width="2"/>
      <rect x="90" y="{y(top)}" width="220" height="{(top-main)*.105}" fill="#e7dece" stroke="#777"/>
      <rect x="90" y="{y(main)}" width="220" height="{(main-80)*.105}" fill="#e7dece" stroke="#777"/>
      <rect x="90" y="{y(80)}" width="220" height="8.4" fill="#30302b"/>
      <path d="M200 {y(top)}V{y(80)}" stroke="#777"/>
      <text x="330" y="{y(ceiling)+5}">Ceiling · {ceiling:.0f}</text>
      <text x="90" y="{y(top)-13}">OPEN ABOVE · no cosmetic band</text>
      <text x="330" y="{y(top)+5}">Loft top · {top:.0f}</text>
      <text x="110" y="{y(main)-14}">400 mm storage loft</text>
      <text x="330" y="{y(main)+5}">Main top · {main:.0f}</text>
      <text x="110" y="260">Everyday storage</text>
      <text x="90" y="409">Indicative beam soffit 2550 · 50 mm above cabinet</text>
    </svg>'''

def corner_diagram():
    u=next(u for u in LAYOUT['units'] if u['id']=='bedroom3')
    front, side=u['segments'];x0,y0,xj,yf=front['box'];_,_,x1,y1=side['box']
    def point(x,y): return (65+(x-x0)*250, 90+(y-y0)*250)
    points=[point(x,y) for x,y in [(x0,y0),(x1,y0),(x1,y1),(xj,y1),(xj,yf),(x0,yf)]]
    c,d=point(xj,yf),point(xj,y1)
    pts=' '.join(f'{x:.2f},{y:.2f}' for x,y in points)
    return f'''<svg viewBox="0 0 550 430" role="img" aria-label="Measured plan of Bedroom 3 wardrobe showing a 90 degree corner">
      <polygon points="{pts}" fill="#e7dece" stroke="#555" stroke-width="2"/>
      <path d="M65 {c[1]}H{c[0]}V{d[1]}" fill="none" stroke="#137b79" stroke-width="4"/>
      <path d="M{c[0]-22} {c[1]}V{c[1]+22}H{c[0]}" fill="none" stroke="#137b79" stroke-width="2"/>
      <text x="65" y="61">Continuous L footprint · plan dimensions in mm</text>
      <text x="155" y="132">550 deep</text>
      <text x="100" y="253">1080 front door run</text>
      <text x="{c[0]-100}" y="{c[1]+55}">90°</text>
      <text x="65" y="326">705 overall return · 255 exposed return face</text>
      <text x="65" y="354">No solid filler / fixed corner face post</text>
      <text x="65" y="382">Supplier to detail paired corner hinges and access</text>
    </svg>'''

cards=[]
for name,title,note in VIEWS:
    photo=embedded(OUT/'images'/f'{name}.png')
    geom=SOURCE/'geometry'/f'{name}.png'
    control=''
    if geom.exists():
        control=f'<button type="button" data-photo="{photo}" data-geometry="{embedded(geom)}" aria-pressed="false">Show model geometry</button>'
    cards.append(f'<article><h2>{html.escape(title)}</h2><img src="{photo}" alt="{html.escape(title)}" loading="lazy">{control}<p>{html.escape(note)}</p></article>')

page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hensal House · R18 fitted storage</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f1e9;color:#30332d;font:16px/1.55 system-ui,sans-serif}main{max-width:1280px;margin:auto;padding:36px 24px}header{max-width:960px;margin-bottom:36px}h1{font-size:clamp(30px,4vw,50px);line-height:1.12;margin:12px 0 22px}h2{font-size:24px;line-height:1.2}a{color:#137b79}nav{display:flex;gap:20px;flex-wrap:wrap}small{color:#646a60}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}article,.panel{background:white;border:1px solid #ded9cf;border-radius:12px;padding:22px;margin-bottom:24px}article img{display:block;width:100%;height:auto;border-radius:7px}button{margin-top:14px;border:1px solid #137b79;background:#fff;color:#137b79;border-radius:5px;padding:9px 14px;cursor:pointer;font:inherit}button[aria-pressed=true]{background:#137b79;color:white}svg{width:100%;height:auto;font:15px system-ui,sans-serif}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:12px;border-bottom:1px solid #e4dfd5}th{color:#137b79}.scroll{overflow-x:auto}@media(max-width:760px){.grid{grid-template-columns:1fr}main{padding:24px 14px}article,.panel{padding:16px}}@media print{button,nav{display:none}article{break-inside:avoid}.grid{display:block}}
</style></head><body><main><header><small>HENSAL HOUSE · R18 · 08 OCTOBER 2026</small><h1>Useful storage, lighter wardrobes.</h1><p>All three bedrooms gain 400 mm wardrobe lofts and enclosed lift-up bed bases. Study/Family opens directly to the stair base below the retained beam. Ivory fronts, a restrained oak bay and narrow paired doors soften the bulky timber appearance. The shared study cabinet adds linen and household storage.</p><p>The blank ceiling bands have been removed. Cupboards stop at 2500 mm, with the existing wall and open space above. Bedroom 3 has a continuous 90° L cabinet without a solid corner filler.</p><nav><a href="../drawings/compact-v4/Hensal_Complete_House_Plans.pdf">Complete plans</a><a href="../drawings/compact-v4/interactive-3d.html">Interactive 3D model</a><a href="STYLE_REFERENCE.html">House finish references</a></nav></header><div class="grid">'''+height_diagram()+corner_diagram()+'''</div><div class="panel"><div class="scroll"><table><thead><tr><th>Space</th><th>Retained clearance</th><th>Storage approach</th></tr></thead><tbody><tr><td>Bedroom 1 / master</td><td>625 mm bedside aisles; 865 mm at parked slider</td><td>1500 × 550 mm wardrobes; paired leaves under 250 mm</td></tr><tr><td>Bedroom 3</td><td>625 mm to wardrobe; 600 mm behind bed; 580 mm at foot</td><td>550 mm deep L; front leaves under 270 mm</td></tr><tr><td>Open family / tailoring room</td><td>2.950 × 2.130 m zone; 650 mm occupied-chair aisle</td><td>Three machines on two compact benches; stair connection open</td></tr><tr><td>Shared study cabinet</td><td>750 × 450 mm at the west-side edge</td><td>Linen shelving and separate tall household bay</td></tr><tr><td>All three beds</td><td>Existing 2000 × 1500 mm footprints retained</td><td>Lift-up access avoids side drawers in narrow aisles</td></tr></tbody></table></div><p>Lofts add <strong>1.210 m³ gross external volume</strong> before panels and hardware; the bed bases contain <strong>1.415 m³ nominal panel-lined cavity</strong> before lift mechanisms and dividers. These figures are not net usable capacity. Store occasional-use light items in the lofts.</p><p>Furniture remains within the existing footprints: <strong>1268.19 sq ft</strong> for ground and first floors, or <strong>1365.28 sq ft</strong> including the roof enclosure. Internal walls remain 150 mm finished, including plaster. Removing the study/stair partition adds 0.4425 m² (4.76 sq ft) to the named clear study zone; the existing beam and stair structure are retained. Final structural coordination is required for the open boundary.</p></div><div class="grid">'''+''.join(cards)+'''</div><footer><p>Assistant visual review completed; user acceptance of the finished images is pending. These are generated presentations. Use the model and drawings for measured geometry; supplier drawings must resolve hinges, corner access, rated lift hardware, ventilation, fixings and site dimensions.</p><p>Images made with built-in imagegen. <a href=".source/storage-r18/prompts.json">Exact prompts and reference hashes</a> · <a href=".source/storage-r18/audit.json">Output and preservation audit</a>.</p></footer></main><script>document.querySelectorAll('button[data-photo]').forEach(b=>b.addEventListener('click',()=>{const show=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(show));b.closest('article').querySelector('img').src=show?b.dataset.geometry:b.dataset.photo;b.textContent=show?'Show finished photograph':'Show model geometry'}));</script></body></html>'''
(OUT/'R18-storage-review.html').write_text(page)
print(OUT/'R18-storage-review.html')

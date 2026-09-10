"""Compose the still-image interior review book; no 3D or web renderer."""
from pathlib import Path
import json, io, hashlib, sys
from xml.sax.saxutils import escape
import fitz
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

SRC=Path(__file__).resolve().parent
OUT=SRC.parent
ROOT=OUT.parent
DATA=json.loads((SRC/'design-data.json').read_text())
SELECT=json.loads((SRC/'selected-wide.json').read_text())
VAR=json.loads((SRC/'selected-variants.json').read_text()) if (SRC/'selected-variants.json').exists() else {}
DRAFT='--draft' in sys.argv
RELEASE=json.loads((SRC/'image-release.json').read_text()) if (SRC/'image-release.json').exists() else {'images':{}}
if not DRAFT and not RELEASE.get('complete'):
    raise SystemExit('Final PDF blocked: source-camera audit and corrections are incomplete. Use --draft only for internal layout QA.')
W,H=landscape(A4); M=32
INK='#333B35'; MUTED='#737A72'; PAPER='#F6F3EC'; LINE='#DADCD2'; OAK='#B8956D'
for name,file in [('Body','Arial.ttf'),('Bold','Arial Bold.ttf'),('Display','Georgia.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'/System/Library/Fonts/Supplemental/'+file))
styles={}
for name,size,leading,color,font in [('body',10,15,INK,'Body'),('small',8,11,MUTED,'Body'),('caption',8.5,12,MUTED,'Body'),('heading',15,20,INK,'Display'),('lead',15,22,INK,'Display')]:
    styles[name]=ParagraphStyle(name,fontName=font,fontSize=size,leading=leading,textColor=HexColor(color))
mem=io.BytesIO(); c=canvas.Canvas(mem,pagesize=(W,H),pageCompression=1)
c.setTitle(DATA['title']); c.setAuthor('Hensal House — interior design proposal')
c.setSubject('Photographic-style still-image proposal based on retained R5 architecture; review edition')
page=0; inserts=[]; toc=[]; image_records=[]

def text(t,x,y,w,style='body',maxh=500):
    p=Paragraph(escape(t),styles[style]); _,h=p.wrap(w,maxh)
    if h>maxh: raise ValueError(f'Text overflow: {t[:70]} ({h}>{maxh})')
    p.drawOn(c,x,y-h); return y-h

def line(t,x,y,size=9,font='Body',color=INK):
    c.setFillColor(HexColor(color));c.setFont(font,size);c.drawString(x,y,t)

def bg(color=PAPER):
    c.setFillColor(HexColor(color));c.rect(0,0,W,H,stroke=0,fill=1)

def start(label,title,bookmark=None):
    global page
    page+=1;bg()
    line(label,M,H-34,8,'Bold',MUTED)
    line(title,M,H-70,26,'Display')
    if bookmark: toc.append([1,bookmark,page])

def footer(label='Interior proposal / images are illustrative; R5 dimensioned drawings govern'):
    c.setStrokeColor(HexColor(LINE));c.setLineWidth(.4);c.line(M,35,W-M,35)
    line(label,M,22,7,'Body',MUTED);c.setFillColor(HexColor(MUTED));c.setFont('Body',8);c.drawRightString(W-M,22,f'{page:02}')
    c.showPage()

def photo(path,x,y,w,h,record=True):
    path=Path(path)
    if not DRAFT and path.parent==OUT/'images':
        entry=RELEASE.get('images',{}).get(path.name,{})
        if entry.get('status')!='accepted' or entry.get('sha256')!=hashlib.sha256(path.read_bytes()).hexdigest():
            raise ValueError('Image has not passed the release audit: '+path.name)
    if not path.exists():
        if DRAFT:
            c.setFillColor(HexColor('#E6E3DB'));c.rect(x,y,w,h,fill=1,stroke=0)
            text('Image pending: '+path.name,x+15,y+h-20,w-30,'small');return
        raise FileNotFoundError(path)
    with Image.open(path) as im: iw,ih=im.size
    scale=min(w/iw,h/ih);dw,dh=iw*scale,ih*scale
    c.drawImage(str(path),x+(w-dw)/2,y+(h-dh)/2,width=dw,height=dh,mask='auto')
    if record:image_records.append({'page':page,'file':str(path.relative_to(ROOT)) if path.is_relative_to(ROOT) else str(path),'pixels':[iw,ih],'placed_points':[dw,dh],'effective_ppi':round(iw/(dw/72),1)})

def image_for(room,kind):
    stem=SELECT[room] if kind=='wide' else VAR.get(room+'-'+kind,room+'-'+kind)
    return OUT/'images'/f'{stem}.png'

def notes_block(title,body,x,y,w):
    y=text(title,x,y,w,'heading');return text(body,x,y-8,w,'body')-20

# Cover
page+=1;bg()
line('HENSAL HOUSE',M,H-38,10,'Bold',MUTED)
text('Interior Design & Visualization',M,H-69,340,'lead')
text('Warm contemporary interiors for everyday family life.',M,H-139,278,'lead')
text('Ground floor · first floor · roof terrace\nArchitecture basis: R5 / September 2026',M,H-221,280,'body')
text('One house. A restrained palette of oak, warm white, soft stone and natural fabrics.',M,195,270,'body')
text('Interior proposal / review edition',M,95,290,'small')
hero=OUT/'images/00-exterior-hero.png'
photo(hero if hero.exists() else ROOT/'model/references/front-original.jpeg',365,58,W-397,H-86)
footer('Hensal House — Interior Design & Visualization · 09 September 2026')
toc.append([1,'Cover',1])

start('01 / PROJECT OVERVIEW','A warm, practical family home','Project overview')
photo(image_for('02-living','wide'),M,64,488,420)
x=548;y=H-116
for title,body in [
 ('Design intent','Contemporary and comfortable, with quiet materials and useful storage. The interior fits the retained house rather than changing its architecture.'),
 ('Orientation & levels','East-facing entrance; north points right on the plans. Ground FFL +0.45 m, first +3.45 m and roof +6.45 m. Main floor-to-floor height is 3.00 m; modelled clear rooms are 2.85 m.'),
 ('How to read this book','The retained dimensioned drawings and R5 model revisions govern. New photographs are AI-generated design proposals, not an approved or measured construction record. Review items are kept beside the relevant spaces.')]:
    y=notes_block(title,body,x,y,260)
footer()

start('02 / ARCHITECTURE BASIS','The existing house governs the interior','Existing architecture')
text('6.00 × 9.70 m',M,H-114,390,'lead')
text('58.20 m² per main floor · three bedrooms · three private ensuites · full roof access',M,H-155,480,'body')
y=H-215
for title,body in [
 ('Architecture remains fixed','All existing walls, doors, windows, staircase geometry, landings, balconies, sitout and floor levels remain the design basis. No new architectural change is proposed by this interior package.'),
 ('R5 takes precedence','The under-stair unit follows the R5 coordinate schedule. Bedroom 3 follows the L-shaped wardrobe in model/src/revision.js; the retained first-floor sheet still depicts the older straight wardrobe. The furniture supplement later in this book documents the approved return.'),
 ('Exterior reference hierarchy','The current model records the corrected open charcoal sweeping bands. Historical photographic elevation references illustrate materials, but must not override the R5 band paths, openings or roof enclosure.')]:
    y=notes_block(title,body,M,y,460)
# diagram of source hierarchy, strictly 2D editorial elements
for i,(title,sub) in enumerate([('01','Dimensioned drawings'),('02','Approved R5 revisions'),('03','Interior finish proposals')]):
    yy=H-148-i*110;c.setFillColor(HexColor('#ECE7DC'));c.rect(553,yy-55,256,86,stroke=0,fill=1)
    line(title,568,yy+3,18,'Display',OAK);text(sub,610,yy+7,180,'body')
footer('Source: retained 11-sheet R5 house package + current model revision data')

# Embed original vector plan pages without modifying the source document.
plan_doc=fitz.open(ROOT/'drawings/compact-v4/Hensal_Complete_House_Plans.pdf')
for idx,title in [(2,'Ground-floor plan / R5'),(3,'First-floor plan / retained sheet'),(4,'Roof plan / full stair access'),(5,'Front & rear elevations'),(6,'Under-stair zoning / R5 section')]:
    start('02 / RETAINED DRAWINGS',title,title)
    inserts.append((page-1,idx,fitz.Rect(M,92,W-M,H-48)))
    footer('Original drawing reproduced at reduced size. Do not scale this presentation; use stated dimensions.')

# Existing photo references, labelled accurately.
start('02 / EXTERIOR REFERENCES','Material character and the retained façade')
photo(ROOT/'model/references/front-original.jpeg',M,76,260,400)
photo(ROOT/'drawings/compact-v4/exterior-concept.png',321,153,490,326)
text('Original front-elevation style reference.',M,66,265,'small')
text('Earlier front/rear appearance reference. R5 geometry, corrected open bands and roof drawings override image differences.',321,138,490,'caption')
footer('Existing project reference imagery / not a new architectural revision')

# Room spreads: one establishing photograph, then two parallel views.
for room in DATA['rooms']:
    start('03 / '+room['floor'],room['title'],room['title'])
    photo(image_for(room['id'],'wide'),M,71,537,413)
    x=595;y=H-114
    y=text(room['dimension'],x,y,213,'heading')-24
    y=text(room['intent'],x,y,213,'body')-24
    y=notes_block('Materials',room['materials'],x,y,213)
    y=notes_block('Fit / coordination',room['check'],x,y,213)
    footer()
    start(room['floor']+' / '+room['title'].upper(),'Another view, a closer detail')
    photo(image_for(room['id'],'opposite'),M,170,380,304)
    photo(image_for(room['id'],'detail'),430,170,380,304)
    text('Opposite-angle study',M,150,380,'heading')
    text('Feature / material detail',430,150,380,'heading')
    text('The same intended layout and material family. Camera interpretation remains subject to the drawing checks in this book.',M,113,690,'caption')
    footer()

start('04 / MATERIAL & COLOUR PALETTE','Quiet materials, repeated with purpose','Material & colour palette')
for i,(name,color,desc) in enumerate(DATA['palette']):
    col=i%3;row=i//3;x=M+col*266;y=H-135-row*201
    c.setFillColor(HexColor(color));c.rect(x,y-61,244,74,stroke=0,fill=1)
    text(name,x,y-75,244,'heading');text(desc,x,y-105,244,'body')
footer('Colours are indicative; approve physical samples together in daylight and evening light.')

start('04 / FINISH SELECTION','Choose finishes for use and maintenance')
photo(image_for('06-kitchen','detail'),M,80,475,392)
y=H-122
for title,body in [
 ('Joinery','Prefer stable, moisture-appropriate boards with sealed edges and accessible hardware. Use quieter laminates inside utility cabinets; reserve visible oak grain for the shared composition and wardrobes.'),
 ('Wet areas','Specify an appropriate wet-area floor finish, coordinated waterproofing and accessible traps. Keep penetrations and concealed joints to a minimum. Tile appearance alone does not establish slip resistance.'),
 ('Fabrics & metal','Use removable, washable upholstery covers and compact window treatments. Select exterior metal finishes and fixings for the actual exposure; keep maintenance access open.')]:
    y=notes_block(title,body,541,y,267)
footer()

start('05 / LIGHTING CONCEPT','Soft ambient light, useful task light','Lighting concept')
photo(image_for('07-bedroom1','detail'),M,194,475,285)
text('Warm evening scenes show the intended atmosphere, not a calculated illuminance or electrical layout.',M,167,475,'caption')
y=H-120
for title,body in [
 ('General / 3000 K','Simple ceiling fixtures or modest recessed fittings create even usable light. Avoid decorative ceiling build-ups that consume height.'),
 ('Task / 3000–3500 K','Dedicated light at the kitchen worktop, wash mirror, desk and beds. Keep the light source out of the TV reflection and the user’s direct view.'),
 ('Accent / 2700–3000 K','Small doses of indirect light at selected joinery and the entrance. Use accessible drivers and separate switching; avoid outlining every surface with LEDs.')]:
    y=notes_block(title,body,541,y,267)
footer('Fixture positions, beam angles, switching, wiring and wet-area suitability require electrical coordination.')

start('06 / BUILT-IN FURNITURE','The stair-side composition','Key built-in furniture')
photo(image_for('05-wash','detail'),M,194,380,283)
photo(image_for('04-storage','detail'),430,194,380,283)
text('TV / closing panel',M,167,247,'heading')
text('950 × 50 × 1,700 mm backing. Keep the TV centred and conceal wiring with serviceable access; do not add a deep console into the passage.',M,138,247,'body')
text('Store / low cabinet',304,167,247,'heading')
text('Store access 900 × 1,400 mm. Separate retained low cabinet 500 × 550 × 1,080 mm. Preserve the actual landing and tread soffits.',304,138,247,'body')
text('Wash / mirror',576,167,232,'heading')
text('500 × 350 mm basin, 350 mm counter, rim +860 mm. Mirror 400 × 650 mm; top +1.65 m. Keep access to trap, valves and drawer.',576,138,232,'body')
footer('All dimensions above come from the retained R5 schedule; photographs do not supersede them.')

start('06 / JOINERY SUPPLEMENT','Bedroom 3 / the continuous L','Bedroom 3 wardrobe supplement')
photo(image_for('09-bedroom3','detail'),M,179,460,297)
# Exact footprint diagram, metres mapped to points. Furniture supplement, not new architecture.
x0=542;y0=174;s=84
# Looking down: north right, west up, as retained drawing.
c.setStrokeColor(HexColor(INK));c.setLineWidth(1.3);c.rect(x0,y0,2.70*s,3.60*s,fill=0)
# x local increases north, y local increases west, room origin(3.15,2.50).
for xx,yy,ww,hh in [(1.05,0,1.65,.55),(2.15,.10,.55,.75)]:
    c.setFillColor(HexColor(OAK));c.rect(x0+xx*s,y0+yy*s,ww*s,hh*s,fill=1,stroke=0)
# opening breaks / door, north window, bed footprint.
c.setFillColor(HexColor(PAPER));c.rect(x0+.10*s,y0-2,.8*s,4,fill=1,stroke=0)
c.setStrokeColor(HexColor('#758275'));c.setLineWidth(.8);c.line(x0+.1*s,y0,x0+.1*s,y0+.8*s)
c.setFillColor(HexColor('#DED9CE'));c.rect(x0+.10*s,y0+1.40*s,2*s,1.2*s,fill=1,stroke=1)
line('1200 × 2000 bed',x0+23,y0+164,8,'Body')
line('E / ENTRANCE',x0+5,y0-16,7,'Bold',MUTED)
line('W / ENSUITE',x0+70,y0+3.6*s+11,7,'Bold',MUTED)
line('S',x0-14,y0+152,8,'Bold',MUTED);line('N',x0+2.7*s+7,y0+152,8,'Bold',MUTED)
text('Plan supplement / furniture only',x0,143,240,'small')
text('East run 1,650 mm including corner. North return 850 mm overall. Depth 550 mm; height 2,100 mm. Paired corner access without a fixed post. Verify door leaves and hardware before fabrication.',M,150,460,'body')
footer('Supplement traces the approved model revision; the retained first-floor sheet still shows the earlier wardrobe.')

start('06 / JOINERY & SERVICES','Coordinate the parts that photographs cannot prove')
y=H-120
for title,body in [
 ('Kitchen','Keep 600 mm base depths and all approved fixture locations. Do not enlarge the kitchen to create an island or pantry. The existing hob is under the east window: the extractor and duct route need a compatible detail that preserves the opening. Refrigerator ventilation and open-door clearance must be checked against the local 750 mm aisle.'),
 ('Bedroom storage','Bedroom 1 and master retain the 1,500 × 550 mm east-wall wardrobe footprint. Fit internal drawers and hanging rails to measured carcasses. Keep pocket-door pockets free of screws, electrical boxes and overlapping cabinetry.'),
 ('Electrical / AC / curtains','No verified electrical, plumbing or AC set-out is present in the supplied package. Proposed lights, taps, AC positions, condensate routes, outlets and curtain tracks require coordinated shop drawings. Use compact blinds where wardrobe returns or headboards limit stacking space.'),
 ('Outdoor / maintenance','Keep both roof vents, the north exit swing, guard fixings, drains and the service reserve accessible. Use movable light furniture and plants. A water tank, heavy planter, structural screen or new pergola is not part of this proposal.')]:
    y=notes_block(title,body,M,y,W-2*M)
footer()

start('07 / REVIEW & QUALITY CONTROL','What is fixed. What still needs checking.','Review & quality control')
y=H-116
for title,body in [
 ('Architecture source check','The existing drawing and model source files were not edited. The room dimensions, R5 wash orientation, TV centre, stair sequence, wardrobe return and source limits are recorded in the retained design schedule. Presentation drawings are reproduced from the original PDF.'),
 ('Headroom / structure','The wash leaning strip has 2.17 m modelled clearance against the source review’s 2.20 m benchmark. The body line has 2.35 m. The figures assume a 120 mm stair construction zone. A source fallback moves the basin front to 2.00 m from the bedroom wall, retaining the building geometry; it requires user/architect coordination rather than silent substitution. The low store opening remains conditional on structural confirmation.'),
 ('Image fidelity / approval status','These are AI-generated photographic-style proposals, not measured images. Visible conflicts were reviewed and several openings, bed orientations and missing elements corrected. Exact pixel-to-drawing dimensions, concealed geometry and consistency of every reverse camera are not certified. Any remaining discrepancy must be corrected against the drawings before the image is approved; do not fabricate from the pictures.'),
 ('Construction coordination','Final checks remain for stair structure and guards, finish build-ups, all door and wardrobe swings, plumbing and waterproofing, hob/window/extraction, electrical set-out, AC and condensation, curtain clearance and outdoor drainage. The existing source is a design-review set, not a signed construction package.')]:
    y=notes_block(title,body,M,y,W-2*M)
footer('Review edition / no claim of architectural, engineering or client approval of the new images')

start('08 / FINAL INTERIOR GALLERY','A consistent material language','Interior gallery')
photo(image_for('02-living','wide'),M,64,W-2*M,422)
footer('Living room / warm white, oak and open circulation')
for room in ['09-bedroom3','05-wash','15-terrace']:
    meta=next(x for x in DATA['rooms'] if x['id']==room)
    start('08 / INTERIOR GALLERY',meta['title'])
    photo(image_for(room,'wide'),M,64,W-2*M,422)
    footer(meta['title']+' / photographic-style design proposal')

c.save();doc=fitz.open(stream=mem.getvalue(),filetype='pdf')
for target,source,rect in inserts:doc[target].show_pdf_page(rect,plan_doc,source,keep_proportion=True)
doc.set_toc(toc)
output=OUT/('Hensal House — Interior Design & Visualization.pdf' if not DRAFT else '.source/qa/layout-draft.pdf')
output.parent.mkdir(parents=True,exist_ok=True)
doc.save(output,garbage=4,deflate=True)
(SRC/'image-placement-audit.json').write_text(json.dumps(image_records,indent=2))
(SRC/'document-build.json').write_text(json.dumps({'pdf':output.name,'pages':len(doc),'image_placements':len(image_records),'plan_source_sha256':hashlib.sha256((ROOT/'drawings/compact-v4/Hensal_Complete_House_Plans.pdf').read_bytes()).hexdigest(),'status':DATA['status']},indent=2))
print(json.dumps({'pdf':str(output),'pages':len(doc),'image_placements':len(image_records)}))

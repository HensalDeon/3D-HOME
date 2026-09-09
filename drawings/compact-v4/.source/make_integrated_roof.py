#!/usr/bin/env python3
"""Reference-compatible finishes for the full-stair roof option; A3 review set."""
from pathlib import Path
import base64
import json
import pymupdf
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import mm
import make_ensuite_plans as v4
import make_roof_study as roof
from make_plans import Plan

OUT = Path(__file__).resolve().parent / 'roof-integrated'
RF, TOP, UNDER = roof.RF, roof.COVER_TOP, roof.COVER_UNDER
GUARD = RF + 1.10
SCREEN = 7.40
PAGES = 4


def base(c, number, title, subtitle):
    c.setFillColor(white)
    c.rect(0, 0, *v4.PAGE, fill=1, stroke=0)
    v4.tx(c, 16, 280, 'HENSAL / INTEGRATED ROOF ACCESS', 9, v4.TEAL, True)
    v4.tx(c, 16, 266, title, 23, v4.INK, True)
    v4.tx(c, 16, 256, subtitle, 8, v4.MUTED)
    c.setStrokeColor(v4.LINE)
    c.setLineWidth(.5)
    c.line(16*mm, 249*mm, 404*mm, 249*mm)
    c.line(16*mm, 19*mm, 404*mm, 19*mm)
    v4.tx(c, 16, 12, 'FULL ROOF ACCESS / 08 SEP 2026 / DIMENSIONS IN METRES', 7, v4.MUTED)
    v4.tx(c, 296, 12, f'CONCEPT - NOT FOR CONSTRUCTION   {number} / {PAGES}', 7, v4.MUTED)


def integrated_elevation(p, rear=False):
    # Same measured enclosure as the roof study. Finish is the only massing revision.
    left = 3.80 if rear else 0
    v4.timber(p, left, RF, left+2.20, UNDER, True)
    p.fill_rect(left, UNDER, left+2.20, TOP, v4.WALL)
    p.fill_rect(left, TOP-.045, left+2.20, TOP, v4.DARK)
    v4.glazing(p, left+.55, 7.95, .90, .45, 'obscured')
    # Perimeter guard projects behind the retained foreground decorative screens.
    p.line(0, GUARD, 6, GUARD, v4.DARK, .65)
    for k in range(51):
        x = k*.12
        p.line(x, RF, x, GUARD, v4.DARK, .28)
    v4.elevation(p, rear, False)
    for z, name in [(RF, 'ROOF +6.45'), (SCREEN, 'SCREEN +7.40'), (GUARD, 'GUARD +7.55'), (TOP, 'CAP +9.00')]:
        # Separate close screen/guard labels with leaders.
        label_z = 7.23 if z == SCREEN else 7.67 if z == GUARD else z
        p.polyline([(6.06, z), (6.25, z), (6.48, label_z)], v4.BLUE, .45)
        p.text(6.53, label_z-.04, name, 5.4, col=v4.BLUE, align='l')
    p.dims('x', -.65, 0, [6], size=6)


def plan_sheet(c):
    base(c, 1, 'Roof access / one compact enclosure', 'ROOF PLAN 1:55 AT A3 / FULL SOUTH STAIR / FRONT AND REAR FACADES RETAINED')
    roof.roof_plan(Plan(c, 37, 43, 1000/55))
    y = 230
    for title, body in [
        ('MATERIALS CONNECT THE TWO ROOF LEVELS', 'Use vertical timber-look cladding on the enclosure\'s east and west end walls to match the existing screen. Warm-white side walls and a shallow white fascia with a thin charcoal edge keep the upper enclosure visually light.'),
        ('SAME STAIR, SAME FOOTPRINT', 'The roof enclosure remains 2.20 x 4.10 m outside, adding 9.02 m2 / 97.1 sq ft. Its front face is set back 2.15 m; the rear face is set back 3.45 m. Ground and first floors remain 626.5 sq ft each.'),
        ('KEEP THE OPEN ROOF USABLE', 'The 900 mm exit door opens onto the north-side roof landing. Keep its swing and approach clear. The perimeter guard is shown continuously at 1.10 m concept height; final infill and fixings need detailed design.'),
        ('THE SILHOUETTE IS TALLER', 'The cap is +9.00 m, 1.60 m above the existing +7.40 m timber screen. The enclosure is narrower and set back, but remains visible. This option retains the approved first-floor rear canopy and toilet-vent arrangement.'),
        ('DETAILING STILL TO COORDINATE', 'Cladding build-up must fit the stated envelope. Coordinate weathering, cap flashings, waterproofing, guard anchors, stair structure and clear headroom. Drainage arrows and the services reserve are inherited concept indications, not installation details.'),
    ]:
        y = v4.block(c, 225, y, title, body, 173)


def elevation_sheet(c):
    base(c, 2, 'A stepped roofline in the same materials', 'FRONT / REAR ELEVATIONS 1:55 AT A3 / FULL PROJECTED HEIGHTS, WITHOUT PERSPECTIVE CONCEALMENT')
    v4.tx(c, 28, 238, 'FRONT / EAST', 10, v4.TEAL, True)
    v4.tx(c, 231, 238, 'REAR / WEST', 10, v4.TEAL, True)
    integrated_elevation(Plan(c, 28, 60, 1000/55))
    integrated_elevation(Plan(c, 231, 60, 1000/55), True)
    v4.para(c, 28, 40, 'The narrow timber-clad enclosure rises behind the existing front-left screen. Repeat its white cap and dark edge; retain the front balcony, windows and entrance below.', 170, 8, 4.4)
    v4.para(c, 231, 40, 'At the rear the enclosure sits behind the right timber screen. The open left drying balcony, short curved canopy return, two toilet vents and concealed master side entry remain.', 172, 8, 4.4)


def profile_sheet(c):
    base(c, 3, 'Setbacks, height and the roof exit', 'LONGITUDINAL MASSING PROFILE 1:50 / ENCLOSURE NORTH ELEVATION 1:35 AT A3')
    v4.tx(c, 27, 234, 'SOUTH-WING PROFILE / FRONT AT LEFT', 10, v4.TEAL, True)
    # Cropped vertical view of the roof zone, with full horizontal scale.
    p = Plan(c, 28, 50, 20)
    p.fill_rect(0, 6.30, 9.70, RF, HexColor('#c9c6bf'))
    p.fill_rect(2.15, RF, 6.25, UNDER, v4.WALL)
    p.fill_rect(2.15, UNDER, 6.25, TOP, v4.WALL)
    p.fill_rect(2.15, TOP-.045, 6.25, TOP, v4.DARK)
    for x in [0, 9.55]:
        v4.timber(p, x, RF, x+.15, 7.20, True)
        p.fill_rect(x, 7.20, x+.15, SCREEN, v4.DARK)
    p.line(0, GUARD, 9.70, GUARD, v4.MUTED, .6, dash=[2, 2])
    p.dims('x', 5.90, 0, [2.15, 4.10, 3.45], size=7)
    p.dims('y', 10.15, RF, [UNDER-RF], size=6, side=-1)
    p.text(4.2, 8.0, 'SETBACK STAIR ENCLOSURE', 7, True)
    p.text(4.2, 7.65, '2.40 m clear above roof landing', 6, col=v4.MUTED)
    p.text(0, 5.5, 'FRONT', 6, True, col=v4.TEAL, align='l')
    p.text(9.70, 5.5, 'REAR', 6, True, col=v4.TEAL, align='r')
    v4.para(c, 28, 152, 'The foreground screens stay at +7.40 m. The new cap is +9.00 m; the dashed guard top is +7.55 m. The long enclosure wall uses warm-white plaster. Screen thickness is diagrammatic; this is a massing profile, not a stair section.', 203, 8, 4.5)
    v4.tx(c, 260, 234, 'ROOF EXIT / NORTH SIDE', 10, v4.TEAL, True)
    e = Plan(c, 263, 147, 1000/35)
    e.fill_rect(0, 0, 4.10, UNDER-RF, v4.WALL)
    e.fill_rect(0, UNDER-RF, 4.10, TOP-RF, v4.WALL)
    e.fill_rect(0, TOP-RF-.045, 4.10, TOP-RF, v4.DARK)
    v4.glazing(e, .20, 0, .90, 2.10, 'door')
    e.line(-.10, 0, 4.25, 0, v4.MUTED, .6)
    e.dims('x', -.48, 0, [4.10], size=7)
    v4.para(c, 261, 121, 'The door sits near the front end of the north wall and opens outward onto the roof. It is distinct from the master-bedroom balcony door one floor below. Confirm the finished threshold and landing drainage together.', 133, 8, 4.5)
    y = 119
    y = v4.block(c, 28, y, 'FULL STAIR GEOMETRY RETAINED', 'Continue the south dog-leg stair for another 3.00 m rise: 17 equal risers of 176.47 mm, 250 mm treads, and 900 mm clear flights and landing. See sheet 08 in this set for the developed stair profile.', 202)
    v4.block(c, 28, y, 'HEIGHT AND AREA ARE EXPLICIT', 'Cap +9.00 m; roof landing +6.45 m; underside +8.85 m. Added enclosure 9.02 m2; conservative combined enclosed/covered study area 125.42 m2 / 1,350.0 sq ft. Finishes do not enlarge the proposed enclosure.', 202)


def exterior_sheet(c):
    base(c, 4, 'Roof access / exterior appearance', 'PHOTOREALISTIC CONCEPT / NOT TO SCALE / VECTOR DRAWINGS GOVERN GEOMETRY')
    path = OUT/'exterior-concept.png'
    if path.exists():
        c.drawImage(str(path), 32*mm, 43*mm, width=356*mm, height=198*mm, preserveAspectRatio=True, anchor='c')
    else:
        v4.tx(c, 35, 180, 'Exterior visualization pending generation', 16, v4.MUTED)
    v4.para(c, 25, 32, 'The upper stair enclosure is a visible, set-back addition. Its timber end walls and white/charcoal cap continue the existing palette. Perspective may change apparent sizes; refer to the elevation and setback sheets.', 370, 8, 4.4)


def main():
    assert abs(roof.HEAD_AREA-9.02) < 1e-8
    assert abs(2.15+4.10+3.45-v4.D) < 1e-8
    assert abs(UNDER-RF-2.40) < 1e-8
    assert abs(TOP-SCREEN-1.60) < 1e-8
    names = ['01-roof-plan', '02-integrated-elevations', '03-setbacks-and-exit', '04-exterior-concept']
    pdf = OUT/'Hensal_Integrated_Roof_Access.pdf'
    c = canvas.Canvas(str(pdf), pagesize=v4.PAGE)
    c.setTitle('Hensal - Integrated full-stair roof access')
    for fn in [plan_sheet, elevation_sheet, profile_sheet, exterior_sheet]:
        fn(c)
        c.showPage()
    c.save()
    with pymupdf.open(pdf) as doc:
        for page, name in zip(doc, names):
            page.get_pixmap(matrix=pymupdf.Matrix(1.3, 1.3), alpha=False).save(OUT/f'{name}.png')
            (OUT/f'{name}.svg').write_text(page.get_svg_image())
    panels = ''.join('<section><h2>'+title+'</h2><img alt="'+title+'" src="data:image/png;base64,'+base64.b64encode((OUT/f'{name}.png').read_bytes()).decode()+'"></section>' for name, title in zip(names, ['Roof plan', 'Integrated elevations', 'Setbacks and exit', 'Exterior concept']))
    (OUT/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hensal / Integrated roof access</title><style>body{margin:0;background:#edf0eb;color:#25343b;font:16px system-ui}header,main{max-width:1450px;margin:auto;padding:24px}h1{font-size:32px;letter-spacing:-.03em}p{line-height:1.6;max-width:1050px}h2{font-size:19px;color:#197a77}section{margin-bottom:32px}img{display:block;width:100%;box-shadow:0 4px 24px #25343b18}</style><header><h1>Full roof access, in the same materials.</h1><p>A compact stair enclosure with timber end walls, warm-white sides and a white/charcoal cap. Cap height +9.00 m; added enclosure 97.1 sq ft. The approved upper rear facade remains below. This is a concept option; the vector drawings govern dimensions.</p><a href="Hensal_Integrated_Roof_Access.pdf">Download A3 PDF</a></header><main>'+panels+'</main></html>')
    data = {'roof_enclosure_m': [2.20, 4.10], 'added_area_m2': roof.HEAD_AREA, 'roof_landing_m': RF, 'cover_underside_m': UNDER, 'cover_top_m': TOP, 'retained_screen_top_m': SCREEN, 'guard_top_m': GUARD, 'front_setback_m': 2.15, 'rear_setback_m': 3.45, 'balcony_access': 'master bedroom side door retained', 'status': 'appearance concept; structural and waterproofing detailing pending'}
    (OUT/'dimensions.json').write_text(json.dumps(data, indent=2)+'\n')
    print(pdf)


if __name__ == '__main__':
    main()

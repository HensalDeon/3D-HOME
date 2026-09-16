#!/usr/bin/env python3
"""Build the single coordinated house/roof review package from retained sources."""
from pathlib import Path
import base64
import json
import pymupdf
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import white
import make_ensuite_plans as house
import make_roof_study as roof
import make_integrated_roof as integrated
import structural_framing as framing
import under_stair_revision as revision

SOURCE = Path(__file__).resolve().parent
OUT = SOURCE.parent
PDF = OUT/'Hensal_Complete_House_Plans.pdf'
PAGE_NUMBER = 0
TOTAL = 12


def base(c, ignored_number, title, subtitle):
    c.setFillColor(white)
    c.rect(0, 0, *house.PAGE, fill=1, stroke=0)
    house.tx(c, 16, 280, 'HENSAL / COMPLETE HOUSE + ROOF ACCESS', 9, house.TEAL, True)
    house.tx(c, 16, 266, title, 23, house.INK, True)
    house.tx(c, 16, 256, subtitle, 8, house.MUTED)
    c.setStrokeColor(house.LINE)
    c.setLineWidth(.5)
    c.line(16*mm, 249*mm, 404*mm, 249*mm)
    c.line(16*mm, 19*mm, 404*mm, 19*mm)
    house.tx(c, 16, 12, 'COORDINATED REVIEW SET / 08 SEP 2026 / DIMENSIONS IN METRES', 7, house.MUTED)
    house.tx(c, 272, 12, f'ARCHITECT / BUILDER REVIEW - NOT FOR CONSTRUCTION   {PAGE_NUMBER:02d} / {TOTAL:02d}', 6.3, house.MUTED)


def cover(c):
    base(c, 1, 'Complete house plans / full roof access', 'A3 COORDINATED DESIGN REVIEW SET / THREE BEDROOMS, THREE ENSUITES / R8 EXTERNAL WALLS 220 / 170 MM / R13 UNDER-STAIR COMPOSITION')
    c.drawImage(str(OUT/'exterior-concept.png'), 20*mm, 92*mm, width=226*mm, height=150*mm, preserveAspectRatio=True, anchor='c')
    house.tx(c, 262, 235, 'DRAWING INDEX', 11, house.TEAL, True)
    entries = [
        ('01', 'Cover, index and design basis'),
        ('02', 'Site, parking and main-floor area'),
        ('03', 'Ground floor / R13 under-stair composition'),
        ('04', 'First floor / roof-stair continuation'),
        ('05', 'Roof plan / full-stair enclosure'),
        ('06', 'Integrated front and rear elevations'),
        ('07', 'Under-stair composition / headed wall opening'),
        ('08', 'Developed stair profile / RCC slab depth'),
        ('09', 'Conceptual structural framing'),
        ('10', 'Roof setbacks and exit elevation'),
        ('11', 'Original style references / context'),
        ('12', 'Current exterior appearance'),
    ]
    for i, (n, label) in enumerate(entries):
        house.tx(c, 262, 224-i*8, n, 8, house.TEAL, True)
        house.tx(c, 274, 224-i*8, label, 8, house.INK)
    house.para(c, 262, 126, 'Print on A3 at 100% / actual size. Each drawing states its scale. Do not scale the photographs or the developed stair diagram horizontally.', 134, 8, 4.5)
    house.para(c, 262, 101, 'This set replaces the separate compact-v4 and integrated-roof review PDFs. The current design includes full stairs to the roof and one conceptual structural framing option. The R13 under-stair composition stands in the coordinated R10 wall opening - cut to +2.10 m, plastered header retained above; a full-height removal is not assumed.', 134, 8, 4.5)
    house.block(c, 25, 82, 'COORDINATED DESIGN BASIS', 'R8 external walls: 220 mm ground, 170 mm first. Ground floor: 59.30 m2 / 638.3 sq ft. First floor: 58.51 m2 / 629.8 sq ft. Roof enclosure: 9.02 m2 / 97.09 sq ft additional. Conservative total: 126.84 m2 / 1,365.3 sq ft. Roof landing +6.45 m; stair cover +9.00 m. Rear balcony entry is on the master-bedroom side wall, with two toilet vents facing the rear.', 218)
    house.block(c, 262, 76, 'FOR ARCHITECT / BUILDER REVIEW', 'Dimensioned vectors govern over the render. The stair is shown as a conceptual RCC waist-slab system only; its waist thickness, landing beams, supports, reinforcement and connections must be designed by a structural engineer. Measured site set-out, structural design, stair headroom, waterproofing, services and permit drawings remain to be coordinated by the project professionals.', 134)


def references(c):
    base(c, 11, 'Original style references / design context', 'REFERENCE IMAGES ONLY / NOT THE CURRENT OPENING ARRANGEMENT OR ROOF HEIGHT / NOT TO SCALE')
    house.tx(c, 26, 234, 'ORIGINAL FRONT REFERENCE', 10, house.TEAL, True)
    house.tx(c, 231, 234, 'ORIGINAL REAR REFERENCE', 10, house.TEAL, True)
    c.drawImage(str(SOURCE/'inputs/frontview.jpeg'), 27*mm, 65*mm, width=162*mm, height=165*mm, preserveAspectRatio=True, anchor='c')
    c.drawImage(str(SOURCE/'inputs/rearview.png'), 232*mm, 65*mm, width=162*mm, height=165*mm, preserveAspectRatio=True, anchor='c')
    house.para(c, 26, 53, 'Style source: white plaster, timber, rounded charcoal surrounds and recessed balconies. The current design adds the taller setback roof-stair enclosure and continuous roof guarding shown on sheets 05, 06, 09 and 11.', 172, 8, 4.4)
    house.para(c, 231, 53, 'The original rear photo shows superseded doors and an outdoor hearth. Current rear openings follow the plans: an independent ground service route, two upper toilet vents, master-bedroom side balcony entry, and a wash-only work area.', 173, 8, 4.4)


def exterior(c):
    base(c, 12, 'Current exterior / full roof access', 'PHOTOREALISTIC APPEARANCE STUDY / NOT TO SCALE / DIMENSIONED PLANS AND ELEVATIONS GOVERN')
    c.drawImage(str(OUT/'exterior-concept.png'), 32*mm, 43*mm, width=356*mm, height=198*mm, preserveAspectRatio=True, anchor='c')
    house.para(c, 25, 32, 'The stair enclosure has matching timber end walls, warm-white sides and a white/charcoal cap. It rises 1.60 m above the existing screen. Two toilet vents replace the former upper rear door; the master balcony entrance remains on the side.', 370, 8, 4.4)


def main():
    global PAGE_NUMBER
    house.OUT = integrated.OUT = OUT
    house.base = roof.base = integrated.base = base
    import under_stair_revision
    under_stair_revision.install()
    house.validate()
    assert abs(roof.HEAD_AREA-9.02) < 1e-8
    assert abs(roof.COVER_UNDER-roof.RF-2.40) < 1e-8
    sheets = [
        ('00-cover', 'Cover and drawing index', cover),
        ('01-site', 'Site and parking', house.site),
        ('02-ground', 'Ground floor', house.ground_sheet),
        ('03-first', 'First floor and roof-stair continuation', house.first_sheet),
        ('08-roof-plan', 'Roof plan', integrated.plan_sheet),
        ('04-elevations', 'Integrated elevations', integrated.elevation_sheet),
        ('05-stair-vastu', 'Stair geometry and Vastu', house.detail_sheet),
        ('09-stair-section', 'Developed stair profile and headroom', roof.sheet2),
        ('11-structural-framing', 'Conceptual structural framing', framing.sheet),
        ('10-roof-setbacks', 'Roof setbacks and exit', integrated.profile_sheet),
        ('06-reference-comparison', 'Original style references', references),
        ('07-exterior-concept', 'Current exterior appearance', exterior),
    ]
    c = canvas.Canvas(str(PDF), pagesize=house.PAGE, pageCompression=1)
    c.setTitle('Hensal - Complete House Plans with Full Roof Access')
    c.setAuthor('Hensal residence - design review set')
    c.setSubject('Coordinated site, floor plans, full roof access, elevations and exterior. Architect/builder review; not for construction.')
    for PAGE_NUMBER, (slug, title, draw) in enumerate(sheets, 1):
        c.bookmarkPage(slug)
        c.addOutlineEntry(f'{PAGE_NUMBER:02d} - {title}', slug, 0)
        draw(c)
        c.showPage()
    c.save()
    with pymupdf.open(PDF) as doc:
        for pg, (slug, _, _) in zip(doc, sheets):
            pg.get_pixmap(matrix=pymupdf.Matrix(1.3, 1.3), alpha=False).save(OUT/f'{slug}.png')
            (OUT/f'{slug}.svg').write_text(pg.get_svg_image())
    sections = ''.join('<section id="'+slug+'"><h2>'+str(i)+'. '+title+'</h2><img alt="'+title+'" src="data:image/png;base64,'+base64.b64encode((OUT/f'{slug}.png').read_bytes()).decode()+'"></section>' for i, (slug, title, _) in enumerate(sheets, 1))
    nav = ''.join('<a href="#'+slug+'">'+str(i)+'. '+title+'</a>' for i, (slug, title, _) in enumerate(sheets, 1))
    (OUT/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hensal / Complete house plans</title><style>*{box-sizing:border-box}body{margin:0;background:#edf0eb;color:#25343b;font:16px system-ui}header,main{max-width:1450px;margin:auto;padding:24px}h1{font-size:34px;letter-spacing:-.03em}p{line-height:1.6;max-width:1050px}h2{font-size:19px;color:#197a77}section{margin-bottom:32px;scroll-margin-top:20px}img{display:block;width:100%;box-shadow:0 4px 24px #25343b18}nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}a{color:#197a77}nav a{padding:8px 12px;border:1px solid #b8c6c0;border-radius:20px;text-decoration:none;font-size:13px}.download{display:inline-block;background:#197a77;color:white;border-radius:8px;padding:12px 18px;text-decoration:none}a:focus-visible{outline:3px solid #b87f33;outline-offset:3px}@media(max-width:600px){header,main{padding:16px}h1{font-size:27px}}</style><header><h1>Complete house plans + full roof access</h1><p>One coordinated, 12-sheet A3 package for your architect and builder. Site, ground and first floors, three ensuites, full roof stairs, roof plan, elevations, setbacks and the current exterior image.</p><a class="download" href="Hensal_Complete_House_Plans.pdf" download="Hensal_Complete_House_Plans.pdf">Download the complete PDF</a><p>Each main floor: 626.46 sq ft. Roof enclosure: 97.09 sq ft additional. Design review set; professional construction detailing remains required.</p><nav aria-label="Drawing sheets">'+nav+'</nav></header><main>'+sections+'</main></html>')
    # The desktop HTML preview serves a single file; embed the PDF for downloads.
    gallery = OUT/'index.html'
    pdf_data = base64.b64encode(PDF.read_bytes()).decode()
    gallery.write_text(gallery.read_text().replace('href="Hensal_Complete_House_Plans.pdf"', 'href="data:application/pdf;base64,'+pdf_data+'"'))
    dimensions = house.validate()
    dimensions.update({'roof_enclosure_m2': roof.HEAD_AREA, 'total_including_roof_m2': 2*house.AREA+roof.HEAD_AREA, 'roof_landing_m': roof.RF, 'roof_cover_top_m': roof.COVER_TOP, 'roof_clear_landing_height_m': 2.4, 'roof_access': 'full south stair from first floor', 'drawing_count': TOTAL})
    # R13 under-stair coordination, read straight out of the layout the 3D model is built from, so
    # the published dimensions cannot drift from the model. The wall opening is the one number here
    # that is a structural commitment rather than a joinery dimension, so it is stated with its head,
    # its retained header and the fact that a full-height removal is not assumed.
    L = revision.L
    tv, opening, wash = L['tv'], L['tv']['wallOpening'], L['wash']
    dimensions.update({
        'revision': L['revision'],
        'under_stair_wall_opening': {
            'box_m': opening['box'],
            'head_m': opening['height'],
            'header_zone_m': opening['header']['z'],
            'header_depth_m': round(opening['header']['z'][1]-opening['header']['z'][0], 3),
            'slab_soffit_m': opening['headerTop'],
            'partition_mm': 100,
            'full_height_removal_assumed': False,
            'status': 'Coordinated R10 headed opening, held unchanged through R12/R13/R14. A full-height removal with no header is not assumed and must not be inferred; it requires separate structural and architectural verification. TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER.',
        },
        'under_stair_composition': {
            'under_flight': tv['under'],
            'zone_m': tv['zone'],
            'faces': tv['face'],
            'face_x_m': tv['faceX'],
            'cabinet_m': [tv['cabinet']['length'], tv['cabinet']['depth']],
            'cabinet_top_m': tv['cabinet']['top'],
            'panel_thickness_m': tv['panelThickness'],
            'panel_top_profile_m': tv['panelTopProfile'],
            'panel_soffit_gap_m': tv['panelSoffitGap'],
            'screen_diagonal_in': tv['screen']['diagonalInches'],
            'screen_centreline_y_m': tv['screen']['center'],
            'screen_centre_height_m': tv['screen']['centerHeight'],
            'projection_into_passage_m': tv['projection']['intoPassage'],
            'enclosed_storage_m3': tv['storage']['volume_m3'],
            'open_display_m3': tv['storage']['openDisplay_m3'],
            'balustrade_required': tv['balustrade']['required'],
        },
        # R15: the basin is part of the same run now, so it is published on the same face plane and
        # depth as the joinery rather than as a separate corner fitting.
        'under_stair_washbasin': {
            'zone_m': wash['box'],
            'faces': wash['face'],
            'face_x_m': wash['faceX'],
            'vanity_m': [wash['length'], wash['depth']],
            'rim_m': wash['height'],
            'standing_zone_m': wash['standing'],
            'mirror_y_m': wash['mirror']['y'],
            'mirror_z_m': wash['mirror']['z'],
            'divider_m': wash['finish']['divider']['box'],
            'clear_height_m': wash['clearHeights']['overBowl'],
            'continuous_run_m': round(wash['box'][3]-tv['zone'][1], 3),
            'shares_face_plane_with_joinery': wash['faceX'] == tv['faceX'],
            'services': wash['servicesNote'],
        },
    })
    (OUT/'dimensions.json').write_text(json.dumps(dimensions, indent=2)+'\n')
    print(PDF)


if __name__ == '__main__':
    main()

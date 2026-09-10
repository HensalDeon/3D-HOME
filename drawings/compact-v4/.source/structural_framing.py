"""R7 conceptual whole-house structural framing sheet; shares its data with the 3D model."""
from pathlib import Path
import json
from reportlab.lib.colors import HexColor, Color
import make_ensuite_plans as h

F = json.loads((Path(__file__).resolve().parents[3] / 'model/src/structural-frame.json').read_text())
PLAN = json.loads((Path(__file__).resolve().parents[3] / 'model/src/plan-data.json').read_text())
COL = HexColor('#4a5550')                 # column zones, solid
BEAM = Color(.29, .48, .47, alpha=.42)    # beam bands, translucent so walls stay readable
TRIM = Color(.72, .50, .20, alpha=.50)    # floor-slab trimmers around the stairwell
GHOST = HexColor('#dfe3de')               # existing walls, context only
GX = {g['id']: g for g in F['gridX']}
GY = {g['id']: g for g in F['gridY']}


def framing_plan(p, bubbles=True):
    """Typical framing plan: existing walls in ghost, then grid, beams, columns, stair trimmers."""
    p.rect(0, 0, 6, 9.7, h.LINE, .4)
    for w in PLAN['levels']['ground']:
        if w['op'] == 'wall':
            p.fill_rect(*w['args'][:4], GHOST)
    # Grid lines run past the envelope so the bubbles sit clear of the plan.
    for g in F['gridX']:
        p.line(g['at'], -.55, g['at'], 10.25, h.MUTED, .3, dash=[3, 1.5, .8, 1.5])
    for g in F['gridY']:
        p.line(-.55, g['at'], 6.55, g['at'], h.MUTED, .3, dash=[3, 1.5, .8, 1.5])
    # Slab openings before the members, so the stairwell reads as a hole in the floor above.
    for o in F['slabs']['openings']:
        p.rect(*o['box'], h.MUTED, .4, dash=[2, 2])
        p.text((o['box'][0] + o['box'][2]) / 2, o['box'][1] + .32, 'STAIRWELL / SLAB OPENING', 4.2, col=h.MUTED)
    for b in F['beams']:
        p.fill_rect(*b['box'], BEAM)
    for t in F['trimmers']:
        p.fill_rect(*t['box'], TRIM)
    for c in F['columns']:
        p.fill_rect(*c['box'], COL)
    if bubbles:
        for g in F['gridX']:
            p.circle(g['at'], -.72, .30, h.TEAL, .5)
            p.text(g['at'], -.80, g['id'], 5.6, True, col=h.TEAL)
        for g in F['gridY']:
            p.circle(-.72, g['at'], .30, h.TEAL, .5)
            p.text(-.72, g['at'] - .08, g['id'], 5.6, True, col=h.TEAL)
    # Slab span direction: two-way, shown on two real panels clear of the stairwell.
    for cx, cy in [(1.6, 7.9), (4.5, 4.2)]:
        p.polyline([(cx - .45, cy), (cx + .45, cy)], h.BLUE, .5, True)
        p.polyline([(cx, cy - .45), (cx, cy + .45)], h.BLUE, .5, True)
        p.text(cx, cy - .78, 'TWO-WAY SLAB', 4.0, col=h.BLUE)


def depth_diagram(q):
    """How the indicative beam depth eats into the 2.85 m clear storey."""
    slab, beam = F['slab'], F['indicativeBeam']
    q.fill_rect(0, 2.85, 3.4, 2.85 + slab, HexColor('#d2d6d3'))
    q.fill_rect(.55, 2.85 - beam, 1.05, 2.85, BEAM)
    q.fill_rect(2.35, 2.85 - beam, 2.85, 2.85, BEAM)
    q.fill_rect(.55, 0, 1.05, 2.85 - beam, COL)
    q.fill_rect(2.35, 0, 2.85, 2.85 - beam, COL)
    q.line(0, 0, 3.4, 0, h.MUTED, .5)
    for b0, b1 in [(.55, 1.05), (2.35, 2.85)]:
        q.rect(b0, 2.85 - beam, b1, 2.85, h.TEAL, .4)
    for x, z1, t in [(1.45, 2.85, '2.85 CLEAR'), (2.15, 2.85 - beam, '2.55 UNDER A BEAM')]:
        q.line(x, 0, x, z1, h.BLUE, .4)
        for z in (0, z1):
            q.line(x - .07, z, x + .07, z, h.BLUE, .4)
        q.text(x - .06, z1 / 2, t, 4.0, rot=90, col=h.BLUE)
    q.text(1.7, 2.85 + slab + .10, '%d mm SLAB / %d mm INDICATIVE BEAM' % (slab * 1000, beam * 1000), 4.4, col=h.MUTED)
    q.text(.80, -.22, 'COLUMN', 4.2, col=h.MUTED)
    q.text(2.60, -.22, 'COLUMN', 4.2, col=h.MUTED)


def sheet(c):
    h.base(c, 9, 'Conceptual structural framing', 'R7 / 10 SEP 2026 / TYPICAL FRAMING PLAN 1:55 AT A3 / ONE COORDINATED OPTION, NOT A STRUCTURAL DESIGN')
    framing_plan(h.Plan(c, 52, 52, 1000 / 55))
    h.tx(c, 25, 32, 'Typical framing plan / both suspended floors', 8, h.TEAL, True)
    h.para(c, 25, 26, 'Solid = column zones. Green = beam lines. Amber = stairwell trimmers. '
                      'Ghosted grey = the existing walls, for location only.', 140, 8, 4.4)
    spans = sorted(F['beams'], key=lambda b: -b['span'])
    y = 231
    for title, body in [
        ('THE GRID', 'Three longitudinal and six transverse lines, every one set out on a wall or pier that already '
                     'exists. A / B / C = west external wall, central spine line with its piers, east external wall. '
                     '1 to 6 = front face, sit-out edge, kitchen/stair wall, bedroom wall, rear cross wall, rear face.'),
        ('COLUMNS', '%d column zones. Fourteen fall on an existing wall junction or an existing pier. Only C4 is new: it '
                    'stands inside the 150 mm east external wall beside the rear service passage, added to keep the grid C '
                    'span under 5 m. No column stands free of a wall, on the stair, or in the under-stair unit.' % len(F['columns'])),
        ('HOW MEMBERS ARE SIZED HERE', 'Members are drawn at the thickness of the host wall where that is 150 mm, so they '
                    'stay concealed. On a 100 mm wall they are drawn 230 mm wide, carried across the wall to one declared side: '
                    'B east into the living side, 3 south into the kitchen, 4 north into Bedroom 1, 5 north into the rear work '
                    'area. Grids 3 and 4 matter - the other way would leave 2.20 m over the stair starter landing and clash '
                    'with the under-stair store. 230 mm is indicative only.'),
        ('BEAMS AND SLABS', '%d beam lines. The longest is %s at %.2f m in the east external wall; the shortest runs %.2f m. '
                            'Floor slabs are the 150 mm two-way slabs already assumed, spanning between the grid beams, with the '
                            'stairwell trimmed as shown. The same grid serves +3.45 and +6.45 m; A3 and A4 continue to the '
                            'stair-cover at +9.00 m. Grid 4 A4-B4 is the R6 stair landing beam. The ground floor is on grade.'
         % (len(F['beams']), spans[0]['grid'] + ': ' + spans[0]['from'] + '-' + spans[0]['to'], spans[0]['span'], spans[-1]['span'])),
        ('COORDINATION TO RESOLVE', F['coordination'][1] + ' ' + F['coordination'][3]),
        ('STATUS', F['note']),
    ]:
        y = h.block(c, 180, y, title, body, 216)
    h.tx(c, 181, 78, 'HOW THE BEAM DEPTH SITS IN THE STOREY / DIAGRAMMATIC', 8, h.TEAL, True)
    depth_diagram(h.Plan(c, 190, 24, 15))
    h.para(c, 300, 72, 'Walls are 2.85 m clear. An indicative 300 mm downstand leaves about 2.55 m under a beam line. '
                       'Beam soffits, drops and any flush-beam or band-beam alternative are the engineer’s to decide.', 100, 7.6, 4.2)

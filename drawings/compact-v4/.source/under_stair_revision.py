"""R5 drawing overlay, shared with the 3D model; retained base functions stay reusable."""
from pathlib import Path
import json
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import mm
import make_ensuite_plans as h
import make_roof_study as roof
L=json.loads((Path(__file__).resolve().parents[3]/'model/src/under-stair-layout.json').read_text())
R=3/17
ST=L['structure']   # R6 conceptual RCC stair, shared with the 3D model
WAIST,LAND,FIN=ST['waist'],ST['landingSlab'],ST['finish']
SLOPE=(.25**2+R**2)**.5
WZONE=(WAIST+FIN)*SLOPE/.25   # vertical construction zone under the finished nosing line
LZONE=LAND+FIN                # landing slab plus its finish
NOSE=lambda d: 12*R+(d-.9)*4*R   # R9: upper-flight waist top, the internal-corner line one riser
                                 # below the nosing line, against distance from the bedroom wall.
                                 # 4 risers over 1.0 m (was 7 over 1.75 m), landing raised to 12R.
WALL=L['bedroomWallFace']
OLD_GROUND=h.ground
OLD_STAIR=h.stair
OLD_SECTION=roof.section
OAK=HexColor('#b69873'); CARCASS=HexColor('#e3cfaf'); BASIN=HexColor('#dce8e2'); SLAB=HexColor('#d2d6d3')
STORE=Color(.85,.75,.58,alpha=.5)   # translucent, so the landing and tread lines beneath stay legible

def steps():
 # R9: starter grows from 2 to 5 risers (S-going, using the nook beside the old riser 1); west
 # flight keeps its R2 tread positions, renumbered 3 risers higher; intermediate landing rises
 # from 9R to 12R; upper flight shrinks from 7 to 4 risers, arrival landing grows to y = 4.2.
 s=[([1.8-i*.25,2.3,2.05-i*.25,3.2],(i+1)*R) for i in range(4)]
 s += [([.15,2.3,1.05,3.2],5*R)]
 s += [([.15,3.2+i*.25,1.05,3.45+i*.25],(6+i)*R) for i in range(6)]
 s += [([.15,5.2,2.05,6.1],12*R)]
 s += [([1.15,4.95-i*.25,2.05,5.2-i*.25],(13+i)*R) for i in range(4)]
 s += [([1.15,2.3,2.05,4.2],3)]
 return s

def soffits():
 """(start, end, lowest clear height) along the upper-flight bay, measured from the stair-side
 face of the bedroom wall. R9: the landing slab governs the first 0.90 m, the inclined waist
 soffit governs the next 1.00 m (4 risers), and beyond that (1.90-3.80 m) there is no flight
 overhead at all - it is now plain first-floor slab, the extra floor R9 frees up."""
 return [(0,.9,12*R-LZONE)]+[(.9+i*.25,1.15+i*.25,NOSE(.9+i*.25)-WZONE) for i in range(4)]+[(1.9,3.8,2.85)]

def stair(p,floor,show_passage=True,continue_to_roof=False):
 if floor!='GF':return OLD_STAIR(p,floor,show_passage,continue_to_roof)
 p.fill_rect(.15,2.3,2.05,6.1,HexColor('#f4f5f3'))
 # R9: the upper flight is now only 4 risers (indices 12-15) plus the arrival (16); everything
 # from the intermediate landing (index 11) onward is dashed as overhead, same convention as R6.
 for i,(b,z) in enumerate(steps()):
  p.rect(*b,h.MUTED if i>=12 else h.INK,.45,dash=[2,2] if i>=12 else None)
 p.rect(*L['stair']['landingExtension'],h.INK,.45)
 p.line(.15,5.2,1.05,5.2,h.PALE,1)
 structure_plan(p)
 # R9: the basin's own archway (y = 5.2-6.1) is the only way in now - the old route entering
 # before the TV panel and walking down inside the nook no longer exists (the starter flight
 # fills that whole width). Route drawn from the archway to the basin standing zone.
 p.polyline([(2.9,5.65),(2.15,5.65),(1.7,5.5)],h.TEAL,.9,True)
 p.text(1.3,2.48,'UP / S',4.6,True,col=h.TEAL)
 p.text(.60,4.90,'12R LANDING',4.2,col=h.TEAL)
 if show_passage:p.text(2.63,4.25,'OPEN ACCESS',4.5,rot=90,col=h.MUTED)

def structure_plan(p,label=True):
 """R6 conceptual RCC support zones in plan: they sit inside walls and slab edges that already
 exist, so no room, no under-stair function and no living-area floor area is taken."""
 for zone in ST['beamZones']:
  b=zone['box']
  p.fill_rect(*b,HexColor('#c8ccc6'))
  p.rect(*b,h.INK,.35,dash=[2,1.5])
 if label:
  p.text(1.10,6.26,'LANDING BEAM ZONE / TO BE DESIGNED',3.4,col=h.MUTED)
  p.text(1.60,3.30,'SLAB TRIMMER ZONE',3.2,col=h.MUTED)

def poly(p,pts,fill=None,stroke=None,lw=.6):
 c=p.c;c.saveState()
 if fill:c.setFillColor(fill)
 if stroke:c.setStrokeColor(stroke);c.setLineWidth(lw)
 q=c.beginPath();q.moveTo(p.X(pts[0][0]),p.Y(pts[0][1]))
 for x,y in pts[1:]:q.lineTo(p.X(x),p.Y(y))
 q.close();c.drawPath(q,fill=1 if fill else 0,stroke=1 if stroke else 0);c.restoreState()

def fixtures(p,detail=False):
 old=L['oldSlopedStorageFootprint'];tc=L['tv']['screenCenter'];w=L['wash']
 # Dashed outline is the TV locating reference only, not an installed cabinet.
 p.rect(*old,h.MUTED,.4,dash=[1,2])
 # R15: the basin leaves the corner against the bedroom wall and continues the TV run in the same
 # band - same 0.35 m depth, the same face plane at x = 1.04, facing the same way. A full-height
 # oak fin at y = 5.45-5.48 divides the wet zone from the joinery. The mirror comes off the wall
 # and onto the backing panel, so in plan it now reads along y, not across it.
 b=w['box'];cy=(b[1]+b[3])/2
 p.fill_rect(*b,BASIN);p.rect(*b,h.TEAL,.7);p.rect(b[0]+.04,b[1]+.05,b[2]-.03,b[3]-.05,h.TEAL,.4)
 p.text((b[0]+b[2])/2,cy,'BASIN',3.8 if detail else 3.3,rot=90,col=h.TEAL)
 dv=w['finish']['divider']['box'];p.fill_rect(*dv,OAK);p.rect(*dv,h.INK,.5)
 p.rect(*w['standing'],h.TEAL,.6,dash=[2,2])
 my=w['mirror']['y'];mf=w['finish']['panelling']['box'][2]+.012
 p.line(mf,my[0],mf,my[1],h.GLASS,1.2)
 p.polyline([(w['faceX']+.06,cy),(w['faceX']+.42,cy)],h.TEAL,.7,True)
 p.text(w['faceX']+.86,cy,'BASIN FACES EAST',4.2 if detail else 3.6,True,rot=90,col=h.TEAL)
 # R14: the composition sits under the LOWER / WEST FLIGHT, not on the stair-side wall line. In
 # plan it is a 2.25 x 0.35 m low cabinet at x = 0.69-1.04 with its face on the flight edge, a
 # 30 mm oak backing 0.29 m behind that face, the screen surface-mounted on the backing, and -
 # dashed, because they are open - the low shelf and the two-shelf end bay. It faces EAST and is
 # read from the living room through the retained 2.00 m headed opening.
 t=L['tv']
 p.fill_rect(*t['cabinet']['box'],CARCASS);p.rect(*t['cabinet']['box'],h.INK,.5)
 for i in range(1,t['cabinet']['fronts']):
  fy=t['cabinet']['box'][1]+i*t['cabinet']['frontWidth']
  p.line(t['cabinet']['box'][2]-.05,fy,t['cabinet']['box'][2],fy,h.INK,.35)
 p.fill_rect(*t['panel'],OAK)
 for sh in t['shelves']:p.rect(sh['x'][0],sh['y'][0],sh['x'][1],sh['y'][1],h.MUTED,.4,dash=[1.5,1.5])
 p.fill_rect(*t['box'],h.INK);p.text(t['box'][2]+.07,tc,'TV',5,rot=90,col=h.INK)
 # Direction of view: the unit faces east, across the stairwell and out through the opening.
 p.polyline([(t['faceX']+.06,tc),(t['faceX']+.42,tc)],h.BLUE,.7,True)
 # R9: basin archway (dashed = open, not a wall), reusing the old store-door position, no doors.
 p.rect(2.05,5.2,2.15,6.1,h.TEAL,.6,dash=[2,2])
 if detail:p.wall(.15,6.1,2.3,6.2)
 p.polyline(w['approach'],h.BLUE,.55,True)
 if detail:
  p.text(2.88,4.30,'SCREEN CL 4.64 / 43 in / FACES EAST THROUGH THE 2.00 m OPENING',4.2,rot=90,col=h.BLUE)
  p.text(2.2,5.6,'ARCHWAY 0.90 / NO DOORS',3.6,rot=90,col=h.TEAL)
  p.text(1.2,6.31,'BEDROOM WALL / STAIR-SIDE FACE y = 6.10',4,col=h.MUTED)
  p.text(.60,4.30,'OAK BACKING 30 / TOP EDGE FOLLOWS THE MEASURED SOFFIT',3.2,rot=90,col=h.MUTED)
  p.text(1.34,4.30,'LOW CABINET 2.25 x 0.35 / TOP +0.45 / FACE x = 1.04',3.6,rot=90,col=h.MUTED)
  p.text(1.34,5.30,'END BAY, 2 SHELVES',2.9,rot=90,col=h.MUTED)
  p.text(1.34,3.86,'LOW SHELF',2.9,rot=90,col=h.MUTED)
  p.text(2.60,3.6,'NOTHING BUILT ON THE STAIR-SIDE WALL',3.6,rot=90,col=h.MUTED)


class GroundProxy:
 def __init__(self,p):self.p=p
 def __getattr__(self,n):return getattr(self.p,n)
 def wall(self,*a,**kw):
  if list(a[:4])==[3.05,0,3.15,9.7]:
   self.p.wall(3.05,0,3.15,2.3);self.p.wall(3.05,6.1,3.15,9.7)
  elif list(a[:4])==[2.05,2.3,2.15,6.1]:
   # R10: only the stair-entry jamb (y = 2.3-3.2) is still blockwork at plan-cut height. From
   # y = 3.2 to 5.2 the partition is removed below +2.10 m and replaced by the TV unit's joinery
   # face (drawn in fixtures); the last 0.90 m is the open basin archway.
   self.p.wall(2.05,2.3,2.15,3.2)
  else:self.p.wall(*a,**kw)
 def opening(self,*a,**kw):
  if a[0]==3.05 and a[1] in [2.45,5.2]:return
  if a[0]==2.05 and a[1]==2.35:a=(2.05,2.3,.9,*a[3:])
  self.p.opening(*a,**kw)
 def rect(self,*a,**kw):
  if list(a[:4]) in [[.15,4.5,1.05,5.1],[3.2,3.4,3.43,4.4]]:return
  self.p.rect(*a,**kw)
 def text(self,*a,**kw):
  if a[2] in ['STORE/WASH - VERIFY HEADROOM','TV']:return
  self.p.text(*a,**kw)

def ground(p):
 OLD_GROUND(GroundProxy(p));fixtures(p)

def ground_sheet(c):
 h.base(c,3,'Ground floor / under-stair joinery and washbasin, one continuous run','R15 / 16 SEP 2026 / PLAN 1:55 AT A3 / BASIN MOVED INTO THE JOINERY RUN / STAIR, ARCHWAY AND CIRCULATION UNCHANGED')
 ground(h.Plan(c,44,45,1000/55));h.compass(h.Plan(c,0,0,10),23.4,22.1)
 y=236
 for title,body in [
 ('RISER SHIFT: STARTER 2 -> 5, UPPER FLIGHT 7 -> 4','R9 moves 3 risers from the upper return flight into the starter flight, using floor already inside the stair\'s own footprint. The west flight keeps its exact R2 tread positions, renumbered 3 risers higher. The intermediate landing rises from riser 9 to riser 12 (+0.53 m); the upper flight needs only 4 risers instead of 7, so its run shrinks from 1.75 to 1.00 m and the trimmer moves from y = 3.45 to y = 4.2. All 17 risers stay 176.47 mm; the first-to-roof stair is untouched.'),
 ('R15 / BASIN MOVED INTO THE JOINERY RUN, FACING THE SAME WAY','R15 takes the basin out of the corner against the bedroom wall and continues the joinery run with it: a 0.62 x 0.35 m vanity at x = 0.69-1.04, y = 5.48-6.10, on the same depth and the same face plane at x = 1.04, facing EAST like the screen across the bay. You come in through the unchanged 0.90 m archway and the basin is square in front of you. The oak backing runs on behind it to the wall and carries the mirror; a full-height fin at y = 5.45-5.48 keeps splash off the joinery. Rim +0.86 m, mirror 0.40 x 0.80 m and the 750 x 600 mm standing zone are all unchanged. Clear height is now a uniform 1.95 m under the 12R landing, still short of the 2.20 m benchmark. Supply and waste run behind the backing into the y = 6.10 wall, to be coordinated with the plumbing design.'),
 ('R14 / TV JOINERY MOVED UNDER THE LOWER FLIGHT','R14 moves the fitted TV joinery out of the stair-side wall line and into the volume under the LOWER / WEST FLIGHT, where the real raking soffit is and where the space was dead. The unit is 2.25 x 0.35 m at x = 0.69-1.04, y = 3.20-5.45, facing EAST across the stairwell and read from the living room through the retained 2.00 m headed opening about 1.35 m away. A 30 mm oak backing at x = 0.72-0.75 follows the flight underside, held 60 mm clear the whole way, rising with the flight and then running level under the 12R landing slab. A 43-inch screen, 0.96 x 0.54 m, is surface-mounted on the backing at centreline y = 4.64, centre +0.87 m, in the taller portion; a low shelf sits beside it and a two-shelf end bay closes the run at the nook end. The cabinet is capped at +0.45 m on a recessed lit plinth, its face at x = 1.04 just clear of the flight edge at x = 1.05 and its balustrade at x = 1.07. Nothing is built against the stair-side wall any more and nothing enters the 1.00 m living passage.'),
 ('THE WALL OPENED TO +2.10, THE HEADER RETAINED, AND THE STORAGE TRADE','The 100 mm stair-side partition is cut away over the 2.00 m span from floor level to +2.10 m only, and retained above as a plastered header to the 2.85 m slab soffit - the coordinated R10 condition, which sheet 11 and the framing data are drawn to and which R12 holds. A FULL-HEIGHT REMOVAL WITH NO HEADER IS NOT ASSUMED AND MUST NOT BE INFERRED FROM THE JOINERY; it needs separate structural and architectural verification. The consequence, stated plainly: from the living room you look through that opening, under the header, straight across the stairwell to the joinery under the lower flight; the upper flight above +2.10 m is concealed by the header. Because that header stands from +2.10 m to the slab and the flight tread tops run +2.29 to +2.82 m, the east side of the flight is enclosed by wall and no balustrade is required. The opening must still be confirmed with the rest of the stair support system. Enclosed storage is the base cabinet alone - about 0.265 m3, against 0.86 m3 in the withdrawn R10 wedge and 3.5 m3 in the store R9 deleted.'),
 ('CONCEPTUAL STRUCTURE / ARCHITECTURE OTHERWISE LOCKED','STAIR SHOWN AS CONCEPTUAL RCC WAIST-SLAB SYSTEM. FINAL WAIST-SLAB THICKNESS, LANDING BEAMS, SUPPORT CONDITIONS, REINFORCEMENT AND CONNECTIONS TO BE DESIGNED BY STRUCTURAL ENGINEER. 100 MM PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING. No revision through R15 moves a riser, flight, landing, support zone, slab trimmer, wall opening or archway; R15 moves the basin only, within the room it already had. Every other wall, door and window keeps its R2 geometry.')]:
  y=h.block(c,246,y,title,body,156)

RAKE=4*R
def lower_soffit(y):
 """Underside of the lower/west flight at plan y, in this set's construction convention: the
 internal-corner line of the flight less the waist construction zone, stepping to the flat 12R
 landing slab soffit once the flight ends at y = 4.70."""
 if y<=4.7:return 5*R+(y-3.2)*(6*R/1.5)-WZONE
 return 12*R-LZONE

def panel_top(y):
 """Top edge of the R14 oak backing: the flight underside less the published 60 mm clearance."""
 return lower_soffit(y)-L['tv']['panelSoffitGap']

def tv_section(q,U):
 """R14: the composition drawn in the LOWER / WEST FLIGHT bay it actually occupies. U maps plan y
 to the local horizontal axis of whichever section it is drawn into. The oak backing's top edge
 follows the real flight underside, held 60 mm clear, so it rises with the flight and then runs
 level under the 12R landing slab."""
 t=L['tv'];cab=t['cabinet'];y0,y1=t['panel'][1],t['panel'][3]
 # Backing panel, as its true profile: bottom edge, then the raking top, then the level run.
 ys=[y0+i*(y1-y0)/60 for i in range(61)]
 top=[(U(y),panel_top(y)) for y in ys]
 poly(q,[(U(y0),t['panelBottom']),(U(y1),t['panelBottom'])]+top[::-1],OAK,h.INK,.55)
 # Long low cabinet on its recessed lit plinth.
 cb=cab['box']
 q.fill_rect(U(cb[1]),cab['plinth'],U(cb[3]),cab['top'],CARCASS)
 q.rect(U(cb[1]),cab['plinth'],U(cb[3]),cab['top'],h.INK,.55)
 q.fill_rect(U(cb[1])+.02,0,U(cb[3])-.02,cab['plinth'],h.MUTED)
 for i in range(1,cab['fronts']):
  fy=cb[1]+i*cab['frontWidth'];q.line(U(fy),cab['plinth'],U(fy),cab['top'],h.INK,.3)
 # Open shelf boards and the two dividers that carry the end bay.
 for sh in t['shelves']:q.fill_rect(U(sh['y'][0]),sh['top']-sh['thickness'],U(sh['y'][1]),sh['top'],h.INK)
 for dv in t['dividers']:q.line(U(dv['y'][0]),dv['z'][0],U(dv['y'][0]),dv['z'][1],h.INK,.4)
 # 43-inch screen, surface-mounted on the backing in the taller portion.
 b=t['box'];q.fill_rect(U(b[1]),t['screenBottom'],U(b[3]),t['screenTop'],h.INK)
 q.text(U(t['screenCenter']),t['screen']['centerHeight']-.03,'43 in SCREEN',3.4,col=HexColor('#ffffff'))

def wash_section(q,U):
 """R15: the basin drawn in the same bay section as the joinery, because it is now in the same
 bay. U maps plan y to the section local horizontal axis, exactly as for tv_section."""
 w=L['wash'];fin=w['finish'];b=w['box'];dv=fin['divider']['box']
 # Full-height oak fin closing the joinery run and screening it from splash.
 q.fill_rect(U(dv[1]),0,U(dv[3]),fin['divider']['top'],OAK)
 q.rect(U(dv[1]),0,U(dv[3]),fin['divider']['top'],h.INK,.5)
 # The joinery backing panel, carried on behind the vanity to the bedroom wall.
 q.fill_rect(U(b[1]),0,U(b[3]),fin['panelling']['top'],OAK)
 q.rect(U(b[1]),0,U(b[3]),fin['panelling']['top'],h.INK,.35)
 # Floating vanity: oak carcass, stone counter, white vessel basin standing on it.
 va=fin['vanity']
 q.fill_rect(U(b[1]),va['carcass'][0],U(b[3]),va['carcass'][1],CARCASS)
 q.rect(U(b[1]),va['carcass'][0],U(b[3]),va['carcass'][1],h.INK,.55)
 q.fill_rect(U(b[1]),va['counter'][0],U(b[3]),va['counter'][1],h.INK)
 bw=fin['bowl']['box'];bz=fin['bowl']['z']
 q.fill_rect(U(bw[1]),bz[0],U(bw[3]),bz[1],BASIN);q.rect(U(bw[1]),bz[0],U(bw[3]),bz[1],h.TEAL,.5)
 # Backlit vertical mirror, now on the backing rather than on the bedroom wall.
 mz=w['mirror']['z'];my=w['mirror']['y']
 q.fill_rect(U(my[0]),mz[0],U(my[1]),mz[1],h.GLASS);q.rect(U(my[0]),mz[0],U(my[1]),mz[1],h.TEAL,.5)
 q.text((U(b[1])+U(b[3]))/2,mz[1]+.05,'MIRROR TOP +%.2f'%mz[1],2.9,col=h.TEAL)
 q.text((U(b[1])+U(b[3]))/2,va['counter'][1]+.20,'RIM +%.2f'%w['height'],3.0,col=h.TEAL)

def bay_section(q):
 # Horizontal axis: distance from the stair-side face of the bedroom wall (plan y = 6.10 - d); west at left, looking south.
 # R9: the upper flight is now only 4 risers over 1.0 m (was 7 over 1.75 m), so beyond d = 1.9 m
 # there is no flight overhead at all - that span is now plain first-floor slab.
 q.fill_rect(-.1,0,0,2.85,h.INK);q.fill_rect(3.8,0,3.9,2.85,h.INK)
 q.fill_rect(-.3,-.15,3.9,0,SLAB)
 pts=[(0,12*R),(.9,12*R)]
 for i in range(4):
  z=(13+i)*R;d0=.9+i*.25;pts+=[(d0,z),(d0+.25,z)]
 pts+=[(1.9,3.0),(3.8,3.0),(3.8,2.85),(1.9,2.85)]
 # R9 underside: one continuous inclined waist soffit over the shortened flight, stepping to the
 # landing slab soffit; beyond the flight the underside is just the flat first-floor slab.
 pts+=[(1.9,NOSE(1.9)-WZONE),(.9,NOSE(.9)-WZONE),(.9,12*R-LZONE),(0,12*R-LZONE)]
 poly(q,pts,SLAB,h.INK,.7)
 # Conceptual landing beam zone inside the existing bedroom cross-wall; no room is encroached.
 q.fill_rect(-.1,12*R-LZONE-.15,0,12*R,HexColor('#a9aea7'))
 q.line(-.1,12*R-LZONE-.15,0,12*R-LZONE-.15,h.INK,.5)
 q.text(.06,12*R+.10,'LANDING BEAM ZONE / TO BE DESIGNED',3.4,col=h.MUTED,align='l')
 q.text(.45,12*R-.095,'12R LANDING SLAB',3.6,col=h.MUTED)
 q.polyline([(1.2,NOSE(1.2)-WZONE-.02),(1.95,2.32)],h.MUTED,.4)
 q.text(2.0,2.66,'CONTINUOUS RCC WAIST SLAB %d mm'%(WAIST*1000),3.4,col=h.MUTED,align='l')
 q.text(2.0,2.50,'NO FLIGHT OVERHEAD BEYOND d = 1.90',3.4,col=h.MUTED,align='l')
 q.text(2.0,2.34,'EXTRA FIRST-FLOOR LANDING ABOVE',3.4,col=h.MUTED,align='l')
 q.text(1.95,2.80,'%d WAIST + %d FINISH / %d LANDING SLAB / CONCEPTUAL - VERIFY'%(WAIST*1000,FIN*1000,LAND*1000),3.0,col=h.MUTED,align='l')
 # R14: nothing is built in this bay any more. The joinery moved into the lower/west flight bay,
 # drawn separately below right; from here it is seen beyond, across the stairwell.
 q.text(2.0,2.26,'WALL BEHIND: CUT TO +2.10 / HEADER RETAINED TO THE SLAB',3.0,col=h.MUTED,align='l')
 q.text(2.0,2.02,'R15: BAY WHOLLY CLEAR - JOINERY AND BASIN ARE BOTH UNDER THE LOWER FLIGHT, SEE SECTION BELOW RIGHT',3.0,col=h.BLUE,align='l')
 # R15: the basin has left this bay as well. It now continues the joinery run in the lower-flight
 # bay, so nothing at all is built here - only a scale figure is drawn, to read the clear heights.
 hx=.65
 q.circle(hx,1.62,.1,h.MUTED,.6);q.line(hx,.95,hx,1.52,h.MUTED,.6)
 q.line(hx,.95,hx-.11,0,h.MUTED,.6);q.line(hx,.95,hx+.11,0,h.MUTED,.6)
 q.text(hx,1.86,'SCALE FIGURE',3.0,col=h.MUTED)
 for a,b,z in soffits():
  q.text((a+b)/2+.03,z-.06,f'{z:.2f}',3.5,rot=90,col=h.BLUE,align='r')
 q.dims('x',-.32,0,[.95],size=4.6)
 q.line(-.3,0,3.95,0,h.MUTED,.5)
 for z,t in [(0,'GF +0.45'),(3.0,'FF +3.45')]:q.line(3.9,z,4.05,z,h.BLUE,.5);q.text(4.1,z-.05,t,4.5,col=h.BLUE,align='l')
 q.text(-.2,1.45,'BEDROOM WALL',4,rot=90,col=h.MUTED)
 q.text(4.0,1.45,'KITCHEN WALL',4,rot=90,col=h.MUTED)
 q.text(.05,2.55,'< WEST',5,True,col=h.TEAL,align='l');q.text(3.7,2.55,'EAST >',5,True,col=h.TEAL,align='r')
 q.text(.05,2.42,'NOTHING BUILT IN THIS BAY',3.8,col=h.MUTED,align='l')
 q.text(.05,2.29,'CLEAR HEIGHTS IN BLUE',3.6,col=h.MUTED,align='l')
 q.dims('x',-.45,.95,[.40,1.25,.30],size=4.2)
 q.text(2.0,-.62,'R15: BAY EMPTY / ARCHWAY, 12R LANDING AND RETAINED HEADER UNCHANGED',3.6,col=h.BLUE)

def detail_sheet(c):
 h.base(c,7,'Under-stair built-in / joinery and basin in the lower-flight bay','R15 / 16 SEP 2026 / STAIR PLAN 1:25 AND BAY SECTIONS 1:40 AT A3 / STRUCTURE IS CONCEPTUAL MASSING, NOT A STRUCTURAL DESIGN')
 p=h.Plan(c,20,70-2.3*40,40);stair(p,'GF',False);fixtures(p,True)
 p.dims('x',6.45,.15,[.9,.1,.9],size=6)
 p.text(1.34,5.55,'STANDING',2.9,col=h.BLUE)
 p.text(3.1,3.05,'NORTH >',5.5,True,col=h.TEAL)
 h.tx(c,25,54,'One continuous run in the bay that actually has the raking soffit',8,h.TEAL,True)
 h.para(c,25,46,'The R12 stair, all risers, flights, landings, trimmer, structural support conditions and retained +2.10 to +2.85 m plastered header are unchanged, as is the 0.90 m doorless archway. R14 emptied the upper-flight bay and built the joinery into the lower-flight bay, under a real 1.50 m rake. R15 now brings the basin across into that same bay, on the same depth and the same face plane, so the under-stair volume reads as one continuous 2.90 m fitted run instead of a joinery run plus a separate corner fitting. The upper-flight bay is left completely empty.',140,8,4.4)
 y=231
 for title,body in [
 ('1 / RISER SHIFT, 5 + 7 + 4-PLUS-ARRIVAL','Starter grows from 2 to 5 risers inside the stair\'s own footprint. West flight keeps its exact R2 tread positions, renumbered 3 risers higher (6-12). The intermediate landing rises from riser 9 to riser 12 (+0.53 m). The upper flight needs only 4 risers instead of 7, so the trimmer moves from y = 3.45 to y = 4.2.'),
 ('2 / R15 / BASIN CONTINUES THE RUN, 0.62 x 0.35 m, FACING EAST','The vanity leaves the bedroom wall and continues the joinery run at x = 0.69-1.04, y = 5.48-6.10: same 0.35 m depth, same face plane at x = 1.04, same EAST orientation as the screen opposite, so it is read face-on from the archway. Counter, drawer, vessel, mixer and the +0.86 m rim are unchanged; the vanity gains 0.12 m because the bay runs to the wall. The mirror moves onto the oak backing, still 0.40 x 0.80 m at z = 1.00-1.80, and a full-height fin at y = 5.45-5.48 screens the joinery from splash. Standing zone 750 x 600 mm at x = 1.04-1.64; clear height a uniform 1.95 m under the 12R landing. Supply and waste run behind the backing into the y = 6.10 wall - TO BE COORDINATED WITH THE PLUMBING DESIGN.'),
 ('3 / R14 / 2.25 m LONG x 0.35 m DEEP, UNDER THE LOWER FLIGHT','R14 moved the fitted TV joinery into the volume under the LOWER / WEST FLIGHT, where the real raking soffit is. The unit is 2.25 x 0.35 m at x = 0.69-1.04, y = 3.20-5.45, facing EAST and read from the living room through the retained 2.00 m headed opening. A 30 mm oak backing at x = 0.72-0.75 follows the flight underside 60 mm clear. A 43-inch screen, 0.96 x 0.54 m, sits at centreline y = 4.64, centre +0.87 m; a low shelf and a two-shelf end bay close the run. The cabinet is capped at +0.45 m on a recessed lit plinth, face at x = 1.04 just clear of the flight edge.'),
 ('4 / CONCEPTUAL RCC STAIR / EVERYTHING ELSE LOCKED','STAIR SHOWN AS CONCEPTUAL RCC WAIST-SLAB SYSTEM. FINAL WAIST-SLAB THICKNESS, LANDING BEAMS, SUPPORT CONDITIONS, REINFORCEMENT AND CONNECTIONS TO BE DESIGNED BY STRUCTURAL ENGINEER. 100 MM PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING. Support: plinth, west external wall, landing beam zone in the bedroom cross-wall and the trimmer at y = 4.2. Partition cut below +2.10 m, header retained above.')]:y=h.block(c,180,y,title,body,216)
 h.tx(c,181,115,'SECTION / UPPER-FLIGHT BAY / LOOKING SOUTH / 1:40 / CONCEPTUAL RCC',8,h.TEAL,True)
 bay_section(h.Plan(c,190,36,25))
 h.tx(c,318,115,'SECTION / LOWER-FLIGHT BAY / JOINERY AND BASIN / 1:40',8,h.TEAL,True)
 q=h.Plan(c,320,49,25)
 U=lambda y:y-3.2
 top=[(0,5*R)]
 for i in range(6):
  x=i*.25;z=(6+i)*R;top+=[(x,z),(x+.25,z)]
 top+=[(1.5,12*R),(2.9,12*R)]
 bot=[(0,5*R-WZONE),(1.5,11*R-WZONE),(1.5,12*R-LZONE),(2.9,12*R-LZONE)]
 poly(q,top+bot[::-1],SLAB,h.INK,.7)
 tv_section(q,U)
 wash_section(q,U)
 q.line(0,0,2.9,0,h.MUTED,.5)
 q.text(.34,1.78,'RCC WAIST SLAB',3.4,col=h.MUTED)
 q.text(.34,1.63,'BACKING HELD 60 UNDER IT',3.0,col=h.BLUE)
 q.text(1.9,12*R+.08,'12R LANDING OVER',3.0,col=h.MUTED)
 q.text(.30,.20,'CABINET TOP +0.45',3.0,col=h.MUTED)
 q.dims('x',-.22,0,[2.25,.65],size=4.0)
 q.text(1.45,-.40,'2.90 m CONTINUOUS RUN / y = 3.20 TO 6.10 / JOINERY 2.25 + FIN AND BASIN 0.65',3.2,col=h.BLUE)
 q.text(0.02,2.32,'< STAIR ENTRY / y = 3.20',3.4,col=h.TEAL,align='l')
 q.text(2.88,2.32,'BEDROOM WALL / y = 6.10 >',3.4,col=h.TEAL,align='r')
 h.para(c,318,33,'Same R2 tread positions, now risers 6-12. Backing held 60 mm clear of the real flight underside; 2.25 x 0.35 m cabinet, then the full-height fin, then the 0.62 m vanity to the wall - one face plane at x = 1.04 throughout, all facing EAST. Waist slab conceptual.',84,7,3.8)

def section(p):
 # Developed paths: GF now 5 + 7 + (4 + arrival) risers under R9; roof stair stays 9 + 8. Every
 # flight is a continuous RCC waist slab and every turn a landing slab, so nothing reads as floating.
 for x0,x1,z in [(-.35,5.7,roof.GF),(-.35,0,roof.FF),(5.8,6.35,roof.FF),(4.65,5.2,roof.RF)]:
  p.fill_rect(x0,z-.15,x1,z,SLAB)
 for z0,groups in [(roof.GF,[(5,.9),(7,1.4),(5,0)]),(roof.FF,[(9,.9),(8,0)])]:
  top=[(0,z0)];bot=[];x=0;z=z0
  for count,landing in groups:
   fx,fz=x,z
   for i in range(count):
    z+=R;top.append((x,z))
    if i<count-1:x+=.25;top.append((x,z))
   # The waist soffit is the nosing line dropped by one construction zone; it dies into the
   # slab or landing it springs from at each end.
   bot+=[(fx,fz-WZONE),(x,z-R-WZONE)]
   if landing:
    bot+=[(x,z-LZONE)];x+=landing;top.append((x,z));bot+=[(x,z-LZONE)]
  poly(p,top+bot[::-1],SLAB,h.INK,.85)
  p.text(2.7,z0+.25,'5 + 7 + 5 / GF (R9)' if z0==roof.GF else '9 + 8 / TO ROOF',5,col=h.TEAL)
  p.text(2.7,z0+.05,'CONTINUOUS RCC WAIST SLAB / LANDING SLAB',3.8,col=h.MUTED)
 p.fill_rect(-.1,roof.COVER_UNDER,5.7,roof.COVER_TOP,SLAB)
 p.dims('y',6.0,roof.RF,[2.4],size=6,side=-1)
 for z,t in [(roof.GF,'GF +0.45'),(roof.FF,'FF +3.45'),(roof.RF,'ROOF +6.45'),(9,'COVER +9.00')]:roof.level(p,z,t)
 p.text(2.5,-.25,'UNFOLDED PATHS / NOT HORIZONTAL SET-OUT / %d mm WAIST + %d mm FINISH, INDICATIVE'%(WAIST*1000,FIN*1000),5,col=h.MUTED)

def install():
 h.stair=stair;h.ground=ground;h.ground_sheet=ground_sheet;h.detail_sheet=detail_sheet;roof.section=section
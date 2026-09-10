from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

out=Path(__file__).resolve().parents[1]/'BATHROOM_3_DECISION.pdf'
c=canvas.Canvas(str(out),pagesize=(842,595));c.setTitle('Bedroom 3 ensuite — fixture conflict and proposed resolution')
c.setFillColor(HexColor('#f6f3ec'));c.rect(0,0,842,595,fill=1,stroke=0)
def text(x,y,t,size=10,bold=False,color='#333B35'):
 c.setFillColor(HexColor(color));c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x,y,t)
text(34,553,'BEDROOM 3 / ENSUITE',10,True)
text(34,520,'Doorway and basin conflict',25)
text(34,493,'Source geometry stays fixed. Only the basin alternative below is proposed.',11)
def plan(ox,title,proposed=False):
 oy=185;s=110
 def box(x0,y0,x1,y1,color):
  c.setFillColor(HexColor(color));c.rect(ox+(x0-4.55)*s,oy+(y0-6.2)*s,(x1-x0)*s,(y1-y0)*s,fill=1,stroke=0)
 text(ox-10,449,title,13,True)
 box(4.45,6.1,4.55,8.3,'#6d746b');box(5.85,6.1,5.95,8.3,'#6d746b')
 box(4.55,8.2,5.85,8.3,'#6d746b');box(4.55,6.1,4.85,6.2,'#6d746b');box(5.6,6.1,5.85,6.2,'#6d746b')
 box(4.55,7.4,5.85,8.2,'#d7e1de');text(ox+34,oy+1.52*s,'SHOWER',9)
 box(5.1,6.79,5.8,7.21,'#dfdbd1');text(ox+.88*s,oy+.95*s,'WC',9)
 # Door opens OUTWARD to bedroom: approved north hinge, 750 mm leaf.
 c.setStrokeColor(HexColor('#a4845c'));c.setLineWidth(2);c.line(ox+1.05*s,oy,ox+1.05*s,oy-.75*s)
 c.setDash(3,3);c.arc(ox+.3*s,oy-.75*s,ox+1.8*s,oy+.75*s,startAng=180,extent=90);c.setDash()
 if proposed:
  box(4.55,6.2,4.85,6.6,'#97ad98');text(ox+4,oy+.21*s,'BASIN',8)
 else:
  box(4.7,6.2,5.1,6.52,'#c48c78');text(ox+.17*s,oy+.16*s,'BASIN',8)
  c.setStrokeColor(HexColor('#a13d2d'));c.setLineWidth(3);c.line(ox+.3*s,oy+7,ox+.55*s,oy+7)
 text(ox+37,oy-24,'750 mm opening',9)
 text(ox+20,oy+2.14*s,'1300 mm clear',9)
 text(ox+1.43*s,oy+1.1*s,'2000 mm',9)
plan(88,'A / Current source')
plan(490,'B / Fixture-only alternative',True)
text(34,97,'A: 400 x 320 mm basin overlaps the doorway by 250 mm.',10)
text(34,76,'B: 400 x 300 mm wall-hung basin rotates onto the south wall in the same corner.',10)
text(34,55,'Keeps all walls, door, WC, shower and vents. Requires a short plumbing return and installer verification.',10)
text(34,28,'Decision drawing only. Alternative B is not approved or applied to the source model.',9,color='#737A72')
c.showPage();c.save();print(out)

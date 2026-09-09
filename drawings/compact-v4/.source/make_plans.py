#!/usr/bin/env python3
"""Generate the dimensioned plan set for the Hensal residence (G+1, 4 cent plot).
Output: Hensal_Plan_Set_v2.pdf (2 x A3 landscape sheets). All geometry in metres."""
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import Color, black, white
from reportlab.pdfgen import canvas
import math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Hensal_Plan_Set_v2.pdf")
PAGE = landscape(A3)  # 420 x 297 mm
GREY_WALL = Color(0.12, 0.12, 0.12)
GREY_FURN = Color(0.45, 0.45, 0.45)
GREY_LIGHT = Color(0.80, 0.80, 0.80)
GREY_FILL = Color(0.93, 0.93, 0.93)
GREEN_FILL = Color(0.87, 0.93, 0.84)
ROAD_FILL = Color(0.85, 0.85, 0.85)
BLUE_DIM = Color(0.10, 0.25, 0.55)

# ----------------------------------------------------------------- helpers
class Plan:
    """Draw in metre coordinates; ox/oy are page offsets in mm; s = mm per metre."""
    def __init__(self, c, ox, oy, s):
        self.c, self.ox, self.oy, self.s = c, ox, oy, s

    def X(self, x): return (self.ox + x * self.s) * mm
    def Y(self, y): return (self.oy + y * self.s) * mm
    def L(self, v): return v * self.s * mm

    # --- primitives
    def fill_rect(self, x0, y0, x1, y1, col, stroke=0, lw=0.3):
        c = self.c; c.saveState(); c.setFillColor(col); c.setStrokeColor(black); c.setLineWidth(lw)
        c.rect(self.X(x0), self.Y(y0), self.L(x1 - x0), self.L(y1 - y0), stroke=stroke, fill=1); c.restoreState()

    def wall(self, x0, y0, x1, y1):
        self.fill_rect(x0, y0, x1, y1, GREY_WALL)

    def rect(self, x0, y0, x1, y1, col=GREY_FURN, lw=0.35, dash=None):
        c = self.c; c.saveState(); c.setStrokeColor(col); c.setLineWidth(lw)
        if dash: c.setDash(dash)
        c.rect(self.X(x0), self.Y(y0), self.L(x1 - x0), self.L(y1 - y0), stroke=1, fill=0); c.restoreState()

    def line(self, x0, y0, x1, y1, col=black, lw=0.35, dash=None):
        c = self.c; c.saveState(); c.setStrokeColor(col); c.setLineWidth(lw)
        if dash: c.setDash(dash)
        c.line(self.X(x0), self.Y(y0), self.X(x1), self.Y(y1)); c.restoreState()

    def polyline(self, pts, col=black, lw=0.5, arrow=False):
        c = self.c; c.saveState(); c.setStrokeColor(col); c.setFillColor(col); c.setLineWidth(lw)
        p = c.beginPath(); p.moveTo(self.X(pts[0][0]), self.Y(pts[0][1]))
        for x, y in pts[1:]: p.lineTo(self.X(x), self.Y(y))
        c.drawPath(p, stroke=1, fill=0)
        if arrow:
            (x0, y0), (x1, y1) = pts[-2], pts[-1]
            ang = math.atan2(self.Y(y1) - self.Y(y0), self.X(x1) - self.X(x0))
            ah = 2.2 * mm; tip = (self.X(x1), self.Y(y1))
            a = c.beginPath(); a.moveTo(*tip)
            a.lineTo(tip[0] - ah * math.cos(ang - 0.4), tip[1] - ah * math.sin(ang - 0.4))
            a.lineTo(tip[0] - ah * math.cos(ang + 0.4), tip[1] - ah * math.sin(ang + 0.4))
            a.close(); c.drawPath(a, stroke=0, fill=1)
        c.restoreState()

    def circle(self, x, y, r, col=GREY_FURN, lw=0.35):
        c = self.c; c.saveState(); c.setStrokeColor(col); c.setLineWidth(lw)
        c.circle(self.X(x), self.Y(y), self.L(r), stroke=1, fill=0); c.restoreState()

    def text(self, x, y, s, size=6, bold=False, rot=0, col=black, align="c"):
        c = self.c; c.saveState(); c.setFillColor(col)
        c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
        c.translate(self.X(x), self.Y(y)); c.rotate(rot)
        if align == "c": c.drawCentredString(0, 0, s)
        elif align == "l": c.drawString(0, 0, s)
        else: c.drawRightString(0, 0, s)
        c.restoreState()

    def label(self, x, y, name, dims=None, size=6.5, rot=0):
        if dims:
            self.text(x, y + 0.12 * (1 if rot == 0 else 0), name, size, True, rot) if rot == 0 else None
            if rot == 0:
                self.text(x, y - 0.22, dims, size - 1.2, False)
            else:
                self.text(x - 0.12, y, name, size, True, rot)
                self.text(x + 0.20, y, dims, size - 1.2, False, rot)
        else:
            self.text(x, y, name, size, True, rot)

    # --- openings ---------------------------------------------------------
    def door(self, x, y, w, t, axis, swing, hinge, leaf=True):
        """axis 'h': wall along x occupying y..y+t, opening x..x+w.
           axis 'v': wall along y occupying x..x+t, opening y..y+w.
           swing +1/-1 = side the leaf swings to; hinge 'lo'/'hi' end of the opening."""
        c = self.c
        if axis == "h":
            self.fill_rect(x, y, x + w, y + t, white)
            hy = y + t if swing > 0 else y
            hx = x if hinge == "lo" else x + w
            end = (hx, hy + swing * w)
            if hinge == "lo": start = 0 if swing > 0 else 270
            else: start = 90 if swing > 0 else 180
        else:
            self.fill_rect(x, y, x + t, y + w, white)
            hx = x + t if swing > 0 else x
            hy = y if hinge == "lo" else y + w
            end = (hx + swing * w, hy)
            if hinge == "lo": start = 0 if swing > 0 else 90
            else: start = 270 if swing > 0 else 180
        if not leaf: return
        c.saveState(); c.setStrokeColor(black); c.setLineWidth(0.5)
        c.line(self.X(hx), self.Y(hy), self.X(end[0]), self.Y(end[1]))
        c.setLineWidth(0.25); c.setDash([1, 1])
        r = self.L(w)
        c.arc(self.X(hx) - r, self.Y(hy) - r, self.X(hx) + r, self.Y(hy) + r, start, 90)
        c.restoreState()

    def opening(self, x, y, w, t, axis):
        if axis == "h":
            self.fill_rect(x, y, x + w, y + t, white)
            self.line(x, y, x + w, y, lw=0.3, dash=[1.5, 1]); self.line(x, y + t, x + w, y + t, lw=0.3, dash=[1.5, 1])
        else:
            self.fill_rect(x, y, x + t, y + w, white)
            self.line(x, y, x, y + w, lw=0.3, dash=[1.5, 1]); self.line(x + t, y, x + t, y + w, lw=0.3, dash=[1.5, 1])

    def window(self, x, y, w, t, axis):
        if axis == "h":
            self.fill_rect(x, y, x + w, y + t, white)
            for f in (0, 0.35, 0.65, 1.0):
                self.line(x, y + t * f, x + w, y + t * f, lw=0.45)
            self.line(x, y, x, y + t, lw=0.45); self.line(x + w, y, x + w, y + t, lw=0.45)
        else:
            self.fill_rect(x, y, x + t, y + w, white)
            for f in (0, 0.35, 0.65, 1.0):
                self.line(x + t * f, y, x + t * f, y + w, lw=0.45)
            self.line(x, y, x + t, y, lw=0.45); self.line(x, y + w, x + t, y + w, lw=0.45)

    def railing(self, x0, y0, x1, y1):
        self.line(x0, y0, x1, y1, lw=0.6)
        n = int(math.hypot(x1 - x0, y1 - y0) / 0.15)
        for i in range(n + 1):
            f = i / max(n, 1); px, py = x0 + (x1 - x0) * f, y0 + (y1 - y0) * f
            self.circle(px, py, 0.02, black, 0.3)

    # --- dimensions -------------------------------------------------------
    def dims(self, axis, pos, start, segs, side=1, size=5.2, col=BLUE_DIM):
        """Chain dimension. axis 'x': line at y=pos from x=start; 'y': line at x=pos from y=start."""
        c = self.c; c.saveState(); c.setStrokeColor(col); c.setFillColor(col); c.setLineWidth(0.3)
        total = sum(segs); tick = 0.9 * mm
        if axis == "x":
            c.line(self.X(start), self.Y(pos), self.X(start + total), self.Y(pos))
            p = start
            for sgm in list(segs) + [None]:
                px, py = self.X(p), self.Y(pos)
                c.line(px - tick, py - tick, px + tick, py + tick)
                c.line(px, py - 1.6 * mm, px, py + 1.6 * mm)
                if sgm is None: break
                c.setFont("Helvetica", size)
                c.drawCentredString(self.X(p + sgm / 2), py + (1.0 * mm if side > 0 else -2.6 * mm), f"{sgm:.2f}")
                p += sgm
        else:
            c.line(self.X(pos), self.Y(start), self.X(pos), self.Y(start + total))
            p = start
            for sgm in list(segs) + [None]:
                px, py = self.X(pos), self.Y(p)
                c.line(px - tick, py - tick, px + tick, py + tick)
                c.line(px - 1.6 * mm, py, px + 1.6 * mm, py)
                if sgm is None: break
                c.saveState(); c.translate(px + (-1.0 * mm if side > 0 else 2.6 * mm), self.Y(p + sgm / 2)); c.rotate(90)
                c.setFont("Helvetica", size); c.drawCentredString(0, 0, f"{sgm:.2f}"); c.restoreState()
                p += sgm
        c.restoreState()

    # --- furniture ---------------------------------------------------------
    def bed(self, x0, y0, x1, y1, head="y1"):
        self.rect(x0, y0, x1, y1)
        # pillows on head side
        if head == "y1":
            self.rect(x0 + 0.1, y1 - 0.45, x0 + (x1 - x0) / 2 - 0.05, y1 - 0.1); self.rect(x0 + (x1 - x0) / 2 + 0.05, y1 - 0.45, x1 - 0.1, y1 - 0.1)
            self.line(x0, y1 - 0.6, x1, y1 - 0.6, GREY_FURN, 0.3)
        else:  # head at x0
            self.rect(x0 + 0.1, y0 + 0.1, x0 + 0.45, y0 + (y1 - y0) / 2 - 0.05); self.rect(x0 + 0.1, y0 + (y1 - y0) / 2 + 0.05, x0 + 0.45, y1 - 0.1)
            self.line(x0 + 0.6, y0, x0 + 0.6, y1, GREY_FURN, 0.3)

    def wc(self, x, y, facing):
        # pan 0.4 x 0.7, tank at wall. facing: '+y' means user faces +y (tank at low y)
        if facing in ("+y", "-y"):
            tx0, tx1 = x - 0.2, x + 0.2
            if facing == "+y":
                self.rect(tx0, y, tx1, y + 0.18); self.circle(x, y + 0.45, 0.19)
            else:
                self.rect(tx0, y - 0.18, tx1, y); self.circle(x, y - 0.45, 0.19)
        else:
            ty0, ty1 = y - 0.2, y + 0.2
            if facing == "+x":
                self.rect(x, ty0, x + 0.18, ty1); self.circle(x + 0.45, y, 0.19)
            else:
                self.rect(x - 0.18, ty0, x, ty1); self.circle(x - 0.45, y, 0.19)

    def basin(self, x, y, w=0.5, d=0.4, side="y1"):
        if side == "y1":  # against wall at top
            self.rect(x - w / 2, y - d, x + w / 2, y); self.circle(x, y - d / 2, 0.13)
        elif side == "y0":
            self.rect(x - w / 2, y, x + w / 2, y + d); self.circle(x, y + d / 2, 0.13)
        elif side == "x1":
            self.rect(x - d, y - w / 2, x, y + w / 2); self.circle(x - d / 2, y, 0.13)
        else:
            self.rect(x, y - w / 2, x + d, y + w / 2); self.circle(x + d / 2, y, 0.13)

    def shower(self, x0, y0, x1, y1):
        self.rect(x0, y0, x1, y1, GREY_FURN, 0.3, dash=[1, 1]); self.circle((x0 + x1) / 2, (y0 + y1) / 2, 0.06)

    def chair(self, x, y, s=0.45):
        self.rect(x - s / 2, y - s / 2, x + s / 2, y + s / 2)

    def steps(self, x0, x1, y_top, n, rise_dir=-1, tread=0.3):
        for i in range(1, n + 1):
            yy = y_top + rise_dir * tread * i
            self.line(x0, yy, x1, yy, black, 0.35)
        self.line(x0, y_top, x0, y_top + rise_dir * tread * n, black, 0.35)
        self.line(x1, y_top, x1, y_top + rise_dir * tread * n, black, 0.35)


# ----------------------------------------------------------------- building data
W, D = 6.80, 10.80          # external footprint
T, t = 0.20, 0.10           # external / internal wall thickness
SX0, SX1 = 3.80, 4.00       # spine wall (load bearing)
LB0, LB1 = 0.20, 3.80       # left bay clear
RB0, RB1 = 4.00, 6.60       # right bay clear
# stair
ST_Y0, ST_Y1 = 0.20, 3.30   # stair block (landing 0.2-1.3, flights 1.3-3.3)
FA0, FA1 = 4.00, 5.25       # flight A (first, up from ground) x-range
FB0, FB1 = 5.35, 6.60       # flight B x-range
LAND_Y = 1.30


def draw_stair(p, floor):
    # landing + flights
    p.rect(RB0, ST_Y0, RB1, ST_Y1, black, 0.35)
    for i in range(9):
        yy = LAND_Y + 0.25 * i
        p.line(FA0, yy, FA1, yy, black, 0.3)
        p.line(FB0, yy, FB1, yy, black, 0.3)
    p.line(FA1, ST_Y0, FA1, ST_Y1, black, 0.5); p.line(FB0, ST_Y0, FB0, ST_Y1, black, 0.5)   # handrail / newel line
    p.line(FA1, LAND_Y, FB0, LAND_Y, black, 0.3)
    if floor == "GF":
        p.polyline([(4.62, 3.2), (4.62, 0.75), (5.97, 0.75), (5.97, 3.2)], black, 0.5, arrow=True)
        p.text(4.62, 3.05, "UP", 5, True)
        # break line on flight B (above head height) - diagonal
        p.line(FB0, 2.6, FB1, 2.9, black, 0.5); p.line(FB0, 2.65, FB1, 2.95, black, 0.5)
        p.text(RB0 + 1.3, 0.55, "18 R x 167 / 250 T", 4.6, col=BLUE_DIM)
    else:
        p.polyline([(5.97, 3.2), (5.97, 0.75), (4.62, 0.75), (4.62, 3.2)], black, 0.5, arrow=True)
        p.text(5.97, 3.05, "DN", 5, True)
        p.railing(FA0, ST_Y1, FA1, ST_Y1)   # balustrade at well edge
        p.line(FA0, 2.6, FA1, 2.9, black, 0.5); p.line(FA0, 2.65, FA1, 2.95, black, 0.5)


def draw_ground(p):
    # semi-open area fills
    p.fill_rect(LB0, 0.0, LB1, 1.40, GREY_FILL)
    # --- walls
    p.wall(0, 0, T, D)                       # left external
    p.wall(W - T, 0, W, D)                   # right external
    p.wall(0, D - T, W, D)                   # rear external
    p.wall(SX0, 0, SX1, D)                   # spine
    p.wall(LB0, 1.40, SX0, 1.60)             # living front wall
    p.wall(SX1, 0, W, T)                     # stair block front wall
    p.wall(LB0, 7.50, SX0, 7.60)             # dining / bed1
    p.wall(RB0, 4.40, RB1, 4.50)             # passage / kitchen
    p.wall(RB0, 7.50, RB1, 7.60)             # kitchen / work
    p.wall(RB0, 9.00, RB1, 9.10)             # work / toilet1
    # --- openings
    p.door(2.60, 1.40, 1.00, 0.20, "h", +1, "lo")             # main door
    p.window(0.60, 1.40, 1.50, 0.20, "h")                     # living front window
    p.window(0.0, 2.40, 1.50, 0.20, "v")                      # living left
    p.window(0.0, 5.50, 1.50, 0.20, "v")                      # dining left
    p.window(0.0, 8.20, 1.40, 0.20, "v")                      # bed1 left
    p.window(2.40, D - T, 1.10, 0.20, "h")                    # bed1 rear
    p.door(2.20, 7.50, 0.90, 0.10, "h", +1, "lo")             # bed1 door
    p.opening(SX0, 3.40, 0.90, 0.20, "v")                     # living -> passage/stair
    p.opening(SX0, 5.30, 0.90, 0.20, "v")                     # dining -> kitchen
    p.door(SX0, 9.30, 0.80, 0.20, "v", +1, "lo")              # bed1 -> toilet1
    p.window(4.60, 0.0, 1.40, 0.20, "h")                      # stair front window
    p.window(W - T, 5.20, 1.50, 0.20, "v")                    # kitchen right
    p.door(4.20, 7.50, 0.90, 0.10, "h", +1, "lo")             # kitchen -> work
    p.door(W - T, 8.00, 0.90, 0.20, "v", -1, "lo")            # work area external door
    p.window(W - T, 9.90, 0.60, 0.20, "v")                    # toilet1 right
    p.window(5.30, D - T, 0.80, 0.20, "h")                    # toilet1 rear (ventilator)
    p.window(W - T, 3.50, 0.60, 0.20, "v")                    # passage ventilator
    # --- stair
    draw_stair(p, "GF")
    # --- furniture
    p.steps(LB0, LB1, 0.0, 3)                                  # 3 entry steps in front yard
    p.text(2.0, -0.60, "STEPS", 4.6, False)
    p.chair(0.80, 0.70); p.chair(1.40, 0.70)                   # sit-out chairs
    p.rect(0.20, 2.20, 0.90, 4.20); p.line(0.20, 2.85, 0.90, 2.85, GREY_FURN, 0.3); p.line(0.20, 3.55, 0.90, 3.55, GREY_FURN, 0.3)  # sofa
    p.rect(1.40, 2.70, 2.20, 3.70)                             # coffee table
    p.rect(3.50, 2.30, 3.80, 3.30)                             # TV unit
    p.rect(1.40, 5.50, 2.90, 6.40)                             # dining table
    for cx in (1.75, 2.55):
        p.chair(cx, 5.20, 0.40); p.chair(cx, 6.70, 0.40)
    p.rect(6.00, 4.50, 6.60, 7.50); p.rect(4.00, 4.50, 6.00, 5.10)   # kitchen L counter
    p.circle(6.30, 6.00, 0.18); p.rect(4.60, 4.60, 5.30, 5.00)       # sink, hob
    p.rect(4.00, 6.85, 4.65, 7.50); p.text(4.32, 7.12, "FR", 4, False)  # fridge
    p.basin(6.55, 3.85, 0.55, 0.40, "x1")                             # wash basin
    p.rect(4.00, 7.60, 4.60, 9.00); p.circle(4.30, 8.30, 0.16)        # work-area counter + sink
    p.bed(0.50, 8.70, 2.00, D - T, "y1")
    p.rect(3.20, 8.70, 3.80, 10.50); p.text(3.50, 9.55, "WARD.", 4, False, 90)
    p.wc(6.25, 9.10 + 0.08, "+y")
    p.basin(4.90, D - T, 0.50, 0.40, "y1")
    p.shower(4.00, 9.80, 4.80, 10.60)
    # --- labels
    p.label(2.0, 0.65, "SIT OUT", "3.60 x 1.40")
    p.label(2.0, 3.30, "LIVING", "3.60 x 3.30")
    p.label(2.0, 7.05, "DINING", "3.60 x 2.60")
    p.line(LB0, 4.90, SX0, 4.90, GREY_LIGHT, 0.4, dash=[2, 1.5])
    p.label(2.0, 8.05, "BEDROOM 1", "3.60 x 3.00")
    p.label(5.3, 3.95, "PASSAGE / WASH", "2.60 x 1.10", 5.5)
    p.label(5.3, 6.05, "KITCHEN", "2.60 x 3.00")
    p.label(5.3, 8.35, "WORK AREA", "2.60 x 1.40", 5.8)
    p.label(5.55, 9.50, "TOILET 1", "2.60 x 1.50", 5.5)
    p.text(5.3, 1.85, "STAIR", 5.5, True)
    p.text(2.0, 1.15, "ENTRY", 4.2, False)
    # --- dimensions
    p.dims("x", D + 0.25, 0, [0.20, 3.60, 0.20, 2.60, 0.20], side=+1)
    p.dims("x", D + 0.75, 0, [W], side=+1)
    p.dims("y", -0.55, 0, [1.40, 0.20, 3.30, 2.60, 0.10, 3.00, 0.20], side=+1)
    p.dims("y", -1.15, 0, [D], side=+1)
    p.dims("y", W + 0.55, 0, [0.20, 3.10, 1.10, 0.10, 3.00, 0.10, 1.40, 0.10, 1.50, 0.20], side=-1)
    p.dims("y", W + 1.15, 0, [D], side=-1)


def draw_first(p):
    p.fill_rect(LB0, 0.0, LB1, 1.40, GREY_FILL)            # balcony
    p.fill_rect(RB0, 8.60, RB1, D - T, GREEN_FILL)         # open terrace
    # --- walls
    p.wall(0, 1.40, T, D)                    # left external (starts at balcony wall)
    p.wall(W - T, 0, W, 8.60)                # right external up to terrace
    p.fill_rect(W - T, 8.60, W, D, GREY_LIGHT, stroke=1, lw=0.3)   # terrace parapet right
    p.wall(0, D - T, SX0, D)                 # rear external (left bay)
    p.fill_rect(SX1, D - T, W, D, GREY_LIGHT, stroke=1, lw=0.3)    # terrace parapet rear
    p.wall(SX0, 0, SX1, D)                   # spine
    p.wall(0, 1.40, SX0, 1.60)               # bed3 front wall
    p.wall(SX1, 0, W, T)                     # stair block front wall
    p.wall(LB0, 4.60, SX0, 4.70)             # bed3 / toilets
    p.wall(LB0, 6.10, 2.70, 6.20)            # toilet3 / toilet2
    p.wall(2.60, 4.70, 2.70, 7.60)           # toilets / store
    p.wall(LB0, 7.60, SX0, 7.70)             # toilets+store / bed2
    p.wall(RB0, 8.50, RB1, 8.60)             # lobby / terrace
    # --- openings
    p.window(1.00, 1.40, 1.80, 0.20, "h")                     # balcony sliding door (drawn as glazed)
    p.line(1.00, 1.50, 2.80, 1.50, black, 0.8)
    p.text(1.90, 1.70, "SLIDING DOOR", 4, False)
    p.window(0.0, 2.40, 1.50, 0.20, "v")                      # bed3 left
    p.door(SX0, 3.50, 0.90, 0.20, "v", -1, "hi")              # lobby -> bed3
    p.door(0.30, 4.60, 0.70, 0.10, "h", +1, "lo")             # bed3 -> toilet3
    p.window(0.0, 5.20, 0.60, 0.20, "v")                      # toilet3
    p.window(0.0, 6.60, 0.60, 0.20, "v")                      # toilet2
    p.door(0.30, 7.60, 0.70, 0.10, "h", -1, "lo")             # bed2 -> toilet2
    p.door(SX0, 5.60, 0.80, 0.20, "v", -1, "lo")              # lobby -> store
    p.door(SX0, 7.70, 0.80, 0.20, "v", -1, "lo")              # lobby -> bed2
    p.window(0.0, 8.30, 1.50, 0.20, "v")                      # bed2 left
    p.window(0.50, D - T, 1.00, 0.20, "h")                    # bed2 rear
    p.window(4.60, 0.0, 1.40, 0.20, "h")                      # stair front window
    p.window(W - T, 5.00, 1.50, 0.20, "v")                    # lobby right
    p.door(4.30, 8.50, 0.90, 0.10, "h", +1, "lo")             # lobby -> terrace
    # --- stair
    draw_stair(p, "FF")
    # --- railing
    p.railing(LB0, 0.0, LB1, 0.0); p.railing(0.0, 0.0, 0.0, 1.40); p.railing(0.0, 0.0, LB0, 0.0)
    # --- furniture
    p.chair(0.80, 0.70); p.chair(1.40, 0.70)
    p.bed(1.30, 2.70, 2.80, 4.60, "y1")
    p.rect(3.20, 1.70, 3.80, 3.30); p.text(3.50, 2.50, "WARD.", 4, False, 90)
    p.wc(1.40, 6.10 - 0.08, "-y"); p.basin(2.15, 6.10, 0.45, 0.38, "y1"); p.shower(0.20, 5.50, 1.00, 6.10)
    p.wc(1.40, 6.20 + 0.08, "+y"); p.basin(2.15, 6.20, 0.45, 0.38, "y0"); p.shower(0.20, 6.20, 1.00, 6.80)
    p.bed(1.00, 8.70, 2.50, D - T, "y1")
    p.rect(3.20, 8.70, 3.80, 10.50); p.text(3.50, 9.55, "WARD.", 4, False, 90)
    p.rect(2.75, 4.80, 3.75, 5.30); p.rect(2.75, 6.70, 3.75, 7.20)     # store shelves
    p.rect(6.00, 6.90, 6.60, 8.40); p.chair(5.60, 7.65, 0.40)          # study desk in lobby
    p.line(4.20, 9.40, 6.40, 9.40, GREY_FURN, 0.3, dash=[1, 1]); p.line(4.20, 9.90, 6.40, 9.90, GREY_FURN, 0.3, dash=[1, 1])
    p.text(5.3, 9.55, "CLOTHES LINES", 4, False)
    p.rect(6.00, 8.70, 6.60, 9.20); p.text(6.3, 8.90, "WM", 4)         # washing machine
    # --- labels
    p.label(2.0, 0.65, "BALCONY", "3.60 x 1.40")
    p.label(2.0, 2.15, "BEDROOM 3", "3.60 x 3.00")
    p.label(1.45, 5.15, "TOILET 3", "2.40 x 1.40", 5.2)
    p.label(1.45, 7.20, "TOILET 2", "2.40 x 1.40", 5.2)
    p.label(3.20, 6.90, "STORE", "1.10 x 2.90", 4.8, rot=90)
    p.label(2.0, 8.05, "BEDROOM 2", "3.60 x 2.90")
    p.label(5.3, 4.60, "LOBBY / FAMILY", "2.60 x 5.20", 5.8)
    p.text(5.3, 4.15, "(STUDY)", 4.5)
    p.label(5.3, 10.20, "UTILITY / OPEN TERRACE", "2.60 x 2.00", 4.8)
    p.text(5.3, 9.05, "OPEN TO SKY", 4)
    p.text(5.3, 1.85, "STAIR", 5.5, True)
    # --- dimensions
    p.dims("x", D + 0.25, 0, [0.20, 3.60, 0.20, 2.60, 0.20], side=+1)
    p.dims("x", D + 0.75, 0, [W], side=+1)
    p.dims("y", -0.55, 0, [1.40, 0.20, 3.00, 0.10, 1.40, 0.10, 1.40, 0.10, 2.90, 0.20], side=+1)
    p.dims("y", -1.15, 0, [D], side=+1)
    p.dims("y", W + 0.55, 0, [0.20, 3.10, 5.20, 0.10, 2.00, 0.20], side=-1)
    p.dims("y", W + 1.15, 0, [D], side=-1)


# ----------------------------------------------------------------- site plan
PW, PD = 9.70, 16.80
YARD_L, YARD_R, YARD_F, YARD_B = 1.00, 1.90, 3.00, 3.00


def draw_site(p):
    # road
    p.fill_rect(-1.5, -3.60, PW + 1.5, 0.0, ROAD_FILL, stroke=0)
    p.line(-1.5, 0, PW + 1.5, 0, black, 0.5); p.line(-1.5, -3.6, PW + 1.5, -3.6, black, 0.5)
    p.text(PW / 2, -2.0, "PRIVATE ROAD  3.60 M WIDE", 7, True)
    p.text(PW / 2, -3.0, "EAST", 6, True)
    # plot
    p.fill_rect(0, 0, PW, PD, GREEN_FILL, stroke=0)
    p.fill_rect(0, 0, YARD_L, PD, Color(0.92, 0.90, 0.85), stroke=0)          # walkway paved
    p.fill_rect(PW - YARD_R, 0, PW, PD, Color(0.92, 0.90, 0.85), stroke=0)    # service strip
    p.fill_rect(1.40, 0, 4.60, YARD_F - 0.9, Color(0.86, 0.84, 0.80), stroke=0)  # entry path
    p.rect(0, 0, PW, PD, black, 0.9)
    # building
    bx0, by0 = YARD_L, YARD_F
    p.fill_rect(bx0, by0, bx0 + W, by0 + D, Color(0.82, 0.82, 0.84), stroke=1, lw=0.7)
    p.fill_rect(bx0 + LB0, by0, bx0 + LB1, by0 + 1.40, white, stroke=1, lw=0.4)  # sit out
    p.steps(bx0 + LB0, bx0 + LB1, by0, 3)
    p.text(bx0 + W / 2, by0 + D / 2 + 0.6, "PROPOSED RESIDENCE", 7.5, True)
    p.text(bx0 + W / 2, by0 + D / 2 - 0.3, "(G + 1)", 6.5, True)
    p.text(bx0 + W / 2, by0 + D / 2 - 1.2, "6.80 x 10.80 M", 6)
    p.text(bx0 + 2.0, by0 + 0.7, "SIT OUT", 4.5)
    # gate
    p.line(1.20, 0, 4.60, 0, white, 1.2); p.line(1.20, 0, 4.60, 0, black, 0.35, dash=[1.5, 1])
    p.text(2.9, -0.55, "GATE 3.40", 4.5)
    # two wheeler parking
    for i, yy in enumerate((0.6, 2.9)):
        p.rect(PW - 1.35, yy, PW - 0.55, yy + 1.9, black, 0.4); p.circle(PW - 0.95, yy + 0.35, 0.18, black, 0.3); p.circle(PW - 0.95, yy + 1.55, 0.18, black, 0.3)
    p.text(PW - YARD_R / 2, 5.9, "TWO WHEELER", 4.5, True, 90); p.text(PW - YARD_R / 2 + 0.55, 5.9, "PARKING (1.90 M)", 4.2, False, 90)
    p.text(PW - YARD_R / 2, 11.0, "SERVICE STRIP / DRAIN", 4.2, False, 90)
    # walkway
    p.text(YARD_L / 2 + 0.1, 8.5, "PEDESTRIAN WALKWAY (1.00 M)", 4.5, True, 90)
    # rear
    p.text(PW / 2, PD - 1.2, "REAR OPEN SPACE  3.00 M", 6.5, True)
    p.text(PW / 2, PD - 1.95, "GARDEN / BIO-COMPOST / RAIN WATER PIT", 5)
    p.rect(PW - 2.6, PD - 2.4, PW - 1.6, PD - 1.4, black, 0.4); p.text(PW - 2.1, PD - 1.95, "BC", 4)
    p.text(PW / 2, 1.05, "FRONT YARD 3.00 M", 5)
    # neighbours
    p.text(-0.5, PD / 2, "BALANCE PROPERTY (SOUTH)", 5, False, 90)
    p.text(PW + 0.6, PD / 2, "BALANCE PROPERTY (NORTH)", 5, False, 90)
    p.text(PW / 2, PD + 2.4, "PROPERTY OWNED BY THOMAS AKA 'THOMMAN' (WEST)", 5)
    # dims
    p.dims("x", PD + 0.6, 0, [YARD_L, W, YARD_R], side=+1, size=5.5)
    p.dims("x", PD + 1.4, 0, [PW], side=+1, size=5.5)
    p.dims("y", -1.5, 0, [YARD_F, D, YARD_B], side=+1, size=5.5)
    p.dims("y", -2.2, 0, [PD], side=+1, size=5.5)
    p.dims("y", PW + 1.5, 0, [PD], side=-1, size=5.5)
    # north arrow (north = right of sheet, east = bottom)
    cx, cy = PW + 3.6, PD - 2.0
    p.circle(cx, cy, 1.0, black, 0.4)
    p.polyline([(cx - 0.9, cy), (cx + 0.9, cy)], black, 0.7, arrow=True)
    p.text(cx + 1.25, cy - 0.12, "N", 7, True); p.text(cx - 1.35, cy - 0.12, "S", 6, False)
    p.text(cx, cy + 1.2, "W", 6, False); p.text(cx, cy - 1.45, "E", 6, False)
    p.text(cx, cy - 2.6, "EAST FACING", 5.5, True); p.text(cx, cy - 3.2, "RESIDENCE", 5.5, True)


# ----------------------------------------------------------------- sheet furniture
def title_block(c, sheet_no, title, scale_txt):
    c.saveState()
    c.setLineWidth(0.8); c.rect(10 * mm, 10 * mm, 400 * mm, 277 * mm, stroke=1, fill=0)
    y0 = 10 * mm; h = 16 * mm
    c.setLineWidth(0.6); c.line(10 * mm, y0 + h, 410 * mm, y0 + h)
    xs = [10, 150, 250, 320, 365, 410]
    for x in xs[1:-1]: c.line(x * mm, y0, x * mm, y0 + h)
    def cell(x, w, top, body, tsize=8.5):
        c.setFont("Helvetica", 5); c.drawString((x + 2) * mm, y0 + h - 4.5 * mm, top)
        c.setFont("Helvetica-Bold", tsize); c.drawString((x + 2) * mm, y0 + 3.5 * mm, body)
    cell(10, 140, "PROJECT", "PROPOSED RESIDENCE FOR MR. HENSAL  -  RE-SY NO. 168/2-2, BLOCK 40", 8)
    c.setFont("Helvetica", 6); c.drawString(12 * mm, y0 + 8 * mm, "Thiruvaniyoor Village, Kunnathunadu Taluk, Ernakulam District, Kerala  -  Plot 4.00 cent (1.62 are)")
    cell(150, 100, "DRAWING", title, 8.5)
    cell(250, 70, "SCALE (A3)", scale_txt)
    cell(320, 45, "DATE / REV", "08-09-2026  /  v2")
    cell(365, 45, "SHEET", sheet_no)
    c.setFont("Helvetica", 5.2)
    c.drawString(12 * mm, 4.5 * mm, "Design-development drawing prepared for discussion. Not for construction. Dimensions in metres; wall thickness 0.20 external / spine, 0.10 partitions. "
                 "Structure, foundation, plumbing, electrical, septic tank, well and rules compliance (KPBR 2019) to be finalised by a licensed engineer / architect before permit submission.")
    c.restoreState()


def area_and_notes(c):
    x0, y = 205 * mm, 272 * mm
    def h(txt, size=9):
        nonlocal y; c.setFont("Helvetica-Bold", size); c.drawString(x0, y, txt); y -= 5.5 * mm
    def row(a, b, bold=False, size=6.8):
        nonlocal y; c.setFont("Helvetica-Bold" if bold else "Helvetica", size); c.drawString(x0 + 2 * mm, y, a); c.drawRightString(x0 + 195 * mm, y, b); y -= 4.2 * mm
    def para(txt, size=6.3, indent=2):
        nonlocal y
        import textwrap
        for ln in textwrap.wrap(txt, 118):
            c.setFont("Helvetica", size); c.drawString(x0 + indent * mm, y, ln); y -= 3.7 * mm
    h("AREA STATEMENT")
    rows = [
        ("Plot area (per plot sketch, Re-Sy 168/2-2)", "4.00 cent = 161.87 sq m (1.62 are)"),
        ("Plot dimensions (nominal)", "9.70 m (N-S) x 16.80 m (E-W)"),
        ("Ground floor plinth area 6.80 x 10.80 (incl. sit out 5.04)", "73.44 sq m  (790 sq ft)"),
        ("First floor gross 6.80 x 10.80", "73.44 sq m  (790 sq ft)"),
        ("  less open-to-sky utility terrace 2.60 x 2.00", "- 5.20 sq m"),
        ("First floor built-up (incl. balcony 5.04)", "68.24 sq m  (734 sq ft)"),
        ("TOTAL BUILT-UP AREA", "141.68 sq m  (1,525 sq ft)"),
        ("Plot coverage 73.44 / 161.87", "45.4 %"),
        ("Floor area ratio 141.68 / 161.87", "0.88"),
        ("Open yards: front (E) / rear (W) / side (S) / side (N)", "3.00 / 3.00 / 1.00 / 1.90 m"),
    ]
    for i, (a, b) in enumerate(rows):
        row(a, b, bold=(i == 6))
    y -= 2 * mm
    h("ROOM SCHEDULE (clear internal sizes, m)")
    gf = [("Sit out", "3.60 x 1.40"), ("Living", "3.60 x 3.30"), ("Dining (open to living)", "3.60 x 2.60"), ("Bedroom 1", "3.60 x 3.00"),
          ("Toilet 1 (attached, bed 1)", "2.60 x 1.50"), ("Kitchen", "2.60 x 3.00"), ("Work area", "2.60 x 1.40"), ("Passage / wash", "2.60 x 1.10"), ("Stair (dog-leg)", "2.60 x 3.10")]
    ff = [("Balcony", "3.60 x 1.40"), ("Bedroom 3", "3.60 x 3.00"), ("Toilet 3 (attached, bed 3)", "2.40 x 1.40"), ("Toilet 2 (attached, bed 2)", "2.40 x 1.40"),
          ("Store / linen", "1.10 x 2.90"), ("Bedroom 2", "3.60 x 2.90"), ("Lobby / family / study", "2.60 x 5.20"), ("Utility / open terrace", "2.60 x 2.00")]
    c.setFont("Helvetica-Bold", 6.8); c.drawString(x0 + 2 * mm, y, "GROUND FLOOR"); c.drawString(x0 + 100 * mm, y, "FIRST FLOOR"); y -= 4.2 * mm
    yy = y
    for a, b in gf:
        c.setFont("Helvetica", 6.5); c.drawString(x0 + 2 * mm, yy, a); c.drawRightString(x0 + 92 * mm, yy, b); yy -= 3.9 * mm
    yy2 = y
    for a, b in ff:
        c.setFont("Helvetica", 6.5); c.drawString(x0 + 100 * mm, yy2, a); c.drawRightString(x0 + 195 * mm, yy2, b); yy2 -= 3.9 * mm
    y = min(yy, yy2) - 2 * mm
    h("DESIGN NOTES")
    notes = [
        "1. Orientation: east-facing plot; private road (3.60 m) on the east. Drawings are drawn with east at the bottom, north to the right (see north arrow).",
        "2. Layout follows the updated brief: 3 bedrooms (1 ground + 2 first), ground bedroom with attached toilet, front sit out with balcony over, work area behind kitchen, "
        "rear utility / open terrace at first floor, and an internal dog-leg stair replacing the external terrace stair. No stair to the roof is provided.",
        "3. Structure: load-bearing external walls and central spine wall 0.20 m (laterite / solid block); 0.10 m partitions; RCC roof and floor slabs; floor-to-floor 3.00 m.",
        "4. Stair: 2 flights of 9 risers, riser 167 mm, tread 250 mm, flight width 1.25 m, mid landing 1.10 m. Headroom under first-floor slab to be checked (min 2.10 m).",
        "5. Room sizes changed from the concept sheet: the concept listed 58.5 sq m per floor, which cannot hold the rooms it names. This set is the true size (about 73 sq m per floor). "
        "Reducing to 630 sq ft per floor would need dropping the dining or a toilet.",
        "6. Setbacks used: front 3.00, rear 3.00 (garden / bio-compost as requested), south 1.00, north 1.90. The concept's 0.90 m walkway is below the usual 1.00 m side-yard minimum, so 1.00 m is used.",
        "7. Parking: with a 3.00 m front yard there is no room for a car anywhere on the plot; the plan provides two-wheeler parking only, as in the brief.",
        "8. Not shown: sunshades, septic tank / soak pit, well, rain-water harvesting tank, drains, electrical and plumbing. These affect yard use and must be located on site before permit.",
    ]
    for n in notes: para(n); y -= 1.2 * mm


def sheet1(c):
    title_block(c, "1 / 2", "SITE PLAN, AREA STATEMENT & NOTES", "1 : 100")
    c.setFont("Helvetica-Bold", 11); c.drawString(40 * mm, 278 * mm, "SITE PLAN  (4.00 CENT)   SCALE 1 : 100")
    site = Plan(c, 45, 65, 10)
    draw_site(site)
    area_and_notes(c)


def sheet2(c):
    title_block(c, "2 / 2", "GROUND & FIRST FLOOR PLANS", "1 : 50")
    gf = Plan(c, 48, 46, 20); draw_ground(gf)
    ff = Plan(c, 252, 46, 20); draw_first(ff)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString((48 + 68) * mm, 283.5 * mm, "GROUND FLOOR PLAN   SCALE 1 : 50")
    c.drawCentredString((252 + 68) * mm, 283.5 * mm, "FIRST FLOOR PLAN   SCALE 1 : 50")
    c.setFont("Helvetica", 6.2)
    c.drawString(196 * mm, 72 * mm, "GF plinth area 73.44 sq m (790 sq ft)")
    c.drawString(196 * mm, 68 * mm, "FF built-up 68.24 sq m (734 sq ft),")
    c.drawString(196 * mm, 64.5 * mm, "excl. open terrace 5.20 sq m")
    # legend
    lx, ly = 196 * mm, 26 * mm
    c.setFont("Helvetica-Bold", 6.5); c.drawString(lx, ly + 23 * mm, "LEGEND")
    c.setFillColor(GREY_WALL); c.rect(lx, ly + 18 * mm, 6 * mm, 3 * mm, stroke=0, fill=1); c.setFillColor(black)
    c.setFont("Helvetica", 5.5); c.drawString(lx + 8 * mm, ly + 18.5 * mm, "Masonry wall")
    c.setFillColor(GREY_LIGHT); c.rect(lx, ly + 13 * mm, 6 * mm, 3 * mm, stroke=1, fill=1); c.setFillColor(black)
    c.drawString(lx + 8 * mm, ly + 13.5 * mm, "Parapet 0.90 m high")
    c.setFillColor(GREY_FILL); c.rect(lx, ly + 8 * mm, 6 * mm, 3 * mm, stroke=1, fill=1); c.setFillColor(black)
    c.drawString(lx + 8 * mm, ly + 8.5 * mm, "Covered, open-sided")
    c.setFillColor(GREEN_FILL); c.rect(lx, ly + 3 * mm, 6 * mm, 3 * mm, stroke=1, fill=1); c.setFillColor(black)
    c.drawString(lx + 8 * mm, ly + 3.5 * mm, "Open to sky")
    c.drawString(lx, ly + 33 * mm, "Dimensions in metres;")
    c.drawString(lx, ly + 29.5 * mm, "east at bottom, north to right")


def main():
    c = canvas.Canvas(OUT, pagesize=PAGE)
    c.setTitle("Hensal Residence - Plan Set v2"); c.setAuthor("Prepared with Claude Code")
    sheet1(c); c.showPage(); sheet2(c); c.showPage(); c.save()
    print("wrote", OUT)
    # single-sheet copies for previews
    base = os.path.dirname(OUT)
    for name, fn in (("preview_sheet1.pdf", sheet1), ("preview_sheet2.pdf", sheet2)):
        cc = canvas.Canvas(os.path.join(base, ".previews", name), pagesize=PAGE); fn(cc); cc.showPage(); cc.save()


if __name__ == "__main__":
    main()

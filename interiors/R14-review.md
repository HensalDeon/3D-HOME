# R14 under-stair joinery — approved interior direction

Visually approved by the user on 14 September 2026.

Open [the review page](R14-review.html) for the living-room view, joinery close-up and isolated geometry inspection.

R14 places the TV unit beneath the lower flight: a 2.25 m long, 350 mm deep cabinet with a 450 mm top, a 30 mm oak backing following the measured stair underside, and small open shelves. The 960 × 540 mm screen has its centre 870 mm above finished floor. The stair, retained header and basin geometry stay as modeled in R13. The backing is sampled against the existing stair meshes, with at least 60 mm vertical clearance in the dedicated checks.

The two eye-level renders retain the actual room walls, header and first-floor slab. All four TV corners are unobstructed from both cameras. The third image isolates the geometry and outlines the header; part of the screen is obscured from that elevated inspection camera. It must not be presented as a full-height wall opening or normal room view.

Verification on 14 September 2026:

- `npm test` in `model/`: 23 existing checks passed; these check the coordinated R13 data and architecture.
- `node --test model/scripts/r14-preview.test.mjs`: 2 dedicated R14 geometry checks passed.
- `node model/scripts/r14-reference-render.mjs`: three views generated; both eye-level screen visibility checks passed. Requires the model dev server on port 5173, or `DEV_SERVER` set to its URL.
- Reproducible camera and visibility results: `model/qa/R14-visual-audit.json` (project-relative).

After regenerating the images, run `node model/scripts/r14-review-page.mjs` to rebuild the self-contained review page. It embeds all three renders for offline use and the desktop Preview tab.

The development model currently displays R14 joinery, while the published PDF, layout data and standalone explorer remain R13. This page completes the visual review package; it does not promote the study into the coordinated plan set. Model clearance checks do not establish fabrication or structural design.

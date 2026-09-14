# Required preservation fixtures

These three baseline files are inputs to `scripts/revision.test.mjs`, not alternative deliverables:

- `r2-architecture.json` records wall, opening, room and stair coordinates used to detect unintended architectural changes.
- `baseline-v4/geometry.js` supplies the original geometry functions for comparisons.
- `baseline-v4/plan-data.json` is imported by those baseline geometry functions.

The duplicate baseline application, standalone HTML and superseded stair-review sheet have been removed. Keep these fixtures while the preservation tests import them.

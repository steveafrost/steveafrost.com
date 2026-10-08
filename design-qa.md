# Featurette viewport layout preview QA

Final result: blocked pending permitted cloud rendered QA. No local browser used.

All fifteen featurettes reuse the shared fixed glass header. Their hero starts at document top under the overlay; scoped main padding override removes header space. Hero uses 100vh/100svh/100dvh and grid layout; mobile image, title/subtitle/story CTA and three-column related links share the viewport. Short mobile landscape uses two columns. Related links have one common grid row, equal-width cells and centered text. Removed legacy global 860px/fixed-image/440px-copy offsets and component 900px hero minimum.

80 tests pass; 83 Astro pages build; all 99 HTML routes retained. Mobile menu and sticky-glass JS plus curated project records/selection are byte-identical to production1b8e602. Production CSS change removes only obsolete project sizing rules; cache token updated. No changes to project copy, artwork or selected order.

Library screenshot libfile_3a45f21b415881919c5fc5ed369f11df resolved as image(20261008-181837).png. Current Library materialization helper returned HTTP403; no local readable file exists, and permission failure was not bypassed. Parent successfully viewed it and reported the header spacer and CTA clipping. Implementation is grounded in explicit text requirements and source; no local pixel comparison claimed.

Cloud QA must check hero top0, height equal visible viewport, title/subtitle/CTA fully visible and not beneath header, related link cell centers on one horizontal line, no horizontal overflow, day/night, portrait and landscape. No production deployment authorized for this candidate.

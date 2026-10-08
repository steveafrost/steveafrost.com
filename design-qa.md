# Mobile menu glass-flash candidate QA

Final result: blocked pending cloud rendered QA. No local browser used.

Baseline: production repository main 8703e7656d493962705ba2d5d4957201a5b69abd, exact live mobile-menu.js bytes confirmed over HTTPS. Curated feature selection 46ef796 is not included.

Supported source observation: header clip-path animation surrounds a backdrop-filtered ::before glass layer; open state simultaneously switches mobile blur 2px to 14px. Filter Effects Level 2 draft lists clip-path as a backdrop-root trigger. This supports the compositing hypothesis but does not establish the browser-specific cause of the reported flash; the draft itself notes lack of consensus on backdrop-root definition.

Candidate: animate border-box header height instead of clip-path. Existing overflow:hidden and 28px border radius retain rounded reveal. Header opacity, transform, background and backdrop CSS unchanged. Content translate/fade, 280ms open/180ms close, computed-frame reversal, generation guard, inert/aria-hidden, native hidden finish, reduced-motion, lifecycle and failed-WAAPI fallback preserved. Mobile disables SVG lens eligibility through the existing responsive/preference guard; desktop retains lens eligibility. Mobile uses the same 14px CSS-glass filter while closed/open, avoiding the SVG-to-CSS and blur-size switch. Light/night tint and accessibility fallbacks unchanged. Three cache tokens updated.

57 tests pass; 83 pages build. All 99 HTML route bytes match baseline after normalizing three cache tokens. Artwork and unrelated public assets unchanged; only menu JS, sticky-glass JS and the mobile glass selector differ. No root-cause, visual fix or performance pass claimed. Height animation may perform layout each frame; check on the affected browser/theme and during rapid toggles. Cloud organization policy blocks DevTools, so do not bypass it; use only permitted rendered checks. No publication, deployment or push performed.

Cloud worker source observation confirms lens-ready on closed header and its removal around 276px expansion; one-frame flash was not captured. DevTools blocked by cloud organization policy; no bypass attempted. Candidate needs permitted cloud rendered/theme/device checks. Stable 14px mobile blur is stronger than previous closed 2px lens treatment, a reviewable visual tradeoff.

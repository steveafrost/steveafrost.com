# Approved full-bleed redesign publication QA

final result: passed

Source baseline: 9b3786dd690595a7f0ce20acb95b536083c43da9. Original separate previews preserved. Publication authorized by Steve: “Use the approved full-bleed header and publish the redesign to steveafrost.com.”

Original full-bleed river artwork and postcards retained. Selected Fraunces headline, Space Grotesk name, full-word coral underline below italic y, and scene-sampling glass header implemented. No external font CDN. Glass is a web approximation with CSS fallback.

Desktop 1487×1058 and mobile 390×844, day/night: four final captures inspected. Sixteen responsive/theme/route states passed. Keyboard Enter/Space, synchronized theme controls, paused clock preservation, reduced motion, 44px control targets, no horizontal overflow, and empty application error log passed. Widths 320/768/1920 checked. GPU readback verified luminance limits for readable controls; reduced transparency, increased contrast and context-loss fallbacks passed. Whole-word underline clearance and mobile spacing inspected in focused comparison.

Production build: 80 routes. git diff --check passed. river.js, theme.js, Knight School policy, articles page and project feature component byte-identical to baseline. Evidence: ../header-liquid-qa/browser-evidence.json, optics-evidence.json, final-capture-evidence.json, preservation.json, publication-build.log. Previous production deployment retained for rollback: dpl_SXzcoxGQvc6P7uyukLawGd8Mz2oi.

Apple guidance consulted: https://developer.apple.com/design/human-interface-guidelines/materials and https://developer.apple.com/videos/play/wwdc2025/219/ . Floating navigation, lensing/highlights, background luminosity adaptation and accessibility preferences inform this browser implementation.

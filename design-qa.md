# River’s Edge footer candidate

final result: blocked

Source visual truth: Library libfile_e2c58d18f45081918bc84650d4527087,
file_0000000021fc81f6b3568eaae49b5004, version 0. Materialized through the supported
Library helper and actually opened at
/Users/white-box/Documents/Codex/2026-10-02/task-4/footer-reference/rivers-edge.png.
Source dimensions: 1487×1058. Readable bytes: 1,780,024; SHA256
68c1bce8a0d2089f91641349ef2dccc30cd974eb1efea0edda73bb4ee44bcbfd.

Implementation screenshot, viewport, pixel dimensions, density normalization,
full-view comparison and focused comparison: pending parent cloud browser.
No browser was launched on Steve’s Mac. No CPU image is claimed as a screenshot.
Compare desktop light/dark and narrow light/dark. The reference’s surrounding
article content is contextual and is not copied into the implementation.

## Findings

- [Gate] Browser-rendered capture and visual comparison are unavailable locally.
  Passing build/tests and inspecting assets do not establish design fidelity.
- New Astro footer uses existing Fraunces/Space Grotesk fonts and arrow/theme
  icons, plus inspected generated raster artwork. The water is a narrow ribbon;
  no full scene, custom SVG/CSS drawing, or animation was added.
- Cached-Back candidate and the deployed Home sky extension remain separate.

## Required fidelity surfaces and implementation checklist

- Typography: compare name’s Fraunces weight/optical feel, link size, tagline and
  metadata wrapping at 320/390/500/1440px. Browser wrapping remains unverified.
- Spacing/layout: compare shallow wave, identity, desktop right link column,
  stacked mobile links, meta divider and 56/64px water ribbon; check x-overflow.
- Colors/tokens: mint/day and teal/night art, text contrast, accent arrows and
  current-state theme labels; night follows the existing root appearance.
- Image quality: generated day/night PNG pixels were opened. Check browser WebP
  crop, alpha boundary/halos, paper seams, foliage scale and ribbon quality.
- Copy: Steve Frost; Useful things made with curiosity.; More work; GitHub;
  Ann Arbor, Michigan; Light mode/Night mode. Keep actual page content unchanged.
- Interactions: /, /projects, GitHub; keyboard/focus; footer toggle -> header and
  stored state; Home/About/Work/Kindle/article/return and Back/Forward.
- Both themes, short/long pages, reduced motion, console/network health.
- Preserve Home portrait cover/landscape auto and Work’s existing full river scene.

## Comparison history

Source inspected; assets generated and inspected; candidate built/tested.
No rendered iteration yet. No visual P0/P1/P2 finding or pass is claimed from
source inspection. Put source and cloud screenshot in one normalized comparison
input before deciding fidelity or applying visual fixes.

## Follow-up polish

Assess after rendered comparison; avoid speculative P3 iteration.

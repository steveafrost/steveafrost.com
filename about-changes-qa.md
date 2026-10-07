# Shared navigation and About scene checkpoint

## Scope and provenance

Based on published Projects e224b53e898fc1c1691570dd56f7df9db6c4b2c5. Navigation checkpoint ae3829e1d493a10eb1c8ea5731ac142c12e68f1e is saved to fix/about-navigation-parity. This working branch is not production approval.

Viewed actual supplied screenshots: navigation libfile_fd675773a2a88191b984e7fd159cb586, cyclist libfile_77999d6623588191b5be344666522103, workbench libfile_776438830b7c81919ca330162333e5c8. Also viewed unchanged winding-story.webp and a CPU raster review of the actual Pixi GraphicsContext geometry.

## Navigation

Cause: compact glass CSS and lens setup were homepage-only; About additionally forced transparent masthead styling. Shared glass-navigation class now selects the same header declarations and progressive lens setup on Home, About, Projects and Writing. Inner pages reserve112px desktop/152px mobile; About preserves original scene origin and adds112/156px tablet/mobile content padding. Existing self-hosted fonts, compact32px visible theme control with44px target, day/night fallback, preference styles and active links are retained. No project or article content changes.

## About rendering and constraints

Reuses existing pinned PixiJS8.22.0 WebGL/Graphics subset bundle and license. No new dependency or independent Pixi ticker. One transparent670x320 canvas at illustration coordinates170,350. Existing1122x1402 raster and bridge remain unchanged. Cyclist wheel center normal offsets touch calibrated cubic deck; front contact is solved for rigid42px wheelbase. Each wheel rotates by its own arc travel/radius; crank ratio0.38 and7.2px crank radius, opposite pedals, two-link knees/elbow, hands/feet attached. Critically damped bounded rider lean follows grade. No claim that Pixi itself provides a physics engine or that this is a full dynamics simulation.

One original-style steam ribbon uses32 prebuilt curling GraphicsContexts; subtle line/cursor alpha changes preserve baked screen text. A29x41 background repair replaces baked steam while animated; reduced-motion fallback retains the original single static shape. Geometry is allocated once. One master RAF is capped at30 rendered updates/sec; elapsed steps bounded to100ms. Lazy import/init only when a zone is visible on desktop and motion is permitted. Pause, tab visibility, per-zone intersections, reduced motion, narrow layout, bfcache and disposal are handled. WebGL failures stop motion; the original artwork remains. Actual GPU performance is unmeasured.

## Official skills installed

Source https://github.com/pixijs/pixijs-skills pinned83760c6f53462ca9cecd68055041f5a8c94758ce. Checked both user skill roots; no installed Pixi skill duplicates existed. Installed via preinstalled skill-installer/scripts/install-skill-from-github.py into /Users/white-box/.codex/skills/: pixijs, pixijs-core-concepts, pixijs-scene-graphics, pixijs-performance, pixijs-ticker. Existing Pixi dependency bundled skill files were reference copies, not installed user skills. Applicable official instructions read and applied.

## Validation

PASS npm ci --no-audit --no-fund --prefer-offline.
PASS NODE_OPTIONS=--max-old-space-size=2048 npm run build:80 pages; latest build1.02s, exit0; log /tmp/about-rising-steam-nav-build.log.
PASS node --test tests/about-scene.test.mjs:10 tests,0 failures. Tests cover3261 deck contacts/rigid poses, wheel arc travel,2163 rider crank/lean combinations, loop fades, stable inertia, steam bounds, mocked single-loop scheduling and lifecycle controls, real Pixi retained scene graph/context reuse and bounded limb geometry using an injected renderer without GPU/browser.
PASS generated Home/About/Projects/Writing HTML glass header, active-page link, enhancement script.
PASS unchanged index.astro, projects.astro, articles.astro, shared project data and original About raster compared with e224b53.
PASS git diff --check and JS syntax checks.

## Review and limits

Review image outside source: ../about-motion-qa/scene-model-review.png, frame13s. It exports actual Pixi GraphicsContext paths through the official SVG exporter and rasterizes via Sharp. This is a CPU model/scene-graph review image, not a browser screenshot or proof of WebGL rendering.

Browser visual/interaction QA: blocked by user prohibition of website browsers on Mr Chips, with no permitted cloud browser callable. No rendered screenshot, computed style, console, focus/keyboard runtime, actual frame rate or GPU pass claimed. Desktop/mobile CSS and theme coverage are source/generated-output checks. Reviewed checkpoint dafb362 was approved and deployed; the upward-steam/nav-gap follow-up remains review-only.

## User-reviewed motion revision

User reports prior cyclist approximately3displaypx too low, pedalling unreadable, steam too subtle. This visual feedback overrides the prior nominal curve checks. Corrected deck reference from634 to632.35 and wheel contact radius from10 to10.85 to include centered tire stroke. Combined center lift is approximately2.5referencepx,3.2CSSpx at1440px scene width (2.45px at1100px); it scales with the illustration, not device pixel ratio. Wheel outer edges now contact the corrected deck. Calibration still requires user/browser review.

Confirmed source cause for unreadable articulation: travel geared by2.4 produced a crank turn in approximately10seconds, with5px pedal radius. Changed geared ratio to0.38 for approximately38rpm and7.2px radius; connected joints remain constrained. Added small phase-dependent shoulder response and a wheel rim marker. Actual retained Pixi crank/wheel/limb transforms are tested across frames. No stuck transform or dependency version discrepancy was found; browser-specific behavior remains unverified. Versioned entry and module URLs prevent reuse of prior animation code.

Steam rise now48referencepx, path height23px, enlarged1.05..1.6scale,5.5px cream core/8px muted outline,9px drift, curling/sway and0.9peak alpha (was0.22). Six preallocated wisps; no filters, new timers or tickers. Screen text remains unchanged.

Official pixijs, pixijs-scene-graphics, pixijs-ticker and pixijs-performance installed SKILL.md files verified byte-for-byte against pinned official source83760c6f53462ca9cecd68055041f5a8c94758ce and reread for this revision; no duplicate install performed.

Review artifacts outside repository: revised-scene-motion.gif (four seconds,32frames at8fps) and revised-scene-sequence.png (four frames). Exported actual retained Pixi GraphicsContext paths through official SVG exporter and Sharp; not a browser/GPU recording. Sequence pixels actually viewed. Tests additionally cover corrected displayed registration, readable cadence, increased plume bounds and actual changing scene graph transforms. Production remains untouched.

## Full-path contact and single-steam correction

Viewed user screenshot libfile_3c4da001bff48191a018339ca295abd9. It exposes the prior quadratic road diverging from the almost-level right-hand crest during fade-out. Opacity did not move the bike; the road calibration was wrong at the exit. Replaced it with a cubic fit that follows the visible left rise and right plateau. Normal-offset wheel contact and rigid wheelbase continue through every fading pose. Rear contact is bounded to the crossing; front contact stays inside the visible190..580 span. Wheel travel uses fixed eight-point quadrature plus normal-offset curvature contribution. No road extrapolation at the visible exit.

Added340 late-phase samples21.3..23seconds covering tire contact, rigid frame, smoothness, decreasing opacity, visible crest height and bounds; fully hidden after23seconds. Previous tests still cover the complete crossing and rolling phase. Actual exported fade frames20.5,21.5,22.25,22.875seconds were viewed.

Duplicate steam came from winding-story.webp itself. A local29x41 inpainted repair at565,392 covers only the baked plume, conditional on data-steam=animated. Original full illustration remains byte-identical. Repair source ImageGen exec-b6e64b0b-fc21-47d8-9fd3-13dc8e6a32d7.png generated from actual steam crop; native edited image viewed before extracting repair. The original cup/scene remain unchanged outside that local overlay. One cream0xf7eedb filled S ribbon matches the original plume silhouette and taper. Thirty-two prebuilt contexts move the curl upward while the base stays on the cup; no per-frame path reconstruction, extra ticker or filter. Manual pause freezes this single replacement. Reduced motion, narrow layout and renderer failure hide the animated overlay and expose only the original steam. Lifecycle tests verify this switching.

Revision module version bridge-steam-3. Review artifacts: exit-steam-motion.gif (four seconds/32 frames) and exit-steam-sequence.png (four late-crossing frames). Actual Pixi GraphicsContext geometry exported and CPU-rasterized over the original illustration plus the same repair overlay; not browser/WebGL screenshots or runtime proof. No website browser launched. No production deployment performed.

## Approved production checkpoint and separate follow-up

User explicitly approved reviewed dafb362558fd6fe40267d236abb97078714d3148, then requested an upward-steam follow-up. Fast-forwarded remote main from e224b53 to exactly dafb362; no unrelated newer commits existed. Production deployment dpl_7NZ19XSbpqDmuFg1Jokqgj4LmDoW READY, steveafrost.com assigned without alias error. Actual production About HTML, reviewed scene model and steam repair asset fetched over HTTPS and byte-matched. Production URL https://steveafrost.com/about/. This approval does not cover this new follow-up.

Replaced whole-ribbon deformation with upward parcel advection. Ten preallocated Graphics objects share one small cream S-contour GraphicsContext, composing a single steam layer over the existing baked-steam repair. Each parcel has3.6second lifetime,9.5referencepx/sec upward velocity, horizontal displacement below2.2px, age-based horizontal/vertical expansion and fading opacity. Particles reappear at the cup only withzero opacity; modulo boundary is snapped within1e-9seconds to avoid floating point re-birth ambiguity. No shape recomputation, extra canvas, ticker, filters or dependency. One existing30fps visibility/pause driver and static reduced-motion fallback are preserved. Steam mode version rising-steam-4. Original scene, cyclist constraints, screen effect and content unchanged.

User also requested nav top gap halved on all pages. Shared floating-header desktop24->12px, mobile16->8px, with max(8px,env(safe-area-inset-top)) preserving the full safe area. Existing64px desktop bar height, internal10/12px vertical padding, fonts, toggles and day/night style declarations remain identical. Desktop content/scroll clearance112->100px; mobile152->144px plus any safe-area excess; About mobile156->148px plus safe-area excess. All68 routes using the shared portfolio header checked in generated output; four index routes use floating glass navigation. Other shared static headers have zero top gap, preserved; standalone Knight School and project mock HTML use separate navigation and are unchanged. CSS normalized only for intended gap/clearance values matches the reviewed baseline byte-for-byte, confirming no typography/theme/bar-dimension change.

Validation:10 Node tests passed, including per-parcel monotonic upward movement, age expansion, fading, limited sideways drift and invisible rebirth; prior cyclist fade contact/articulation and scheduling tests pass. Bounded production build80pages/1.02s, exit0. Generated header/active-link checks pass, safe-area reservations modeled for0/20/44px. Home/Projects/Writing source, shared layout/project data and original full raster byte-identical to dafb362. git diff --check and JS syntax pass. Review artifacts rising-steam-motion.gif, rising-steam-detail.gif and rising-steam-sequence.png are CPU exports of actual retained Pixi geometry; sequence inspected, no browser/WebGL or frame-rate verification claimed. Follow-up awaits user review; production remains dafb362.

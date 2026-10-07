# Shared navigation and About scene checkpoint

## Scope and provenance

Based on published Projects e224b53e898fc1c1691570dd56f7df9db6c4b2c5. Navigation checkpoint ae3829e1d493a10eb1c8ea5731ac142c12e68f1e is saved to fix/about-navigation-parity. This working branch is not production approval.

Viewed actual supplied screenshots: navigation libfile_fd675773a2a88191b984e7fd159cb586, cyclist libfile_77999d6623588191b5be344666522103, workbench libfile_776438830b7c81919ca330162333e5c8. Also viewed unchanged winding-story.webp and a CPU raster review of the actual Pixi GraphicsContext geometry.

## Navigation

Cause: compact glass CSS and lens setup were homepage-only; About additionally forced transparent masthead styling. Shared glass-navigation class now selects the same header declarations and progressive lens setup on Home, About, Projects and Writing. Inner pages reserve112px desktop/152px mobile; About preserves original scene origin and adds112/156px tablet/mobile content padding. Existing self-hosted fonts, compact32px visible theme control with44px target, day/night fallback, preference styles and active links are retained. No project or article content changes.

## About rendering and constraints

Reuses existing pinned PixiJS8.22.0 WebGL/Graphics subset bundle and license. No new dependency or independent Pixi ticker. One transparent670x320 canvas at illustration coordinates170,350. Existing1122x1402 raster and bridge remain unchanged. Cyclist wheel center normal offsets touch calibrated quadratic deck; front contact is solved for rigid42px wheelbase. Each wheel rotates by its own arc travel/radius; crank ratio2.4, opposite pedals, two-link knees/elbow, hands/feet attached. Critically damped bounded rider lean follows grade. No claim that Pixi itself provides a physics engine or that this is a full dynamics simulation.

Six pooled steam paths rise/curl/fade; subtle line/cursor alpha changes preserve baked screen text. Geometry is allocated once. One master RAF is capped at30 rendered updates/sec; elapsed steps bounded to100ms. Lazy import/init only when a zone is visible on desktop and motion is permitted. Pause, tab visibility, per-zone intersections, reduced motion, narrow layout, bfcache and disposal are handled. WebGL failures stop motion; the original artwork remains. Actual GPU performance is unmeasured.

## Official skills installed

Source https://github.com/pixijs/pixijs-skills pinned83760c6f53462ca9cecd68055041f5a8c94758ce. Checked both user skill roots; no installed Pixi skill duplicates existed. Installed via preinstalled skill-installer/scripts/install-skill-from-github.py into /Users/white-box/.codex/skills/: pixijs, pixijs-core-concepts, pixijs-scene-graphics, pixijs-performance, pixijs-ticker. Existing Pixi dependency bundled skill files were reference copies, not installed user skills. Applicable official instructions read and applied.

## Validation

PASS npm ci --no-audit --no-fund --prefer-offline.
PASS NODE_OPTIONS=--max-old-space-size=2048 npm run build:80 pages; latest build963ms, exit0; log /tmp/about-scene-build.log.
PASS node --test tests/about-scene.test.mjs:5 tests,0 failures. Tests cover3261 deck contacts/rigid poses, wheel arc travel,2163 rider crank/lean combinations, loop fades, stable inertia, steam bounds, mocked single-loop scheduling and lifecycle controls, real Pixi retained scene graph/context reuse and bounded limb geometry using an injected renderer without GPU/browser.
PASS generated Home/About/Projects/Writing HTML glass header, active-page link, enhancement script.
PASS unchanged index.astro, projects.astro, articles.astro, shared project data and original About raster compared with e224b53.
PASS git diff --check and JS syntax checks.

## Review and limits

Review image outside source: ../about-motion-qa/scene-model-review.png, frame13s. It exports actual Pixi GraphicsContext paths through the official SVG exporter and rasterizes via Sharp. This is a CPU model/scene-graph review image, not a browser screenshot or proof of WebGL rendering.

Browser visual/interaction QA: blocked by user prohibition of website browsers on Mr Chips, with no permitted cloud browser callable. No rendered screenshot, computed style, console, focus/keyboard runtime, actual frame rate or GPU pass claimed. Desktop/mobile CSS and theme coverage are source/generated-output checks. No new production deployment authorized or performed for these changes.

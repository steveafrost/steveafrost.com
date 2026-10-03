# Left river square correction

final result: passed

Source evidence: Steve’s marked screenshot libfile_bea8e53b2890819188badcd0fd62a7fb (file_0000000059bc81fb927e01e8c21e3258), locally materialized at ../left-artifact-qa/user-reference/AD1FFC0D-AC21-4869-80AA-DD30FAEC63D9.jpeg and inspected. The mark indicates water below the bridge near the foreground plant, not a lamp repair region. User confirmed visible playing and paused.

Diagnosis: the original mask uses a hard rectangular foreground exclusion. Animated sampling and output blending propagated that sharp mask edge into the water, making a small block of mismatched reflection. Pausing retains the current shader phase, so the artifact also remained paused. Browser reproduction at shader times 3 and 9 seconds matches the marked square; times 0/6 show the static scene without it.

Fix: derived river-boundary-mask.png retains original red and green channels byte-for-byte. Its blue channel feathers only source x930–1140, y530–724 around that plant guard, with a conservative safety ramp that stays zero on excluded foreground pixels. Shader water and source-sampling safety use blue. River period, direction, travel, line waves, artwork, lamps and Projects & Learnings remain unchanged. Original mask/art assets retained. Browser script cache version updated.

Visual evidence: ../left-artifact-qa/before-after-phases.png shows before top / after bottom at 0,3,6,9 seconds. ../left-artifact-qa/four-state-phases.png shows mobile day, mobile night, desktop day, desktop night (rows), at 1.5,3,4.5,9 seconds (columns). Reviewed actual browser renders; the rectangular water seam is absent, foreground remains stable, approved main current continues. Full captures playing-{desktop,mobile}-{day,night}.png preserve layout/theme/tagline. Desktop viewport 1487×1058, mobile 390×844; controlled shader samples also at 0,6,7.5,10.5,12 seconds cover wrap points. These phase captures are deliberate developer reproduction while paused; real playing and pause/theme persistence also separately tested.

Focused checks: pause clock stable; changing theme while paused retains clock; resuming advances clock in all four device/theme combinations. WebGL ready=true; no browser page errors. Local analytics endpoint logs only because static local server does not implement Vercel analytics. Build succeeds, 68 routes; JS syntax and git diff checks pass. Fonts, layout, palette and copy retain the approved design. No new interactive features or art changes. No actionable P0/P1/P2 issues or further polish changes.

Browser availability: in-app CUA tools absent from current inventory. Installed official agent-browser CLI used via supported Vercel agent-browser skill. Initial sandbox socket/server operations were restricted; approved execution succeeded. No automatic-review rejection occurred.

Rollback source: 3b65ca31a51d54666ca42b994eae12da60e218b4 / deployment dpl_GLddv4fCqRiuepJWnz57nnwGtSsz.

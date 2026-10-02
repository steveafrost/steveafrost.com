# Focused lamp and motion control QA

final result: passed

Source: approved production commit d7ee67cbb965c7a0acd90fe5c9daebd8e8560bf7, ../correction-qa/live-day-desktop.jpg and live-night-desktop.jpg; Steve’s request for a small white pause icon and identical day/night fixtures. Native shared fixture public/river-assets/day-lamp.png.

Implementation: ../lamp-control-qa/local-{day,night}-{desktop,mobile}.png. Desktop requested viewport 1487×1058, captured 1472×1047; mobile requested 390×844, captured 375×833; same browser/density in each theme. Full view comparison ../lamp-control-qa/day-before-after.png and night-before-after.png, two equal-scale panels. Focused evidence ../lamp-control-qa/six-lamps-final.png: six actual viewport crops, daylight top and night bottom, enlarged 5× with nearest-neighbor for inspection.

Earlier P2: night used different baked fixtures; original daylight globes also remained beneath the newly added lamps. Fixed by native image repair clipped to six small source regions in both themes. All six fixtures now use precisely the same native sprite, dimensions, position, globe, stem, base and material; only night drop-shadow illumination differs. The cropped comparisons confirm no doubled fixtures or remaining alternative silhouette. Surrounding tiny patch texture differences are P3 at magnification and not visible at normal viewport size.

Fonts/typography: existing self-hosted Inter and Georgia, weights, wrapping and hierarchy unchanged. Spacing/layout: header crop, introduction and postcards unchanged; white icon is 18×18 in a transparent 44×44 target. Colors: existing day/night palette unchanged; white icon has dark contrast shadow and visible keyboard focus ring. Image fidelity: original full scene assets and motion mask byte-identical; native raster repair appears only behind lamps. Copy/content: navigation, articles, projects and labels retained; accessible control changes Pause motion / Resume motion / Motion off. No content/auth/avatar changes.

Interactions: keyboard Space pauses; Enter resumes; theme changes preserve paused clock (0.30000000000000004 before/after). Reduced-motion state ready=true, running=false, time=0 and disabled Motion off control. Mobile day/night switches and no horizontal overflow passed. Browser console warnings/errors: none. Build: 68 routes successful. JavaScript syntax and git diff checks passed. Shader, source images and mask preservation documented in ../lamp-control-qa/river-preservation.json.

Implementation checklist complete. No actionable P0/P1/P2 findings; no further P3 polishing needed.

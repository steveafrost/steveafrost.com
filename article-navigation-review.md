Article detail navigation checkpoint, based on published ClientRouter c4b5df57128bb2e4aaa2372983bef33ae4c345c5.

The article-detail MainLayout opts into the existing glassHeader property. All 51 articles now use the same wordmark, Work/Writing/About navigation, active Writing link, theme control, mobile disclosure, glass filtering and Astro lifecycle as the Writing index. Existing shared glass-inner CSS supplies fixed-header clearance, mobile/no-JS spacing, anchor offsets and skip-link stacking. No new header implementation or CSS was introduced.

All 51 full article bodies are byte-for-byte unchanged against the ClientRouter release; all 99 HTML routes remain. Article typography, reading width, dates, images, links and Bio remain intact. 89 Node tests pass, including all-article header parity and no-JS reading/navigation checks. Astro build succeeds (83 pages); isolated Astro/TypeScript check: 0 errors, 0 warnings, 45 hints.

Cloud browser QA pending. No browser used locally. Check a long article, a short article, a title that wraps, and an article reached from a project story; desktop/mobile, night/day, menu, no-JS fallback, skip link, heading/deep anchors, Back/Forward scroll, theme/route controls after repeated transitions. Compare top title clearance and reading column against the published article. Preview only; do not publish this later design without authorization.

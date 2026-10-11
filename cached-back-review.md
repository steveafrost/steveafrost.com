# Cached Back theme candidate on current production

Base: `6e3492aa7faf607cebb56efcd5ff390384238fa2` (published minimal footer). Reassessed isolated `68d2a122f116efbda5d0356d14460b5876063d4f`; retained only its necessary lifecycle/theme changes and two cache tokens, with current tests extended for all theme controls.

## Evidence and mechanism

Production already reconciles localStorage appearance on Astro before-swap, after-swap and page-load. It retains resources on persisted pagehide but has no persisted pageshow reconciliation. Native bfcache restores historical DOM state without performing an Astro swap. Browser lifecycle documentation: [pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event), [pagehide](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event).

The new regression tests executed against unmodified current production scripts fail two cached-history cases: latest stored night appearance is not reconciled and Home retains `/day.png` when storage has night. Logs are in the review packet. This is a VM reproduction of an uncovered native restoration path, **not proof of the reported real browser sequence's cause**. Ordinary Astro Back/Forward is a different path and was already covered.

## Narrow fix

- Persisted pageshow reconciles the latest stored theme, template chrome metadata/root colors and Home picture.
- A restored-theme event synchronizes header, menu and footer action labels/pressed state through the existing controller; its cleanup removes this listener on swaps/unload.
- Only changed picture sources are assigned. Changing current Home artwork signals the existing river frame to stop before the image load refresh; unchanged sources keep retained resources intact.
- No history/popstate override, scroll/focus change, added renderer, controller restart, CSS change, or production publication.

## Checks

115 tests pass; 83 Astro pages / 99 HTML routes. All 99 routes are byte-identical to the production build after normalizing only the two script cache tokens. Minimal footer/location removal, Home page/artwork/sky, browser-chrome logic, CSS and standalone content are unchanged. Typecheck: 0 errors, 0 warnings, 47 hints.

Tests cover initial saved theme; Home night → Kindle day → article night → cached Back/Forward and reload; header/menu/footer ARIA synchronization; ordinary nonpersisted pageshow; repeated cached restores and repeated script evaluation without listener growth; changed versus unchanged Home artwork; retained resources and real unload cleanup; Astro swap cleanup/re-entry; and blocked storage retaining the DOM appearance.

## Cloud browser retest required

Runtime QA: blocked pending parent cloud browser. Steve's local browser was not launched. No new preview access grant is authorized or created.

1. Log real `pageshow.persisted`, `pagehide.persisted`, and Astro lifecycle events. Do not count a synthetic dispatched pageshow as native bfcache proof.
2. Test the reported Home night → Kindle day → article night → Back → Forward → reload sequence. Confirm storage, root theme, visible palettes, all theme-control labels/pressed state, and template chrome colors agree.
3. Separately test ordinary Astro Back/Forward and actual native bfcache across a full-document boundary (standalone demo/external navigation); another same-origin tab can change stored appearance while the first document is cached. Confirm the real restored event has `persisted: true`.
4. On Home, verify night/day picture and edge sky match, motion resumes, pause remains honored, and resources/listeners do not multiply over repeated navigation/restoration.
5. Check desktop/mobile, minimalist footer without location/artwork/tagline, and browser console. Actual iPhone Safari remains unverified until tested there.

No runtime/visual browser pass is claimed. Wait for separate approval before any production deployment.

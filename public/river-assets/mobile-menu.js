/* Native navigation disclosure: no menu roles or focus trap for ordinary links. */
(() => {
  const header = document.querySelector('.editorial-header');
  if (!header) return;
  const toggle = header.querySelector('.mobile-menu-toggle');
  const panel = header.querySelector('.header-menu');
  if (!toggle || !panel) return;
  const mobile = matchMedia('(max-width: 760px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let open = false;
  let animations = [];
  let generation = 0;
  let collapsedHeight = 0;
  let viewportWidth = innerWidth;

  function cancelMotion() {
    generation++;
    for (const animation of animations) {
      // Also consume rejection if an engine throws while creating the second effect.
      animation.finished.catch(() => {});
      animation.cancel();
    }
    animations = [];
  }
  function settle() {
    panel.hidden = mobile.matches && !open;
    cancelMotion();
  }
  function setOpen(next, restoreFocus = false, immediate = false) {
    const wasHidden = panel.hidden;
    const shouldOpen = mobile.matches && next;
    const canAnimate = !immediate && mobile.matches && !reducedMotion.matches
      && typeof panel.animate === 'function' && typeof header.animate === 'function';
    // Capture the current painted frame before cancelling a rapid reversal.
    const surface = canAnimate ? getComputedStyle(header) : null;
    const content = canAnimate && !wasHidden ? getComputedStyle(panel) : null;
    const fromClip = animations.length ? surface?.clipPath : null;
    const fromTransform = content?.transform || 'none';
    const fromOpacity = content?.opacity || '1';
    if (wasHidden && canAnimate) collapsedHeight = header.offsetHeight;
    cancelMotion();
    open = shouldOpen;
    header.classList.toggle('menu-is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    const label = open ? 'Close navigation' : 'Open navigation';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    // Keep a closing panel painted, but remove it from focus and accessibility now.
    if (mobile.matches && !open && panel.contains(document.activeElement)) restoreFocus = true;
    if (restoreFocus && mobile.matches) toggle.focus({ preventScroll: true });
    panel.inert = mobile.matches && !open;
    if (panel.inert) panel.setAttribute('aria-hidden', 'true');
    else panel.removeAttribute('aria-hidden');
    if (!canAnimate || (!open && wasHidden)) { settle(); return; }
    panel.hidden = false;
    const expandedHeight = header.offsetHeight;
    const radius = surface.borderRadius;
    const expandedClip = `inset(0px 0px 0px 0px round ${radius})`;
    const collapsedClip = `inset(0px 0px ${Math.max(0, expandedHeight - collapsedHeight)}px 0px round ${radius})`;
    const token = generation;
    const timing = { duration: open ? 280 : 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' };
    try {
      // A rounded clip reveals the fixed glass without scaling its type or icons.
      // Only the content uses transform/opacity; no per-frame layout or idle loop.
      animations.push(header.animate([
        { clipPath: fromClip || (wasHidden ? collapsedClip : expandedClip) },
        { clipPath: open ? expandedClip : collapsedClip },
      ], timing));
      animations.push(panel.animate([
        { transform: wasHidden ? 'translateY(-8px)' : fromTransform, opacity: wasHidden ? '0' : fromOpacity },
        { transform: open ? 'translateY(0px)' : 'translateY(-6px)', opacity: open ? '1' : '0' },
      ], timing));
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (token === generation) settle();
      }, () => { /* A newer toggle/reset owns the state after cancellation. */ });
    } catch {
      // Older engines retain the native, immediate disclosure.
      settle();
    }
  }
  function reset() {
    const focusWasInside = panel.contains(document.activeElement);
    toggle.hidden = !mobile.matches;
    setOpen(false, focusWasInside, true);
  }
  toggle.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (open && !header.contains(event.target)) {
      // Return focus only if it would otherwise remain in the hidden panel.
      setOpen(false, panel.contains(document.activeElement));
    }
  });
  panel.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false, true);
  });
  mobile.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
  addEventListener('resize', () => {
    // Ignore mobile browser-chrome height changes while scrolling.
    if (innerWidth !== viewportWidth) { viewportWidth = innerWidth; reset(); }
  });
  addEventListener('pageshow', reset);
  addEventListener('pagehide', () => setOpen(false, false, true));
  header.classList.add('menu-enhanced');
  reset();
})();

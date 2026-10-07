/* Native navigation disclosure: no menu roles or focus trap for ordinary links. */
(() => {
  const header = document.querySelector('.editorial-header');
  if (!header) return;
  const toggle = header.querySelector('.mobile-menu-toggle');
  const panel = header.querySelector('.header-menu');
  if (!toggle || !panel) return;
  const mobile = matchMedia('(max-width: 760px)');
  let open = false;

  function setOpen(next, restoreFocus = false) {
    open = mobile.matches && next;
    header.classList.toggle('menu-is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    const label = open ? 'Close navigation' : 'Open navigation';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    panel.hidden = mobile.matches && !open;
    if (restoreFocus && mobile.matches) toggle.focus({ preventScroll: true });
  }
  function reset() {
    const focusWasInside = panel.contains(document.activeElement);
    toggle.hidden = !mobile.matches;
    setOpen(false, focusWasInside);
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
  addEventListener('pageshow', reset);
  addEventListener('pagehide', () => setOpen(false));
  header.classList.add('menu-enhanced');
  reset();
})();

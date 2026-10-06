(() => {
  const root = document.documentElement;
  const controls = [...document.querySelectorAll('.theme-toggle')];
  const photo = document.querySelector('.river-picture');
  if (!controls.length) return;
  let busy = false;

  function sync() {
    const night = root.dataset.theme === 'night';
    for (const control of controls) {
      const header = control.classList.contains('theme-header');
      const label = header
        ? (night ? 'Switch to light mode' : 'Switch to dark mode')
        : (night ? 'Switch to daylight' : 'Switch to night');
      control.setAttribute('aria-label', label);
      control.title = label;
      control.setAttribute('aria-pressed', String(night));
      if (control.classList.contains('theme-compact')) control.textContent = night ? '☀' : '☾';
    }
  }

  function apply(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem('river-theme', theme); } catch {}
    if (photo) {
      document.dispatchEvent(new Event('river-artwork-changing'));
      photo.src = photo.dataset[theme];
    }
    sync();
  }

  function toggle(control) {
    if (busy) return;
    const theme = root.dataset.theme === 'night' ? 'day' : 'night';
    if (!photo) { apply(theme); return; }
    const focused = document.activeElement === control;
    const assets = theme === 'night'
      ? [photo.dataset.night, '/river-assets/moon-source.png', '/river-assets/night-lamp-repair.png']
      : [photo.dataset.day, '/river-assets/day-lamp-repair.png'];
    busy = true;
    for (const button of controls) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
    let remaining = assets.length;
    let failed = false;
    function finish() {
      busy = false;
      for (const button of controls) { button.disabled = false; button.removeAttribute('aria-busy'); }
      if (focused) control.focus({ preventScroll: true });
    }
    for (const src of assets) {
      const next = new Image();
      next.onload = () => { if (--remaining === 0 && !failed) { apply(theme); finish(); } };
      next.onerror = () => { if (!failed) { failed = true; finish(); } };
      next.src = src;
    }
  }
  for (const control of controls) control.addEventListener('click', () => toggle(control));
  sync();
})();

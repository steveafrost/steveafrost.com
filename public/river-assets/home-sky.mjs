// Match the untouched hero's object-fit crop; stretch only the exposed edge.
export function homeEdgeViews(width, height, focusX = .5, focusY = .5) {
  if (!(width > 0 && height > 0)) return null;
  const scale = Math.max(width / 2172, height / 724);
  const cropWidth = width / scale, cropHeight = height / scale;
  const x = (2172 - cropWidth) * focusX, y = (724 - cropHeight) * focusY;
  // Pixel centers avoid interpolating transparent pixels outside the artwork.
  const left = Math.max(0, Math.min(2171, x));
  const right = Math.max(0, Math.min(2171, x + cropWidth - 1));
  const top = Math.max(0, Math.min(723, y));
  return {
    top: [x, top, cropWidth, 1],
    left: [left, y, 1, cropHeight], right: [right, y, 1, cropHeight],
    'top-left': [left, top, 1, 1], 'top-right': [right, top, 1, 1],
  };
}

export function initializeHomeSky() {
  const frame = document.querySelector('.home-river-frame');
  const scene = frame?.querySelector('.landscape');
  const picture = scene?.querySelector('.river-picture');
  if (!picture) return;
  let disposed = false;
  const update = () => {
    if (disposed) return;
    globalThis.riverBrowserChrome?.(document, document.documentElement.dataset.theme);
    const position = getComputedStyle(picture).objectPosition.split(' ');
    const focus = value => value === 'center' ? .5 : value === 'left' || value === 'top' ? 0 : value === 'right' || value === 'bottom' ? 1 : parseFloat(value) / 100;
    const views = homeEdgeViews(scene.clientWidth, scene.clientHeight, focus(position[0]), focus(position[1] || '50%'));
    if (!views) return;
    for (const edge of frame.querySelectorAll('[data-home-edge]')) {
      edge.setAttribute('viewBox', views[edge.dataset.homeEdge].join(' '));
    }
  };
  update();
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
  observer?.observe(scene);
  const orientation = typeof matchMedia === 'function' ? matchMedia('(orientation: landscape)') : null;
  orientation?.addEventListener('change', update);
  addEventListener('resize', update);
  picture.addEventListener('load', update);
  return () => {
    disposed = true;
    observer?.disconnect();
    orientation?.removeEventListener('change', update);
    removeEventListener('resize', update);
    picture.removeEventListener('load', update);
  };
}

if (typeof document !== 'undefined') {
  if (globalThis.riverLifecycle) globalThis.riverLifecycle.register('home-sky', initializeHomeSky);
  else initializeHomeSky();
}

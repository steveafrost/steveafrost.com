// A CSS animation has no JS frame loop. Run it only when its scene is visible.
export function initializeAboutMotion(root, environment = window) {
  if (!root) return () => {};
  const doc = root.ownerDocument;
  const button = root.querySelector('[data-story-pause]');
  const track = root.querySelector('[data-story-cyclist]');
  if (!button || !track || typeof environment.IntersectionObserver !== 'function') return () => {};
  const reduced = environment.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = environment.matchMedia('(min-width: 1100px)');
  let paused = false;
  let visible = false;
  const update = () => {
    const running = !paused && visible && !doc.hidden && !reduced.matches && desktop.matches;
    root.dataset.motion = running ? 'running' : 'paused';
    button.disabled = reduced.matches || !desktop.matches;
    button.setAttribute('aria-pressed', String(paused || reduced.matches));
    button.textContent = reduced.matches ? 'Motion paused' : paused ? 'Play motion' : 'Pause motion';
  };
  const toggle = () => { paused = !paused; update(); };
  const observer = new environment.IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    track.dataset.visible = String(visible);
    update();
  }, {threshold: 0.1});
  observer.observe(track);
  button.addEventListener('click', toggle);
  doc.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  desktop.addEventListener('change', update);
  update();
  const cleanup = () => {
    observer.disconnect();
    button.removeEventListener('click', toggle);
    doc.removeEventListener('visibilitychange', update);
    reduced.removeEventListener('change', update);
    desktop.removeEventListener('change', update);
    environment.removeEventListener('pagehide', cleanup);
    root.dataset.motion = 'paused';
  };
  environment.addEventListener('pagehide', cleanup, {once: true});
  return cleanup;
}
if (typeof window !== 'undefined') initializeAboutMotion(document.querySelector('[data-about-story]'));

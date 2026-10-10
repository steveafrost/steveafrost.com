/* One registry survives Astro swaps; each initializer owns one page instance. */
(() => {
  if (globalThis.riverLifecycle) return;
  const entries = new Map();
  function start(entry) {
    if (entry.cleanup) return;
    try { entry.cleanup = entry.initialize() || null; }
    catch (error) { console.error('Page initialization failed:', entry.name, error); }
  }
  function stop() {
    for (const entry of [...entries.values()].reverse()) {
      const cleanup = entry.cleanup;
      entry.cleanup = null;
      try { cleanup?.(); }
      catch (error) { console.error('Page cleanup failed:', entry.name, error); }
    }
  }
  function theme(documentToUpdate) {
    let value = document.documentElement.dataset.theme === 'night' ? 'night' : 'day';
    try { value = localStorage.getItem('river-theme') === 'night' ? 'night' : 'day'; } catch {}
    documentToUpdate.documentElement.dataset.theme = value;
    globalThis.riverBrowserChrome?.(documentToUpdate, value);
    const picture = documentToUpdate.querySelector('.river-picture');
    if (picture?.dataset[value]) picture.setAttribute('src', picture.dataset[value]);
  }
  globalThis.riverLifecycle = {
    register(name, initialize) {
      if (entries.has(name)) return;
      const entry = { name, initialize, cleanup: null };
      entries.set(name, entry);
      start(entry);
    },
  };
  document.addEventListener('astro:before-swap', event => {
    stop();
    theme(event.newDocument);
    // Cloudflare injects this self-removing decoder into each HTML response.
    // Astro must execute it on every swap, even when the URL has already run.
    for (const script of event.newDocument.querySelectorAll('script[src]')) {
      if (/^\/cdn-cgi\/scripts\/[a-f\d]+\/cloudflare-static\/email-decode\.min\.js(?:\?.*)?$/.test(script.getAttribute('src'))) {
        script.setAttribute('data-astro-rerun', '');
      }
    }
  });
  document.addEventListener('astro:after-swap', () => theme(document));
  document.addEventListener('astro:page-load', () => {
    theme(document);
    for (const entry of entries.values()) start(entry);
  });
  addEventListener('pagehide', event => { if (!event.persisted) stop(); });
})();

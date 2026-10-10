/* Runs in the head before first paint; reused by theme controls and Astro swaps. */
(() => {
  globalThis.riverBrowserChrome = (page, theme) => {
    const root = page.documentElement;
    const night = theme === 'night';
    const color = root.dataset[night ? 'chromeNight' : 'chromeDay'];
    if (!color) return;
    const scheme = night ? 'dark' : 'light';
    root.dataset.theme = night ? 'night' : 'day';
    root.style.backgroundColor = color;
    root.style.setProperty('--browser-chrome-color', color);
    root.style.colorScheme = scheme;
    page.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    page.querySelector('meta[name="color-scheme"]')?.setAttribute('content', scheme);
  };
  let theme = 'day';
  try { theme = localStorage.getItem('river-theme') === 'night' ? 'night' : 'day'; } catch {}
  globalThis.riverBrowserChrome(document, theme);
})();

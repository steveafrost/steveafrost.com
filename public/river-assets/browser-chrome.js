/* Runs in the head before first paint; reused by theme controls and Astro swaps. */
(() => {
  globalThis.riverBrowserChrome = (page, theme) => {
    const root = page.documentElement;
    const night = theme === 'night';
    // Portrait Home gets the sky strip. Landscape retains its deployed safe
    // viewport width, including existing responsive breakpoints and hero crop.
    const landscape = typeof matchMedia === 'function' && matchMedia('(orientation: landscape)').matches;
    const fit = root.dataset.browserTemplate === 'home' && !landscape ? 'cover' : 'auto';
    page.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=' + fit);
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

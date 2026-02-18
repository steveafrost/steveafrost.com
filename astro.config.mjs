import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://steveafrost.com',
  integrations: [mdx(), sitemap(), tailwind()],
  build: {
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});

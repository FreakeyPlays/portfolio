// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://chrismerck.dev',

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Montserrat',
        cssVariable: '--font-montserrat',
      },
      {
        provider: fontProviders.google(),
        name: 'Raleway',
        cssVariable: '--font-raleway',
      }
    ],
  },

  redirects: {
    '/projects': '/#projects',
    '/career': '/#career',
    '/education': '/#education',
    '/skills': '/#skills',
    '/about': '/#about',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});

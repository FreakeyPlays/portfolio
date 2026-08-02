// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://chrismerck.dev',

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: ['400 800'],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
    },
  ],

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

  integrations: [
    sitemap({ filter: (page) => !page.includes('/admin') }),
  ],
});

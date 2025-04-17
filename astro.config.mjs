// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://chrismerck.dev',

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Montserrat',
        cssVariable: '--font-serif',
      },
      {
        provider: fontProviders.google(),
        name: 'Raleway',
        cssVariable: '--font-sans',
      }
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), sitemap()],
});

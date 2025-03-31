// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://chrismerck.dev',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), sitemap()],
});

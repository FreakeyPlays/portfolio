// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { getModifiedDateForURL, isListedInSitemap } from '@utils/buildTimePageMeta.ts';
import { defineConfig, fontProviders } from 'astro/config';

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

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    processor: satteri(),
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/admin') && isListedInSitemap(page),
      serialize: (item) => ({ ...item, lastmod: getModifiedDateForURL(item.url).toISOString() }),
    }),
  ],
});

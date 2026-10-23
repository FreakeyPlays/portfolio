// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { getModifiedDateForURL, isListedInSitemap } from '@utils/buildTimePageMeta.ts';
import { mdastReadingTimePlugin } from '@utils/mdastReadTimePlugin';
import { mdastTableOfContentsPlugin } from '@utils/mdastTableOfContentsPlugin';
import { defineConfig, envField, fontProviders } from 'astro/config';
import copyCmsAssets from 'scripts/copy-cms-assets';

export default defineConfig({
  site: 'https://chrismerck.dev',

  env: {
    schema: {
      PUBLIC_UMAMI_SHARE_URL: envField.string({ context: 'client', access: 'public', optional: true, url: true }),
    },
  },

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
    processor: satteri({ mdastPlugins: [mdastReadingTimePlugin(), mdastTableOfContentsPlugin()] }),
  },

  integrations: [
    copyCmsAssets(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/admin') && isListedInSitemap(page),
      serialize: (item) => ({ ...item, lastmod: getModifiedDateForURL(item.url).toISOString() }),
    }),
  ],
});

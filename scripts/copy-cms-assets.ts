import { cp } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';

const sourceDir = new URL('../src/assets/', import.meta.url);

export default function copyCmsAssets(): AstroIntegration {
  return {
    name: 'copy-cms-assets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        await cp(sourceDir, new URL('src/assets/', dir), {
          recursive: true,
          force: true,
        });

        logger.info('Copied source assets to /assets');
      },
    },
  };
}

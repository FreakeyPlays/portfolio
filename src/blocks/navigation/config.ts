import type { EditorComponentDefinition } from '@sveltia/cms';

const NAVIGATION_PATTERN = /^<Navigation\s*\/>$/m;

export const navigationConfig: EditorComponentDefinition = {
  id: 'navigation',
  label: 'Navigation',
  icon: 'menu',
  fields: [],
  pattern: NAVIGATION_PATTERN,
  fromBlock: () => ({}),
  toBlock: () => '<Navigation />',
  toPreview: () => '<p>Navigation</p>',
};

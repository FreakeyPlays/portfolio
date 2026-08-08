import type { EditorComponentDefinition } from '@sveltia/cms';

const CAREER_PATTERN = /^<Career\s*\/>$/m;

export const careerConfig: EditorComponentDefinition = {
  id: 'career',
  label: 'Career',
  icon: 'work',
  fields: [],
  pattern: CAREER_PATTERN,
  fromBlock: () => ({}),
  toBlock: () => '<Career />',
  toPreview: () => '<p>Career</p>',
};

import type { EditorComponentDefinition } from '@sveltia/cms';

const PROJECTS_PATTERN = /^<Projects\s*\/>$/m;

export const projectsConfig: EditorComponentDefinition = {
  id: 'projects',
  label: 'Projects',
  icon: 'deployed_code',
  fields: [],
  pattern: PROJECTS_PATTERN,
  fromBlock: () => ({}),
  toBlock: () => '<Projects />',
  toPreview: () => '<p>Projects</p>',
};

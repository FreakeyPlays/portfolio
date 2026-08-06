import type { EditorComponentDefinition } from '@sveltia/cms';

const EDUCATION_PATTERN = /^<Education\s*\/>$/m;

export const educationConfig: EditorComponentDefinition = {
  id: 'education',
  label: 'Education',
  icon: 'school',
  fields: [],
  pattern: EDUCATION_PATTERN,
  fromBlock: () => ({}),
  toBlock: () => '<Education />',
  toPreview: () => '<p>Education</p>',
};

import type { EditorComponentDefinition } from '@sveltia/cms';

const POST_LIST_PATTERN = /^<PostList\s*\/>$/m;

export const postListConfig: EditorComponentDefinition = {
  id: 'postList',
  label: 'Post List',
  icon: 'more',
  fields: [],
  pattern: POST_LIST_PATTERN,
  fromBlock: () => ({}),
  toBlock: () => '<PostList />',
  toPreview: () => '<p>Post Listing</p>',
};

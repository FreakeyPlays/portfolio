import type { AppEventListener } from '@sveltia/cms';

const COLLECTIONS = ['pages', 'posts'];

const cmsDatetime = () => new Date().toJSON().replace(/\d+\.\d+Z$/, '00.000Z');

export const updateTimestamps: AppEventListener = {
  name: 'preSave',
  handler: ({ entry }) => {
    if (!COLLECTIONS.includes(entry.get('collection'))) return;
    if (!entry.getIn(['data', 'publishedAt']) && entry.getIn(['data', 'isPublished'])) {
      entry = entry.setIn(['data', 'publishedAt'], cmsDatetime());
    }

    return entry.setIn(['data', 'updatedAt'], cmsDatetime());
  },
};

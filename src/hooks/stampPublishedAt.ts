import type { AppEventListener } from '@sveltia/cms';

const PAGES_COLLECTION = 'pages';

const cmsDatetime = () => new Date().toJSON().replace(/\d+\.\d+Z$/, '00.000Z');

export const stampPublishedAt: AppEventListener = {
	name: 'preSave',
	handler: ({ entry }) => {
		if (entry.get('collection') !== PAGES_COLLECTION) return;
		if (!entry.getIn(['data', 'isPublished'])) return;
		if (entry.getIn(['data', 'publishedAt'])) return;

		return entry.setIn(['data', 'publishedAt'], cmsDatetime());
	},
};

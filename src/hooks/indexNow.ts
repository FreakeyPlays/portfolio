import type { AppEventListener } from '@sveltia/cms';

const KEY = 'b444eb126f905c13aa3b47d08ff4dca7';
const ORIGIN = 'https://chrismerck.dev';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const SKIPPED_PAGES = ['404'];

const pathFor = (collection: string, slug: string) => {
  if (collection === 'posts') return `/blog/${slug}/`;
  if (collection !== 'pages' || SKIPPED_PAGES.includes(slug)) return undefined;

  return slug === 'home' ? '/' : `/${slug}/`;
};

export const indexNow: AppEventListener = {
  name: 'postPublish',
  handler: async ({ entry }) => {
    const collection = entry.get('collection');
    const slug = entry.getIn(['data', 'slug']);

    if (!entry.getIn(['data', 'isPublished']) || entry.getIn(['data', 'noIndex'])) return;
    if (typeof slug !== 'string' || !slug) return;

    const path = pathFor(String(collection), slug);
    if (!path) return;

    const ping = new URL(ENDPOINT);
    ping.searchParams.set('url', `${ORIGIN}${path}`);
    ping.searchParams.set('key', KEY);

    try {
      await fetch(ping, { mode: 'no-cors', keepalive: true });
    } catch {}
  },
};

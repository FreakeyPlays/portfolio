import { type CollectionEntry, getEntry } from 'astro:content';

export type Site = CollectionEntry<'site'>['data'];

export async function getSite(): Promise<Site> {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('Missing CMS singleton: src/data/site.json');

  return entry.data;
}

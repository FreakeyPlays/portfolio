import { type CollectionEntry, getCollection } from 'astro:content';

export async function getPage(slug: string): Promise<CollectionEntry<'pages'>> {
  const entry = await getCollection('pages', (page) => page.data.slug === slug);
  if (!entry) throw new Error(`Missing Page: ${slug}`);

  return entry[0] as CollectionEntry<'pages'>;
}

import { type CollectionEntry, getCollection } from 'astro:content';

export async function getPost(slug: string): Promise<CollectionEntry<'posts'>> {
  const entry = await getCollection('posts', (post) => post.data.slug === slug);
  if (!entry) throw new Error(`Missing Post: ${slug}`);

  return entry[0] as CollectionEntry<'posts'>;
}

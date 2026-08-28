import { type CollectionEntry, type DataEntryMap, getEntry } from 'astro:content';

export async function getSingelton<T extends keyof DataEntryMap>(
  collection: T,
): Promise<CollectionEntry<T>> {
  const entry = await getEntry(collection, collection);
  if (!entry) throw new Error(`Missing Singleton: ${collection}`);

  return entry as CollectionEntry<T>;
}

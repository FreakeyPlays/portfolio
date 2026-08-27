import { type CollectionEntry, type DataEntryMap, getEntry } from 'astro:content';

export async function getSingelton(
  collection: keyof DataEntryMap,
): Promise<CollectionEntry<keyof DataEntryMap>> {
  const entry = await getEntry(collection, collection);
  if (!entry) throw new Error(`Missing Singleton: ${collection}`);

  return entry;
}

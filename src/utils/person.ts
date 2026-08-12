import { type CollectionEntry, getEntry } from 'astro:content';

export type Person = CollectionEntry<'person'>['data'] & { name: { full: string } };

export async function getPerson(): Promise<Person> {
  const entry = await getEntry('person', 'person');
  if (!entry) throw new Error('Missing CMS singleton: src/data/person.json');

  const { name, ...rest } = entry.data;

  return { ...rest, name: { ...name, full: `${name.first} ${name.last}` } };
}

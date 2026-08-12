import { type CollectionEntry, getCollection } from 'astro:content';

export type Social = CollectionEntry<'socials'>['data'];

export async function getSocials(): Promise<Social[]> {
  return (await getCollection('socials')).map(({ data }) => data).sort((a, b) => a.order - b.order);
}

export async function getProfiles(): Promise<Social[]> {
  return (await getSocials()).filter(
    ({ footerOnly, href }) => !footerOnly && /^https?:/i.test(href),
  );
}

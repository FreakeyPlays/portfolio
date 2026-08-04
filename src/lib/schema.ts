import { getCollection } from 'astro:content';
import identity from '@data/identity.json';
import siteInfo from '@data/siteInfo.json';
import socialLinks from '@data/socialLinks.json';
import { getContentModifiedISODate } from '@lib/contentDate';

/**
 * Canonical spellings for technology names.
 *
 * `knowsAbout` is an entity-resolution signal, so the same technology must
 * always be written the same way. Editors type these by hand in the CMS, so
 * the lookup is on a lowercased, punctuation-stripped key to catch variants
 * like "NextJS" / "Next.js" / "next js" without needing an entry for each.
 */
const CANONICAL_TECHNOLOGY_NAMES: Record<string, string> = {
  nextjs: 'Next.js',
  nodejs: 'Node.js',
  vuejs: 'Vue.js',
  vue: 'Vue.js',
  nuxtjs: 'Nuxt',
  postgresdb: 'PostgreSQL',
  postgres: 'PostgreSQL',
  csharp: 'C#',
  cpp: 'C++',
  tailwindcss: 'Tailwind CSS',
  payloadcms: 'PayloadCMS',
  nestjs: 'NestJS',
  webassembly: 'WebAssembly',
  wasm: 'WebAssembly',
  pwa: 'Progressive Web App',
  progressivewebapp: 'Progressive Web App',
  progressivewebapps: 'Progressive Web App',
  webrtc: 'WebRTC',
  html: 'HTML',
  css: 'CSS',
};

function canonicalTechnology(name: string): string {
  const key = name.toLowerCase().replace(/[\s._-]/g, '');
  return CANONICAL_TECHNOLOGY_NAMES[key] ?? name.trim();
}

function compact<T extends Record<string, unknown>>(node: T): T {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }),
  ) as T;
}

const HIGHER_EDUCATION_LEVELS = new Set(['bachelor', 'master', 'phd', 'doctorate']);

export async function buildProfileGraph(site: URL): Promise<object> {
  const origin = site.origin;
  const id = (fragment: string) => `${origin}/#${fragment}`;
  const personRef = { '@id': id('person') };

  const [career, education, skills] = await Promise.all([
    getCollection('career', ({ data }) => data.isPublished),
    getCollection('education', ({ data }) => data.isPublished),
    getCollection('skills'),
  ]);

  const currentEmployer = career.find(({ data }) => data.jobs.some((job) => !job.endDate));

  const universities = education.filter(({ data }) =>
    HIGHER_EDUCATION_LEVELS.has(data.level.toLowerCase()),
  );

  const knowsAbout = [
    ...skills.flatMap(({ data }) =>
      data.skills.filter((skill) => skill.isPublished && skill.image).map((skill) => skill.name),
    ),
    ...career.flatMap(({ data }) => data.jobs.flatMap((job) => job.technologies ?? [])),
    ...identity.additionalKnowsAbout,
  ]
    .map(canonicalTechnology)
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));

  const sameAs = [
    ...socialLinks.map(({ href }) => href).filter((href) => !href.startsWith('mailto:')),
    ...identity.additionalSameAs,
    identity.orcid,
  ].filter((href): href is string => Boolean(href?.trim()));

  const person = compact({
    '@type': 'Person',
    '@id': id('person'),
    name: siteInfo.name,
    givenName: identity.givenName,
    familyName: identity.familyName,
    alternateName: identity.alternateName,
    url: `${origin}/`,
    mainEntityOfPage: { '@id': id('profilepage') },
    jobTitle: identity.jobTitle,
    description: identity.description,
    disambiguatingDescription: identity.disambiguatingDescription,
    image: identity.image ? new URL(identity.image, site).toString() : undefined,
    email: identity.email ? `mailto:${identity.email}` : undefined,
    identifier: identity.orcid || undefined,
    address: compact({
      '@type': 'PostalAddress',
      addressLocality: identity.address.locality,
      addressRegion: identity.address.region,
      addressCountry: identity.address.country,
    }),
    workLocation: identity.workLocation.map((name) => ({ '@type': 'Place', name })),
    knowsLanguage: identity.knowsLanguage.map(({ name, code }) =>
      compact({ '@type': 'Language', name, alternateName: code }),
    ),
    knowsAbout,
    sameAs,
    worksFor: currentEmployer ? { '@id': id(`org-${currentEmployer.id}`) } : undefined,
    alumniOf: universities.map(({ id: entryId }) => ({ '@id': id(`edu-${entryId}`) })),
    // Emitted only once an occupational category (ISCO-08 / O*NET-SOC) is set.
    hasOccupation: identity.occupationalCategory
      ? compact({
          '@type': 'Occupation',
          name: identity.jobTitle,
          occupationalCategory: identity.occupationalCategory,
          skills: knowsAbout,
          occupationLocation: identity.workLocation.map((name) => ({
            '@type': 'AdministrativeArea',
            name,
          })),
        })
      : undefined,
    award: identity.awards,
    memberOf: identity.memberOf.map((name) => ({ '@type': 'Organization', name })),
  });

  const organizations = currentEmployer
    ? [
        compact({
          '@type': 'Organization',
          '@id': id(`org-${currentEmployer.id}`),
          name: currentEmployer.data.company,
          url: currentEmployer.data.url,
        }),
      ]
    : [];

  const schools = universities.map(({ id: entryId, data }) =>
    compact({
      '@type': 'CollegeOrUniversity',
      '@id': id(`edu-${entryId}`),
      name: data.institution,
      url: data.url,
    }),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url: `${origin}/`,
        name: siteInfo.name,
        alternateName: site.hostname,
        inLanguage: 'en',
        publisher: personRef,
      },
      compact({
        '@type': 'ProfilePage',
        '@id': id('profilepage'),
        url: `${origin}/`,
        name: `${siteInfo.name} — ${siteInfo.tagline}`,
        isPartOf: { '@id': id('website') },
        datePublished: identity.sitePublished,
        dateModified: getContentModifiedISODate(),
        mainEntity: personRef,
      }),
      person,
      ...organizations,
      ...schools,
    ],
  };
}

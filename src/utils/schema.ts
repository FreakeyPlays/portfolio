import { getCollection } from 'astro:content';
import { getPageModifiedDateTime } from '@utils/buildTimePageMeta.ts';
import { toISODateTime } from '@utils/date.ts';
import { byOrder } from '@utils/order.ts';
import { getPerson } from '@utils/person.ts';
import { getSite } from '@utils/site.ts';
import { getProfiles } from '@utils/socials.ts';

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

  const [person, profiles, siteData, career, education, skills] = await Promise.all([
    getPerson(),
    getProfiles(),
    getSite(),
    getCollection('career', ({ data }) => data.isPublished),
    getCollection('education', ({ data }) => data.isPublished),
    getCollection('skills'),
  ]);

  const currentEmployer = career.find(({ data }) => data.jobs.some((job) => !job.endDate));

  const universities = education
    .filter(({ data }) => HIGHER_EDUCATION_LEVELS.has(data.level.toLowerCase()))
    .sort(byOrder);

  const knowsAbout = [
    ...skills.flatMap(({ data }) =>
      data.skills.filter((skill) => skill.isPublished && skill.image).map((skill) => skill.name),
    ),
    ...career.flatMap(({ data }) => data.jobs.flatMap((job) => job.technologies ?? [])),
  ]
    .map(canonicalTechnology)
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));

  // Every other place the same person can be verified from.
  const sameAs = [...profiles.map(({ href }) => href), person.orcid].filter(
    (href): href is string => href !== undefined,
  );

  const personNode = compact({
    '@type': 'Person',
    '@id': id('person'),
    name: person.name.full,
    givenName: person.name.first,
    familyName: person.name.last,
    alternateName: person.alternateName,
    url: `${origin}/`,
    mainEntityOfPage: { '@id': id('profilepage') },
    jobTitle: person.jobTitle,
    description: person.bio.long,
    disambiguatingDescription: person.bio.short,
    image: person.image ? new URL(person.image, site).toString() : undefined,
    email: `mailto:${person.email}`,
    identifier: person.orcid,
    address: compact({
      '@type': 'PostalAddress',
      addressLocality: person.location.locality,
      addressRegion: person.location.region,
      addressCountry: person.location.country,
    }),
    workLocation: person.workLocation.map((name) => ({ '@type': 'Place', name })),
    knowsLanguage: person.languages.map(({ name, code }) =>
      compact({ '@type': 'Language', name, alternateName: code }),
    ),
    knowsAbout,
    sameAs,
    worksFor: currentEmployer ? { '@id': id(`org-${currentEmployer.id}`) } : undefined,
    alumniOf: universities.map(({ id: entryId }) => ({ '@id': id(`edu-${entryId}`) })),
  });

  const launchedAt = siteData.launchedAt.toISOString().slice(0, 10);

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
        name: person.name.full,
        inLanguage: 'en',
        publisher: personRef,
      },
      compact({
        '@type': 'ProfilePage',
        '@id': id('profilepage'),
        url: `${origin}/`,
        name: `${person.name.full} — ${person.tagline}`,
        isPartOf: { '@id': id('website') },
        dateCreated: launchedAt,
        datePublished: launchedAt,
        dateModified: getPageModifiedDateTime('home'),
        mainEntity: personRef,
      }),
      personNode,
      ...organizations,
      ...schools,
    ],
  };
}

export type Breadcrumb = {
  name: string;
  url: URL | string;
};

export function buildBreadcrumbGraph(site: URL, page: URL, trail: Breadcrumb[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.toString()}#breadcrumb`,
        itemListElement: trail.map(({ name, url }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: new URL(url, site).toString(),
        })),
      },
    ],
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export type ArticleFacts = {
  url: URL;
  title: string;
  description: string;
  image: string;
  publishedAt?: Date;
  updatedAt: Date;
  section?: string;
  tags: string[];
  wordCount?: number;
  faq?: FaqItem[];
};

export async function buildArticleGraph(site: URL, article: ArticleFacts): Promise<object> {
  const origin = site.origin;
  const id = (fragment: string) => `${origin}/#${fragment}`;
  const personRef = { '@id': id('person') };

  const [person, profiles] = await Promise.all([getPerson(), getProfiles()]);
  const url = article.url.toString();

  const faqNodes =
    article.faq && article.faq.length > 0
      ? [
          {
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            url,
            about: { '@id': `${url}#article` },
            isPartOf: { '@id': id('website') },
            mainEntity: article.faq.map(({ question, answer }) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
              },
            })),
          },
        ]
      : [];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      compact({
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        headline: article.title,
        description: article.description,
        image: article.image,
        inLanguage: 'en',
        datePublished: article.publishedAt ? toISODateTime(article.publishedAt) : undefined,
        dateModified: toISODateTime(article.updatedAt),
        articleSection: article.section,
        keywords: article.tags,
        wordCount: article.wordCount,
        author: personRef,
        publisher: personRef,
        mainEntityOfPage: { '@id': url },
        isPartOf: { '@id': id('website') },
      }),
      ...faqNodes,
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url: `${origin}/`,
        name: person.name.full,
        inLanguage: 'en',
        publisher: personRef,
      },
      compact({
        '@type': 'Person',
        '@id': id('person'),
        name: person.name.full,
        url: `${origin}/`,
        jobTitle: person.jobTitle,
        image: person.image ? new URL(person.image, site).toString() : undefined,
        sameAs: profiles.map(({ href }) => href),
      }),
    ],
  };
}

import { type CollectionEntry, getCollection, getEntries, getEntry } from 'astro:content';
import { URL_MAPPINGS } from '@constants';
import type { ArticleMetaData } from '@layouts/head/_Article.astro';
import type { JsonLDNode } from '@layouts/head/_JsonLD.astro';
import type { OpenGraphData } from '@layouts/head/_OpenGraph.astro';
import type { BaseHeadData } from '@layouts/head/Head.astro';
import type { DeepPartial } from '@utils/deepPartial';
import { deepMerge } from '@utils/deepPartial';
import { getSingelton } from '@utils/getSingelton';
import { removeHtmlTags } from './sanitizeMarkdown';

export type HeadData = BaseHeadData & {
  og: OpenGraphData;
  article?: ArticleMetaData;
  jsonLdNodes: JsonLDNode[];
};

/**
 * Every node lives in a single `@graph` (see `_JsonLD.astro`), so nodes are
 * declared once and referenced everywhere else by `@id`. Site wide ids are
 * anchored on the origin, page level ids on the canonical url.
 */
type SchemaIds = ReturnType<typeof createIds>;

type SeoContext = {
  url: URL;
  origin: string;
  canonical: string;
  isHome: boolean;
  author: string;
  ids: SchemaIds;
  personal: CollectionEntry<'personal'>['data'];
  site: CollectionEntry<'site'>['data'];
  socials: CollectionEntry<'socials'>['data'];
};

/** A `{ "@id": "..." }` pointer to another node in the graph. */
const ref = (id: string) => ({ '@id': id });

const absoluteUrl = (path: string, origin: string) => new URL(path, origin).href;

/**
 * Astro's default `directory` build format serves every page under a trailing
 * slash, so urls built by hand have to match the canonical to stay one url.
 */
const pageUrl = (origin: string, path: string) => {
  const segments = path.replace(/^\/+|\/+$/g, '');
  return segments ? `${origin}/${segments}/` : `${origin}/`;
};

const createIds = (origin: string, canonical: string) => ({
  person: `${origin}/#person`,
  personImage: `${origin}/#personimage`,
  website: `${origin}/#website`,
  blog: `${pageUrl(origin, 'blog')}#blog`,
  webPage: `${canonical}#webpage`,
  primaryImage: `${canonical}#primaryimage`,
  article: `${canonical}#article`,
  breadcrumb: `${canonical}#breadcrumb`,
});

export async function resolveSeo(
  entity: CollectionEntry<'pages' | 'posts'>,
  url: URL,
): Promise<HeadData> {
  const canonical = url.href;
  const isHome = url.pathname === '/';
  const [personal, site, socials] = await Promise.all([
    getSingelton('personal'),
    getSingelton('site'),
    getSingelton('socials'),
  ]);

  const author = `${personal.data.firstName} ${personal.data.lastName}`;
  const context: SeoContext = {
    url,
    origin: url.origin,
    canonical,
    isHome,
    author,
    ids: createIds(url.origin, canonical),
    personal: personal.data,
    site: site.data,
    socials: socials.data,
  };

  const overwrites =
    entity.collection === 'posts'
      ? await resolvePost(entity, context)
      : await resolvePage(entity, context);

  const title = overwrites.title
    ? `${overwrites.title} | ${author}`
    : `${author} - ${personal.data.tagline}`;
  const description = overwrites.description ?? site.data.description;
  const image = site.data.socialPreview.image;
  const breadcrumbs = isHome ? undefined : createBreadCrumbs(url, title, canonical);

  const defaults: HeadData = {
    title,
    canonical,
    description,
    author,
    noIndex: false,
    locale: 'en',
    og: {
      type: 'website',
      title,
      description,
      locale: 'en',
      url: canonical,
      siteName: author,
      image: {
        url: image.src.src,
        alt: image.alt,
        type: `image/${image.src.format}`,
        width: image.src.width,
        height: image.src.height,
      },
    },
    jsonLdNodes: [
      createWebSite(context),
      await createPerson(context, isHome),
      ...(breadcrumbs ? [breadcrumbs] : []),
    ],
  };

  return deepMerge(defaults, {
    ...overwrites,
    title,
    article: overwrites.article && {
      ...overwrites.article,
      author: {
        firstName: personal.data.firstName,
        lastName: personal.data.lastName,
        alternateName: personal.data.alternateName,
      },
    },
  });
}

async function resolvePage(
  entity: CollectionEntry<'pages'>,
  context: SeoContext,
): Promise<DeepPartial<HeadData>> {
  const { isHome, ids, site } = context;
  const isBlogIndex = entity.data.slug === 'blog';
  const title = isHome ? undefined : entity.data.title;
  const description = entity.data.description
    ? removeHtmlTags(entity.data.description)
    : site.description;

  const preview = site.socialPreview.image;
  const primaryImage = createImage(ids.primaryImage, preview.src, context, preview.alt);

  const webPage = createWebPage(entity, context, {
    type: isHome ? 'ProfilePage' : isBlogIndex ? 'CollectionPage' : 'WebPage',
    name: title ?? context.author,
    description,
    // ProfilePage: the profile is *about* the person, so they are the main
    // entity. The blog index points at the Blog node instead.
    mainEntity: isHome ? ref(ids.person) : isBlogIndex ? ref(ids.blog) : undefined,
    about: isHome ? undefined : ref(ids.person),
  });

  return {
    title,
    description,
    noIndex: entity.data.noIndex || !entity.data.isPublished,
    og: {
      type: isHome ? 'profile' : 'website',
    },
    jsonLdNodes: [primaryImage, webPage, ...(isBlogIndex ? [createBlog(context)] : [])],
  };
}

async function resolvePost(
  entity: CollectionEntry<'posts'>,
  context: SeoContext,
): Promise<DeepPartial<HeadData>> {
  const { ids } = context;
  const [tags, category] = await Promise.all([
    getEntries(entity.data.tags),
    getEntry(entity.data.category),
  ]);

  const description = removeHtmlTags(entity.data.description);
  const publishedAt = entity.data.publishedAt ?? entity.data.createdAt;
  const primaryImage = createImage(ids.primaryImage, entity.data.image, context, entity.data.title);

  const questions = (entity.data.faq ?? []).map((item, index) => ({
    '@type': 'Question',
    '@id': `${context.canonical}#faq-${index + 1}`,
    position: index + 1,
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));

  const webPage = createWebPage(entity, context, {
    // The FAQ is rendered on the page, so the page itself qualifies as an
    // FAQPage in addition to being the article's landing page.
    type: questions.length > 0 ? ['WebPage', 'FAQPage'] : 'WebPage',
    name: entity.data.title,
    description,
    mainEntity: questions.length > 0 ? questions : undefined,
  });

  const article = {
    '@type': 'BlogPosting',
    '@id': ids.article,
    url: context.canonical,
    mainEntityOfPage: ref(ids.webPage),
    isPartOf: ref(ids.blog),
    headline: entity.data.title,
    name: entity.data.title,
    description,
    image: ref(ids.primaryImage),
    thumbnailUrl: absoluteUrl(entity.data.image.src, context.origin),
    datePublished: publishedAt.toISOString(),
    dateModified: entity.data.updatedAt.toISOString(),
    author: ref(ids.person),
    publisher: ref(ids.person),
    copyrightHolder: ref(ids.person),
    copyrightYear: publishedAt.getFullYear(),
    articleSection: category.data.label,
    keywords: tags.map((tag) => tag.data.label),
    inLanguage: 'en',
  };

  return {
    title: entity.data.title,
    description,
    noIndex: !entity.data.isPublished,
    og: {
      type: 'article',
      image: {
        url: entity.data.image.src,
        alt: entity.data.title,
        type: `image/${entity.data.image.format}`,
        width: entity.data.image.width,
        height: entity.data.image.height,
      },
    },
    article: {
      publishedAt: publishedAt.toISOString(),
      modifiedAt: entity.data.updatedAt.toISOString(),
      section: category.data.label,
      tags: tags.map((tag) => tag.data.label),
    },
    jsonLdNodes: [primaryImage, webPage, createBlog(context), article],
  };
}

function createWebSite(context: SeoContext): JsonLDNode {
  const { author, ids, origin, site } = context;

  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: pageUrl(origin, '/'),
    name: author,
    description: site.description,
    inLanguage: 'en',
    publisher: ref(ids.person),
    copyrightHolder: ref(ids.person),
    copyrightYear: site.launchedAt.getFullYear(),
    dateCreated: site.launchedAt.toISOString(),
  };
}

/**
 * The identity node the whole graph hangs off. `detailed` adds employment,
 * education and expertise, which only earns its bytes on the profile page.
 */
async function createPerson(context: SeoContext, detailed: boolean): Promise<JsonLDNode> {
  const { author, ids, origin, personal, socials } = context;
  const { location } = personal;

  const sameAs = [...socials.map(({ href }) => href), personal.orcid].filter(
    (href): href is string => Boolean(href),
  );

  return {
    '@type': 'Person',
    '@id': ids.person,
    name: author,
    givenName: personal.firstName,
    familyName: personal.lastName,
    ...(personal.alternateName && { alternateName: personal.alternateName }),
    description: personal.bio.short ?? personal.bio.long,
    jobTitle: personal.jobTitle,
    email: `mailto:${personal.email}`,
    url: pageUrl(origin, '/'),
    ...(personal.image && { image: ref(ids.personImage) }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.locality,
      ...(location.region && { addressRegion: location.region }),
      addressCountry: location.country,
    },
    ...(personal.workLocation.length > 0 && {
      workLocation: personal.workLocation.map((name) => ({ '@type': 'Place', name })),
    }),
    ...(personal.languages.length > 0 && {
      knowsLanguage: personal.languages.map(({ name, code }) => ({
        '@type': 'Language',
        name,
        alternateName: code,
      })),
    }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(detailed ? await createPersonDetails() : {}),
  };
}

async function createPersonDetails(): Promise<Record<string, unknown>> {
  const [career, education, skills] = await Promise.all([
    getCollection('career', ({ data }) => !data.hidden),
    getCollection('education', ({ data }) => !data.hidden),
    getCollection('skills', ({ data }) => !data.hidden),
  ]);

  const current = career.find(({ data }) => data.jobs.some((job) => !job.endDate)) ?? career[0];

  const knowsAbout = [
    ...new Set(
      skills.flatMap(({ data }) =>
        data.skills.filter((skill) => !skill.hidden).map((skill) => skill.name),
      ),
    ),
  ];

  return {
    ...(current && {
      worksFor: {
        '@type': 'Organization',
        name: current.data.company,
        url: current.data.url,
        location: { '@type': 'Place', name: current.data.location },
      },
    }),
    ...(education.length > 0 && {
      alumniOf: education.map(({ data }) => ({
        '@type': 'EducationalOrganization',
        name: data.institution,
        url: data.url,
        sameAs: data.url,
      })),
    }),
    ...(knowsAbout.length > 0 && { knowsAbout }),
  };
}

function createBlog(context: SeoContext): JsonLDNode {
  const { author, ids, origin } = context;

  return {
    '@type': 'Blog',
    '@id': ids.blog,
    url: pageUrl(origin, 'blog'),
    name: `${author} - Blog`,
    inLanguage: 'en',
    isPartOf: ref(ids.website),
    author: ref(ids.person),
    publisher: ref(ids.person),
  };
}

function createWebPage(
  entity: CollectionEntry<'pages' | 'posts'>,
  context: SeoContext,
  overwrites: {
    type: string | string[];
    name: string;
    description: string;
    mainEntity?: unknown;
    about?: unknown;
  },
): JsonLDNode {
  const { canonical, ids, isHome } = context;
  const { type, name, description, mainEntity, about } = overwrites;

  return {
    '@type': type,
    '@id': ids.webPage,
    url: canonical,
    name,
    description,
    isPartOf: ref(ids.website),
    primaryImageOfPage: ref(ids.primaryImage),
    image: ref(ids.primaryImage),
    ...(isHome ? {} : { breadcrumb: ref(ids.breadcrumb) }),
    dateCreated: entity.data.createdAt.toISOString(),
    datePublished: (entity.data.publishedAt ?? entity.data.createdAt).toISOString(),
    dateModified: entity.data.updatedAt.toISOString(),
    inLanguage: 'en',
    ...(mainEntity !== undefined && { mainEntity }),
    ...(about !== undefined && { about }),
  };
}

function createImage(
  id: string,
  image: ImageMetadata,
  context: SeoContext,
  caption?: string,
): JsonLDNode {
  const url = absoluteUrl(image.src, context.origin);

  return {
    '@type': 'ImageObject',
    '@id': id,
    url,
    contentUrl: url,
    width: image.width,
    height: image.height,
    encodingFormat: `image/${image.format}`,
    ...(caption && { caption }),
  };
}

function createBreadCrumbs(url: URL, heading: string, canonical: string) {
  const segments = url.pathname.split('/').map((segment) => `/${segment}`);
  if (segments.length <= 1) return undefined;

  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: segments.map((segment, index) => {
      const last = index === segments.length - 1;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: last ? heading : URL_MAPPINGS[segment],
        item: `${url.origin}${segments
          .slice(0, index + 1)
          .join('')
          .replace('//', '/')}`,
      };
    }),
  };
}

import { type CollectionEntry, getEntries, getEntry } from 'astro:content';
import { URL_MAPPINGS } from '@constants';
import type { BaseMeta } from '@layouts/BaseLayout.astro';
import type { ArticleMeta } from '@layouts/meta/_Article.astro';
import type { JsonLD } from '@layouts/meta/_JsonLD.astro';
import type { OGMeta } from '@layouts/meta/_OpenGraph.astro';
import type { DeepPartial } from '@utils/deepPartial';
import { deepMerge } from '@utils/deepPartial';

export type MetaData = BaseMeta & {
  og: OGMeta;
  article?: ArticleMeta;
  jsonLdNodes: JsonLD;
};

export async function resolveSeo(
  entity: CollectionEntry<'pages' | 'posts'>,
  url: URL,
): Promise<MetaData> {
  const canonical = url.href;
  const isHome = url.pathname === '/';
  const [personal, siteData] = await Promise.all([
    getEntry('personal', 'personal'),
    getEntry('site', 'site'),
  ]);

  if (!personal || !siteData) {
    throw new Error(
      'SEO: missing `personal` and/or `site` singleton entry — cannot build page metadata.',
    );
  }

  const overwrites =
    entity.collection === 'posts' ? await resolvePost(entity) : resolvePage(entity, isHome);

  const author = `${personal.data.firstName} ${personal.data.lastName}`;
  const title = overwrites.title
    ? `${overwrites.title} | ${author}`
    : `${author} - ${personal.data.tagline}`;
  const description = overwrites.description ?? siteData.data.description;
  const image = siteData.data.socialPreview.image;
  const breadcrumbs = isHome
    ? undefined
    : createBreadCrumbs(url, overwrites.title ?? author, canonical);

  const defaults: MetaData = {
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
    jsonLdNodes: breadcrumbs ? [breadcrumbs] : [],
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

function resolvePage(entity: CollectionEntry<'pages'>, isHome: boolean): DeepPartial<MetaData> {
  return {
    title: isHome ? undefined : entity.data.title,
    description: entity.data.description,
    noIndex: entity.data.noIndex || !entity.data.isPublished,
    og: {
      type: isHome ? 'profile' : 'website',
    },
    jsonLdNodes: [createPage()],
  };
}

async function resolvePost(entity: CollectionEntry<'posts'>): Promise<DeepPartial<MetaData>> {
  const [tags, category] = await Promise.all([
    getEntries(entity.data.tags),
    getEntry(entity.data.category),
  ]);

  return {
    title: entity.data.title,
    description: entity.data.description,
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
      publishedAt: (entity.data.publishedAt ?? entity.data.createdAt).toISOString(),
      modifiedAt: entity.data.updatedAt.toISOString(),
      section: category.data.label,
      tags: tags.map((tag) => tag.data.label),
    },
    jsonLdNodes: [createPage(), createArticle()],
  };
}

function createPage(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
  };
}

function createArticle(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
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

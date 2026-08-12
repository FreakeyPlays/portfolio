import { join } from 'node:path';
import { getSite } from '@utils/site.ts';
import sharp from 'sharp';

const PUBLIC_DIR = 'public';

const MIME_TYPE_BY_FORMAT: Record<string, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
};

type ImageFacts = {
  width?: number;
  height?: number;
  type?: string;
};

const imageFacts = new Map<string, Promise<ImageFacts>>();

function readImageFacts(src: string): Promise<ImageFacts> {
  const cached = imageFacts.get(src);
  if (cached) return cached;

  const facts = sharp(join(PUBLIC_DIR, src))
    .metadata()
    .then(({ width, height, format }) => ({
      width,
      height,
      type: format ? MIME_TYPE_BY_FORMAT[format] : undefined,
    }))
    .catch(() => {
      console.warn(`[socialPreview] Could not read ${src}; emitting the card without image size.`);

      return {};
    });

  imageFacts.set(src, facts);

  return facts;
}

export type SocialImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
};

type PageContext = {
  pageType: 'website' | 'article';
};

export async function getSocialPreview(site: URL | undefined, { pageType }: PageContext) {
  const { socialPreview: config } = await getSite();

  const image: SocialImage = {
    src: new URL(config.image.src, site).toString(),
    alt: config.image.alt,
    ...(await readImageFacts(config.image.src)),
  };

  // `omit_empty_optional_fields` in the CMS config means these are either
  // absent or actually filled in, so there is nothing to trim away here.
  const { title, description, twitterHandle: handle } = config;

  return {
    image,
    og: {
      type: pageType,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
    twitter: {
      card: config.card === 'summary' ? ('summary' as const) : ('summary_large_image' as const),
      ...(handle ? { handle } : {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
  };
}

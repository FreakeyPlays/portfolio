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

export function socialImageType(format?: string) {
  return format ? MIME_TYPE_BY_FORMAT[format] : undefined;
}

export type SocialImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
};

export type SocialOverride = {
  title?: string;
  description?: string;
  image?: SocialImage;
};

type PageContext = {
  pageType: 'website' | 'article';
  override?: SocialOverride;
};

export async function getSocialPreview(
  site: URL | undefined,
  { pageType, override = {} }: PageContext,
) {
  const { socialPreview: config } = await getSite();

  const image =
    override.image ??
    ({
      src: new URL(config.image.src, site).toString(),
      alt: config.image.alt,
      ...(await readImageFacts(config.image.src)),
    } satisfies SocialImage);

  const title = override.title ?? config.title;
  const description = override.description ?? config.description;
  const handle = config.twitterHandle;

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

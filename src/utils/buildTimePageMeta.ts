import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';

const PAGES_DIR = 'src/content/pages';
const HOME_SLUG = 'home';

let buildDate: Date | null = null;

function getBuildDate(): Date {
  buildDate ??= new Date();

  return buildDate;
}

type PageMeta = {
  updatedAt?: Date;
  noIndex: boolean;
};

let pageMeta: Map<string, PageMeta> | null = null;

function readPageMeta(): Map<string, PageMeta> {
  if (pageMeta) return pageMeta;

  pageMeta = new Map();

  for (const file of readdirSync(PAGES_DIR, { recursive: true })) {
    const name = String(file);
    if (!name.endsWith('.mdx')) continue;

    const { frontmatter } = parseFrontmatter(readFileSync(join(PAGES_DIR, name), 'utf8'));
    const id = name.replace(/\.mdx$/, '');

    let updatedAt: Date | undefined;
    if (frontmatter.updatedAt) {
      const parsed = new Date(String(frontmatter.updatedAt));

      if (Number.isNaN(parsed.getTime())) {
        console.warn(`[pageMeta] ${name} has an unreadable updatedAt; using build time.`);
      } else {
        updatedAt = parsed;
      }
    }

    pageMeta.set(id, { updatedAt, noIndex: frontmatter.noIndex === true });
  }

  return pageMeta;
}

function slugFromURL(url: string): string {
  const { pathname } = new URL(url);

  return pathname.replace(/^\/+|\/+$/g, '') || HOME_SLUG;
}

export function getPageModifiedDate(slug: string): Date {
  return readPageMeta().get(slug)?.updatedAt ?? getBuildDate();
}

export function getPageModifiedDateTime(slug: string): string {
  return getPageModifiedDate(slug)
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z');
}

export function getLatestModifiedDate(): Date {
  const dates = [...readPageMeta().values()]
    .map((meta) => meta.updatedAt)
    .filter((date) => date !== undefined);

  if (dates.length === 0) return getBuildDate();

  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export function getModifiedDateForURL(url: string): Date {
  return getPageModifiedDate(slugFromURL(url));
}

export function isListedInSitemap(url: string): boolean {
  return readPageMeta().get(slugFromURL(url))?.noIndex !== true;
}

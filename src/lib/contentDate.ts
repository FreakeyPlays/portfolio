import { execFileSync } from 'node:child_process';

const CONTENT_PATHS = ['src/content', 'src/data', 'src/pages'];

let cached: Date | null = null;

/**
 * Timestamp of the newest commit touching content, for `sitemap lastmod` and
 * `ProfilePage.dateModified`.
 *
 * Falls back to the build time when git history is unavailable — a shallow
 * clone, a tarball deploy, or a build outside a repository. That fallback is
 * less accurate, so it is reported rather than applied silently.
 */
export function getContentModifiedDate(): Date {
  if (cached) return cached;

  try {
    const stdout = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...CONTENT_PATHS], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (stdout) {
      cached = new Date(stdout);
      return cached;
    }
    console.warn('[contentDate] No commits found for content paths; using build time.');
  } catch {
    console.warn('[contentDate] git unavailable; using build time for lastmod.');
  }

  cached = new Date();
  return cached;
}

/** `YYYY-MM-DD`, the form both schema.org dates and sitemap `lastmod` accept. */
export function getContentModifiedISODate(): string {
  return getContentModifiedDate().toISOString().slice(0, 10);
}

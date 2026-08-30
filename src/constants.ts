export const URL_MAPPINGS: Record<string, string> = {
  '/': 'Home',
  '/blog': 'Blog',
};

export const isProduction =
  process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH === 'master';

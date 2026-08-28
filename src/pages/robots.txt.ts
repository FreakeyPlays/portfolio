import { isProduction } from '@constants';
import type { APIRoute } from 'astro';

const allowed = `# I, for one, welcome our new robotic overlords

User-agent: *
Allow: /

Disallow: /admin/

Sitemap: https://chrismerck.dev/sitemap-index.xml
`;

const blocked = `User-agent: *
Disallow: /
`;

export const GET: APIRoute = () =>
  new Response(isProduction ? allowed : blocked, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

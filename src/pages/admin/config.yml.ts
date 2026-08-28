import type { APIRoute } from 'astro';
import config from './config.yml?raw';

export const GET: APIRoute = () =>
  new Response(config, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
    },
  });

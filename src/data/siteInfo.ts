import type { Image } from '@components/meta/SEO.astro';
import type { SocialLink } from './socialLinks';
import socialLinks from './socialLinks';

export type SiteInfo = {
  name: string;
  title: string;
  description: string;
  keywords?: string[];
  author: string;
  image: Image;
  socialLinks: SocialLink[];
};

const siteInfo: SiteInfo = {
  name: 'Christoph Merck',
  title: 'Frontend-Engineer Turning Ideas into Web Experiences',
  description:
    'Fullstack WebApp Engineer specializing in modern frontend frameworks. I build fast, scalable, and engaging user interfaces.',
  author: 'Christoph Merck',
  image: {
    src: '/og/default_og.png',
    alt: 'Christoph Merck - Developer Portfolio',
  },
  socialLinks: socialLinks,
};

export default siteInfo;

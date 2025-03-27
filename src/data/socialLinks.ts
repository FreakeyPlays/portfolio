export type SocialLink = {
  me?: string;
  /** Longer descriptive label, e.g. `"Join the Astro community on Discord"` */
  text: string;
  /** Short label with the name of the platform, e.g. `"Discord"`*/
  label: string;
  icon: string;
  href: string;
  /** Platform ID, e.g. `"discord"` */
  platform: string;
  footerOnly?: boolean;
};

const socialLinks: SocialLink[] = [
  {
    platform: 'bluesky',
    icon: '',
    me: 'https://bsky.app/profile/freakyplays.bsky.social',
    label: 'Bluesky',
    text: 'Follow me on Bluesky',
    href: 'https://bsky.app/profile/freakyplays.bsky.social',
  },
  {
    platform: 'github',
    icon: '',
    me: 'https://github.com/FreakeyPlays',
    label: 'GitHub',
    text: 'See my GitHub Projects',
    href: 'https://github.com/FreakeyPlays',
  },
  {
    platform: 'linkedin',
    icon: '',
    me: 'https://www.linkedin.com/in/christoph-merck',
    label: 'LinkedIn',
    text: 'Follow me on LinkedIn',
    href: 'https://www.linkedin.com/in/christoph-merck',
  },
];

export default socialLinks;

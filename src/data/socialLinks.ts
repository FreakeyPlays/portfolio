import BlueskyIcon from '../assets/icons/social/bluesky.svg';
import GitHubIcon from '../assets/icons/social/github.svg';
import LinkedInIcon from '../assets/icons/social/linkedin.svg';

export type SocialLink = {
  /** Longer descriptive label, e.g. `"Join the Astro community on Discord"` */
  text: string;
  /** Short label with the name of the platform, e.g. `"Discord"`*/
  label: string;
  icon: ((_props: astroHTML.JSX.SVGAttributes) => any) & ImageMetadata;
  href: string;
  footerOnly?: boolean;
};

const socialLinks: SocialLink[] = [
  {
    icon: GitHubIcon,
    label: 'GitHub',
    text: 'See my GitHub Projects',
    href: 'https://github.com/FreakeyPlays',
  },
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    text: 'Follow me on LinkedIn',
    href: 'https://www.linkedin.com/in/christoph-merck',
  },
  {
    icon: BlueskyIcon,
    label: 'Bluesky',
    text: 'Follow me on Bluesky',
    href: 'https://bsky.app/profile/freakyplays.bsky.social',
  },
];

export default socialLinks;

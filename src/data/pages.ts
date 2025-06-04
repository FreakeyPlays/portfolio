export type Page = {
  label: string;
  url: string;
  samePage: boolean;
};

export const pages: Page[] = [
  { label: 'about', url: '#about', samePage: true },
  { label: 'skills', url: '#skills', samePage: true },
  { label: 'career', url: '#career', samePage: true },
  { label: 'education', url: '#education', samePage: true },
  { label: 'projects', url: '#projects', samePage: true },
];

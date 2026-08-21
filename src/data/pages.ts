export type Page = {
  label: string;
  url: string;
  homeSection: boolean;
};

export const pages: Page[] = [
  { label: 'about', url: '/', homeSection: true },
  { label: 'skills', url: '#skills', homeSection: true },
  { label: 'career', url: '#career', homeSection: true },
  { label: 'education', url: '#education', homeSection: true },
  { label: 'projects', url: '#projects', homeSection: true },
];

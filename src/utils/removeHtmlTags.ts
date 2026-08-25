export const removeHtmlTags = (html: string): string => {
  return html
    .replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

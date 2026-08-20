import type { MarkdownHeading } from 'astro';

export interface TocEntry extends MarkdownHeading {
  children: TocEntry[];
}

export const buildTableOfContents = (
  headings: MarkdownHeading[],
  { minDepth = 2, maxDepth = 3 } = {},
): TocEntry[] => {
  const toc: TocEntry[] = [];
  const ancestors: TocEntry[] = [];

  for (const heading of headings) {
    if (heading.depth < minDepth || heading.depth > maxDepth) continue;

    const entry: TocEntry = { ...heading, children: [] };

    while (ancestors.length > 0 && (ancestors.at(-1)?.depth ?? 0) >= entry.depth) {
      ancestors.pop();
    }

    (ancestors.at(-1)?.children ?? toc).push(entry);
    ancestors.push(entry);
  }

  return toc;
};

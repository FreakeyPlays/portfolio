import type {} from '@astrojs/markdown-satteri';
import type { MarkdownHeading } from 'astro';
import Slugger from 'github-slugger';
import type { Heading, Nodes, Root } from 'mdast';
import { defineMdastPlugin, type MdastVisitorContext } from 'satteri';

export interface TocEntry extends MarkdownHeading {
  children: TocEntry[];
}

interface Options {
  minDepth?: number;
  maxDepth?: number;
}

function* walkHeadings(node: Readonly<Nodes>): Generator<Readonly<Heading>> {
  if (node.type === 'heading') yield node;
  if ('children' in node) {
    for (const child of node.children) yield* walkHeadings(child);
  }
}

export const mdastTableOfContentsPlugin = ({ minDepth = 2, maxDepth = 3 }: Options = {}) =>
  defineMdastPlugin({
    name: 'mdast-table-of-contents',
    after: (root: Readonly<Root>, context: MdastVisitorContext) => {
      if (context.data.astro === undefined) return;

      const slugger = new Slugger();
      const toc: TocEntry[] = [];
      const ancestors: TocEntry[] = [];

      for (const heading of walkHeadings(root)) {
        const text = context.textContent(heading);
        const slug = slugger.slug(text);

        if (heading.depth < minDepth || heading.depth > maxDepth) continue;

        const entry: TocEntry = { depth: heading.depth, slug, text, children: [] };

        while (ancestors.length > 0 && (ancestors.at(-1)?.depth ?? 0) >= entry.depth) {
          ancestors.pop();
        }

        (ancestors.at(-1)?.children ?? toc).push(entry);
        ancestors.push(entry);
      }

      context.data.astro.frontmatter.toc = toc;
    },
  });

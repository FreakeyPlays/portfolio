import type {} from '@astrojs/markdown-satteri';
import type { Root } from 'mdast';
import getReadingTime from 'reading-time';
import { defineMdastPlugin, type MdastVisitorContext } from 'satteri';

export const mdastReadingTimePlugin = defineMdastPlugin({
  name: 'mdast-reading-time',
  after: (root: Readonly<Root>, context: MdastVisitorContext) => {
    const textOnPage = context.textContent(root);
    const readingTime = getReadingTime(textOnPage);

    if (context.data.astro !== undefined) {
      context.data.astro.frontmatter.readingTime = Math.max(1, Math.round(readingTime.minutes));
      context.data.astro.frontmatter.wordCount = readingTime.words;
    }
  },
});

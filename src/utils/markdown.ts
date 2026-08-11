import { createMarkdownProcessor } from '@astrojs/markdown-remark';

/**
 * Renders a markdown CMS field to HTML.
 *
 * Fields like the education description are markdown widgets in the CMS, so
 * they can contain links that would otherwise print as raw `[text](url)`.
 * Astro only runs its markdown pipeline over collection *bodies*, not over
 * string fields, so the same processor is used here by hand.
 *
 * `@astrojs/markdown-remark` ships with Astro rather than being a direct
 * dependency, which is what the `shamefully-hoist` flag in `.npmrc` is for.
 */
let processor: ReturnType<typeof createMarkdownProcessor> | undefined;

export async function renderMarkdown(value: string): Promise<string> {
  processor ??= createMarkdownProcessor({});

  const { code } = await (await processor).render(value);

  return code;
}

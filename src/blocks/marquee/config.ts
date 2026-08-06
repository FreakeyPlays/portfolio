import type { EditorComponentDefinition } from '@sveltia/cms';

type MarqueeBlock = {
  categories: string[];
};

const MARQUEE_DEFAULTS: MarqueeBlock = {
  categories: [],
};

const MARQUEE_PATTERN = /^<Marquee\s+categories=\{(?<categories>\[[\s\S]*?])}\s*\/>$/m;

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function parseMarqueeBlock(match: RegExpMatchArray): MarqueeBlock {
  const categories = parseJSON<unknown[]>(match.groups?.categories, []);

  return {
    categories: categories
      .filter((category): category is string => typeof category === 'string')
      .map((category) => category.trim())
      .filter(Boolean),
  };
}

export function serializeMarqueeBlock({ categories }: MarqueeBlock): string {
  const cleaned = categories.map((category) => category.trim()).filter(Boolean);

  return `<Marquee categories={${JSON.stringify(cleaned)}} />`;
}

export const marqueeConfig: EditorComponentDefinition = {
  id: 'marquee',
  label: 'Icon Marquee',
  icon: 'linear_scale',
  mode: 'dialog',
  summary: '{{categories}}',
  fields: [
    {
      name: 'categories',
      label: 'Skill Categories',
      widget: 'relation',
      collection: 'skills',
      value_field: '{{slug}}',
      display_fields: ['category'],
      search_fields: ['category'],
      multiple: true,
      default: MARQUEE_DEFAULTS.categories,
      hint: 'One scrolling row per category, in the selected order. Drag to reorder.',
    },
  ],
  pattern: MARQUEE_PATTERN,
  fromBlock: (match) => parseMarqueeBlock(match),
  toBlock: (props) => serializeMarqueeBlock({ ...MARQUEE_DEFAULTS, ...props } as MarqueeBlock),
  toPreview: (props) => {
    const { categories } = { ...MARQUEE_DEFAULTS, ...props } as MarqueeBlock;

    return `<p>Icon Marquee: ${categories.join(', ')}</p>`;
  },
};

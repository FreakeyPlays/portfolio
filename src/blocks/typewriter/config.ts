import type { EditorComponentDefinition } from '@sveltia/cms';

type TypewriterBlock = {
  start: string;
  messages: string[];
  tagline: string;
};

const TYPEWRITER_DEFAULTS: TypewriterBlock = {
  start: "Hey, I'm",
  messages: ['Gay!'],
  tagline: "And I'm Proud!",
};

const TYPEWRITER_PATTERN =
  /^<Typewriter\s+start=\{(?<start>"(?:[^"\\]|\\.)*")}\s+messages=\{(?<messages>\[[\s\S]*?])}\s+tagline=\{(?<tagline>"(?:[^"\\]|\\.)*")}\s*\/>$/m;

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function parseTypewriterBlock(match: RegExpMatchArray): TypewriterBlock {
  const start = parseJSON(match.groups?.start, '').trim();
  const messages = parseJSON<unknown[]>(match.groups?.messages, []);
  const tagline = parseJSON(match.groups?.tagline, '');

  return {
    start: start || TYPEWRITER_DEFAULTS.start,
    tagline: tagline || TYPEWRITER_DEFAULTS.tagline,
    messages: messages
      .filter((message): message is string => typeof message === 'string')
      .map((message) => message.trim())
      .filter(Boolean),
  };
}

export function serializeTypewriterBlock({ start, messages, tagline }: TypewriterBlock): string {
  const cleaned = messages.map((message) => message.trim()).filter(Boolean);

  return `<Typewriter start={${JSON.stringify(start.trim())}} messages={${JSON.stringify(cleaned)}} tagline={${JSON.stringify(tagline.trim())}} />`;
}

export const typewriterConfig: EditorComponentDefinition = {
  id: 'typewriter',
  label: 'Typewriter',
  icon: 'keyboard',
	mode: "dialog",
	summary: "{{start}} {{messages.0}}\n{{tagline}}",
  fields: [
    {
      name: 'start',
      label: 'Starting Text',
      widget: 'string',
      default: TYPEWRITER_DEFAULTS.start,
    },
    {
      name: 'messages',
      label: 'Messages',
      label_singular: 'Message',
      widget: 'list',
      default: TYPEWRITER_DEFAULTS.messages,
      hint: 'Typed out one after another, in a loop. Drag to reorder.',
    },
    {
      name: 'tagline',
      label: 'Tagline',
      widget: 'string',
      default: TYPEWRITER_DEFAULTS.tagline,
    },
  ],
  pattern: TYPEWRITER_PATTERN,
  fromBlock: (match) => parseTypewriterBlock(match),
  toBlock: (props) => serializeTypewriterBlock({ ...TYPEWRITER_DEFAULTS, ...props }),
  toPreview: (props) => {
    const { start, messages, tagline } = { ...TYPEWRITER_DEFAULTS, ...props } as TypewriterBlock;
    const [first] = messages.map((message) => message.trim()).filter(Boolean);

    return `<h1>${start} ${first ?? ''}</h1><p>${tagline}</p>`;
  },
};

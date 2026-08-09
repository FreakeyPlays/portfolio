import type { EditorComponentDefinition } from '@sveltia/cms';

type ContactBlock = {
  label: string;
  additionalParameters: string;
};

const CONTACT_DEFAULTS: ContactBlock = {
  label: 'Get in touch',
  additionalParameters: '',
};

const CONTACT_PATTERN =
  /^<Contact\s+label=\{(?<label>"(?:[^"\\]|\\.)*")}(?:\s+additionalParameters=\{(?<additionalParameters>"(?:[^"\\]|\\.)*")})?\s*\/>$/m;

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function parseContactBlock(match: RegExpMatchArray): ContactBlock {
  const label = parseJSON(match.groups?.label, '').trim();
  const additionalParameters = parseJSON(match.groups?.additionalParameters, '').trim();

  return {
    label: label || CONTACT_DEFAULTS.label,
    additionalParameters,
  };
}

export function serializeContactBlock({ label, additionalParameters }: ContactBlock): string {
  const cleaned = additionalParameters.trim();
  const parametersProp = cleaned ? ` additionalParameters={${JSON.stringify(cleaned)}}` : '';

  return `<Contact label={${JSON.stringify(label.trim())}}${parametersProp} />`;
}

export const contactConfig: EditorComponentDefinition = {
  id: 'contact',
  label: 'Contact Button',
  icon: 'mail',
  mode: 'dialog',
  summary: '{{label}}',
  fields: [
    {
      name: 'label',
      label: 'Label',
      widget: 'string',
      default: CONTACT_DEFAULTS.label,
    },
    {
      name: 'additionalParameters',
      label: 'Additional Email Parameter',
      widget: 'string',
      required: false,
      default: CONTACT_DEFAULTS.additionalParameters,
      hint: 'Prefills subject or similar, for example subject=Hello&body=Hi. Leave empty for a plain mailto.',
    },
  ],
  pattern: CONTACT_PATTERN,
  fromBlock: (match) => parseContactBlock(match),
  toBlock: (props) => serializeContactBlock({ ...CONTACT_DEFAULTS, ...props } as ContactBlock),
  toPreview: (props) => {
    const { label, additionalParameters } = { ...CONTACT_DEFAULTS, ...props } as ContactBlock;

    return `<p>Contact Button: ${label}${additionalParameters ? ` (${additionalParameters})` : ''}</p>`;
  },
};

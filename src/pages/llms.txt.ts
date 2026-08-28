import { getCollection } from 'astro:content';
import { getLatestModifiedDate } from '@utils/buildTimePageMeta.ts';
import { formatMonthYear } from '@utils/dateFormat';
import { getSingelton } from '@utils/getSingelton';
import { byOrder } from '@utils/sorting';
import type { APIRoute } from 'astro';

const GERMAN_GRADE_SCALE = 'German scale, 1.0 is the best mark and 4.0 the pass mark';

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

const sentences = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const period = (startDate: Date, endDate?: Date) =>
  `${formatMonthYear(startDate)} to ${endDate ? formatMonthYear(endDate) : 'present'}`;

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'https://chrismerck.dev';

  const [person, profiles, career, education, projects, skills] = await Promise.all([
    getSingelton('personal'),
    getSingelton('socials'),
    getCollection('career', ({ data }) => !data.hidden),
    getCollection('education', ({ data }) => !data.hidden),
    getCollection('projects', ({ data }) => !data.hidden),
    getCollection('skills'),
  ]);

  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# ${person.data.firstName} ${person.data.lastName}`, '');
  push(`> ${person.data.bio.long}`, '');

  push(`${person.data.jobTitle}.`);
  push(
    `Based in ${[
      person.data.location.locality,
      person.data.location.region,
      person.data.location.country,
    ]
      .filter(Boolean)
      .join(', ')}.`,
  );
  if (person.data.workLocation.length)
    push(`Open to roles in ${person.data.workLocation.join(', ')}.`);
  if (person.data.languages.length)
    push(`Speaks ${person.data.languages.map(({ name }) => name).join(' and ')}.`);
  push('');

  const named = skills.flatMap(({ data }) =>
    data.skills.filter((skill) => !skill.hidden && skill.icon).map((skill) => skill.name),
  );
  if (named.length) push(`Skills: ${named.join(', ')}.`);
  push('');

  push(`Contact: ${person.data.email}`);
  push(`Last updated: ${getLatestModifiedDate().toISOString().slice(0, 10)}`, '');

  const ordered = [...projects].sort(byOrder);
  const projectLine = ({ data }: (typeof ordered)[number]) =>
    sentences(
      `- [${data.title}](${data.repositoryURL ?? data.deployedURL ?? `${origin}/#projects`}):`,
      `Status: ${data.state}.`,
      oneLine(data.description),
    );

  push('## Projects', '');
  push(...ordered.filter(({ data }) => data.state !== 'Planned').map(projectLine), '');

  push('## Career', '');
  for (const { data } of [...career].sort(byOrder)) {
    for (const job of data.jobs) {
      push(
        sentences(
          `- [${job.title}, ${data.company}](${data.url}):`,
          `${period(job.startDate, job.endDate)}, ${data.location}.`,
          oneLine(job.description),
          job.technologies?.length ? `Technologies: ${job.technologies.join(', ')}.` : undefined,
        ),
      );
    }
  }
  push('');

  push('## Education', '');
  for (const { data, body } of [...education].sort(byOrder)) {
    push(
      sentences(
        `- [${data.degree}, ${data.institution}](${data.url ?? `${origin}/#education`}):`,
        `${data.level}, ${period(data.startDate, data.endDate)}, ${data.location}.`,
        data.grade !== undefined && `Grade ${data.grade} (${GERMAN_GRADE_SCALE}).`,
        body && oneLine(body),
      ),
    );
  }
  push('');

  push('## Profiles', '');
  for (const { label, href } of profiles.data) {
    push(`- [${label}](${href})`);
  }
  if (person.data.orcid) {
    push(`- [ORCID](${person.data.orcid})`);
  }

  return new Response(
    `${out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()}\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
};

import { getCollection } from 'astro:content';
import identity from '@data/identity.json';
import siteInfo from '@data/siteInfo.json';
import socialLinks from '@data/socialLinks.json';
import { formatMonthYear } from '@utils/date.ts';
import type { APIRoute } from 'astro';
import { getLatestModifiedDate } from '@utils/buildTimePageMeta.ts';

const GERMAN_GRADE_SCALE = 'German scale, 1.0 is the best mark and 4.0 the pass mark';

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

const sentences = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const period = (startDate: Date, endDate?: Date) =>
  `${formatMonthYear(startDate)} to ${endDate ? formatMonthYear(endDate) : 'present'}`;

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'https://chrismerck.dev';

  const [career, education, projects, skills] = await Promise.all([
    getCollection('career', ({ data }) => data.isPublished),
    getCollection('education', ({ data }) => data.isPublished),
    getCollection('projects', ({ data }) => data.isPublished),
    getCollection('skills'),
  ]);

  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# ${siteInfo.fullName}`, '');
  push(`> ${identity.description}`, '');

  push(`${identity.jobTitle}.`);
  push(
    `Based in ${[identity.address.locality, identity.address.region, identity.address.country]
      .filter(Boolean)
      .join(', ')}.`,
  );
  if (identity.workLocation.length) push(`Open to roles in ${identity.workLocation.join(', ')}.`);
  if (identity.knowsLanguage.length)
    push(`Speaks ${identity.knowsLanguage.map(({ name }) => name).join(' and ')}.`);
  if (identity.awards.length) push(`Awards: ${identity.awards.join(', ')}.`);
  if (identity.memberOf.length) push(`Member of ${identity.memberOf.join(', ')}.`);
  push('');

  const named = skills.flatMap(({ data }) =>
    data.skills.filter((skill) => skill.isPublished && skill.image).map((skill) => skill.name),
  );
  if (named.length) push(`Skills: ${named.join(', ')}.`);
  push('');

  if (identity.email) push(`Contact: ${identity.email}`);
  push(`Last updated: ${getLatestModifiedDate().toISOString().slice(0, 10)}`, '');

  const ordered = [...projects].sort((a, b) => a.data.order - b.data.order);
  const projectLine = ({ data }: (typeof ordered)[number]) =>
    sentences(
      `- [${data.title}](${data.repositoryURL}):`,
      `Status: ${data.state}.`,
      oneLine(data.description),
    );

  push('## Projects', '');
  push(...ordered.filter(({ data }) => data.state !== 'Planned').map(projectLine), '');

  const latestStart = (jobs: { startDate: Date }[]) =>
    jobs.reduce((latest, job) => (job.startDate > latest ? job.startDate : latest), new Date(0));

  push('## Career', '');
  for (const { data } of [...career].sort(
    (a, b) => latestStart(b.data.jobs).getTime() - latestStart(a.data.jobs).getTime(),
  )) {
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
  for (const { data } of [...education].sort(
    (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime(),
  )) {
    push(
      sentences(
        `- [${data.degree}, ${data.institution}](${data.url ?? `${origin}/#education`}):`,
        `${data.level}, ${period(data.startDate, data.endDate)}, ${data.location}.`,
        data.grade !== undefined && `Grade ${data.grade} (${GERMAN_GRADE_SCALE}).`,
        oneLine(data.description),
      ),
    );
  }
  push('');

  push('## Profiles', '');
  for (const { label, href } of socialLinks) {
    if (href.startsWith('http')) push(`- [${label}](${href})`);
  }
	if(identity.orcid) {
		push(`- [ORCID](${identity.orcid})`)
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

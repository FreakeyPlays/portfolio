const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const dayMontYear = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDayMonthYear(date: Date): string {
  return dayMontYear.format(date);
}

export function formatMonthYear(date: Date): string {
  return monthYear.format(date);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

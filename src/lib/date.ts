const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatMonthYear(date: Date): string {
  return monthYear.format(date);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

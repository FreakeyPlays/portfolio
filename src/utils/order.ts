export const byOrder = <T extends { data: { order?: number } }>(a: T, b: T) =>
  (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER);

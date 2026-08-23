export const byOrder = <T extends { data: { order?: number } }>(a: T, b: T) =>
  (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER);

export const byOrderInverse = <T extends { data: { order?: number } }>(a: T, b: T) =>
  (b.data.order ?? Number.MAX_SAFE_INTEGER) - (a.data.order ?? Number.MAX_SAFE_INTEGER);

export type DeepPartial<Thing> = Thing extends () => void
  ? Thing
  : Thing extends Array<infer InferredArrayMember>
    ? DeepPartialArray<InferredArrayMember>
    : Thing extends object
      ? DeepPartialObject<Thing>
      : Thing | undefined;
export type DeepPartialArray<Thing> = Array<DeepPartial<Thing>>;
export type DeepPartialObject<Thing> = { [K in keyof Thing]?: DeepPartial<Thing[K]> };

export function deepMerge<T>(base: T, overrides: DeepPartial<T>): T {
  return merge(base, overrides) as T;
}

function merge(base: unknown, override: unknown): unknown {
  if (override === undefined) return base;
  if (Array.isArray(base) && Array.isArray(override)) return [...base, ...override];

  if (isPlainObject(base) && isPlainObject(override)) {
    const merged: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = merge(merged[key], value);
    }
    return merged;
  }

  return override;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

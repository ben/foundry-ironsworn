/** Test if an enum-like object has a given value. */
export function enumHas(enumLike: Record<string, unknown>, value: unknown) {
  return Object.values(enumLike).includes(value)
}

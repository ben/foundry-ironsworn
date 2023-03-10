type CssCustomProperty = `--${string}`

/**
 *
 * @param property The CSS variable to be read.
 * @param element The element. Defaults to the top level `.system-foundry-ironsworn` element (and failing that, the documentElement).
 * @template TValue The expected type of the value.
 */
export function getCssVar<TValue extends string = string>(
  property: CssCustomProperty,
  element: HTMLElement
) {
  // console.log('received element', element)
  const value = getComputedStyle(element).getPropertyValue(property).trim()
  return value as TValue
}

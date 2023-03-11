type CssCustomProperty = `--${string}`

/**
 *
 * @param property The CSS variable to be read.
 * @param element The element. Defaults to the top level `.system-foundry-ironsworn` element.
 * @template TValue The expected type of the value.
 */
export function getCssVar<TValue extends string = string>(
  property: CssCustomProperty,
  element?: HTMLElement
) {
  // console.log('received element', element)
  if (!element)
    element = document.documentElement.querySelector(
      '.system-foundry-ironsworn'
    ) as HTMLElement
  const value = getComputedStyle(element).getPropertyValue(property).trim()
  return value as TValue
}

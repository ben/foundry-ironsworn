/**
 * Hooks to adapt the SVG sprite sheet for compatibility with modules like "PopOut!"
 */
export function registerIconHooks() {
	Hooks.on(
		'PopOut:loaded',
		/**
		 * @param app The foundry application being popped out.
		 * @param node The html element of the application after it has been moved to the new window.
		 */
		(app: Application, node: HTMLElement) => {
			const popOutBody = (node.getRootNode() as HTMLElement)
				.firstElementChild as HTMLBodyElement

			const popOutSprites = CONFIG.IRONSWORN.sprites.cloneNode(true)

			popOutBody.appendChild(popOutSprites)
		}
	)
}

const SPRITE_SHEET_ID = 'ironsworn-sprites'

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

			// Just moving the node with element.append() won't work -- the main window still needs to use the sprite map. So, we clone the SVG element and append it instead.
			const sprites = document.getElementById(SPRITE_SHEET_ID)

			if (sprites == null)
				throw new Error(`Unable to find #${SPRITE_SHEET_ID} element.`)

			popOutBody.appendChild(sprites.cloneNode(true))
		}
	)
}

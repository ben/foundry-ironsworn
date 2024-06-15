import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/_irontheme.scss'
import '../../styles/_ironcolor/zinc.scss'
import '../../styles/_ironcolor/phosphor.scss'
import '../../styles/_ironcolor/oceanic.scss'

export const PREFIX = 'ironcolor__'
const tinyMceCssPath =
	'/systems/foundry-ironsworn/styles/starforged-tinymce.css'

export function colorSchemeSetup() {
	$(document.body).addClass(IronswornSettings.classes.join(' '))

	if (IronswornSettings.get('color-scheme') === 'phosphor') {
		// TODO: figure out a way to automate this without specifying for every single color scheme.
		;(<string[]>CONFIG.TinyMCE.content_css)?.push(tinyMceCssPath)
	}
}

/**
 * Instantly updates the client's color scheme without reloading.
 */
export function updateColorScheme(
	newColorScheme: ClientSettings.Values['foundry-ironsworn.color-scheme']
) {
	const colorSchemes = Object.keys(
		game.settings.settings.get('foundry-ironsworn.color-scheme')
			?.choices as unknown as Record<string, unknown>
	)

	const classesToRemove = colorSchemes.map((str) => `${PREFIX}${str}`)

	const toUpdate = [document.body]

	// FVTT module: PopOut!
	if (game.modules.get('popout')?.active != null) {
		// @ts-expect-error
		const PopOut = PopoutModule.singleton as any
		const popOuts = PopOut.poppedOut as Map<string, { window: Window | null }>

		for (const [, { window }] of popOuts) {
			if (window?.document != null) {
				toUpdate.push(window.document?.body)
			}
		}
	}
	if (CONFIG.TinyMCE.content_css != null) {
		if (newColorScheme === 'phosphor') {
			;(<string[]>CONFIG.TinyMCE.content_css)?.push(tinyMceCssPath)
		} else {
			// TODO: figure out a way to automate this without specifying for every single color scheme.
			CONFIG.TinyMCE.content_css = (
				CONFIG.TinyMCE.content_css as string[]
			).filter((str) => str !== tinyMceCssPath)
		}
	}

	$(toUpdate)
		.removeClass(classesToRemove.join(' '))
		.addClass(`${PREFIX}${newColorScheme}`)
}

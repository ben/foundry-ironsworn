import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/themes/classic.less'
import '../../styles/themes/phosphor.less'

export function themeSetup() {
	const colorScheme = IronswornSettings.get('theme-color-scheme')

	$(document.body).addClass(IronswornSettings.colorScheme)

	if (colorScheme === 'phosphor') {
		// TODO decouple font from colour scheme. should it be part of decoration style?
		;(<string[]>CONFIG.TinyMCE.content_css)?.push(
			'/systems/foundry-ironsworn/styles/starforged-tinymce.css'
		)
	}
}

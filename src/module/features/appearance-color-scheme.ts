import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/themes/classic.less'
import '../../styles/themes/phosphor.less'

export function colorSchemeSetup() {
	const colorScheme = IronswornSettings.get('color-scheme')

	$(document.body).addClass(IronswornSettings.colors)

	if (colorScheme === 'phosphor') {
		// TODO: figure out a way to automate this without calling it out for every single theme.
		;(<string[]>CONFIG.TinyMCE.content_css)?.push(
			'/systems/foundry-ironsworn/styles/starforged-tinymce.css'
		)
	}
}

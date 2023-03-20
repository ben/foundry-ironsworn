import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/_irontheme.scss'
import '../../styles/_ironcolor/classic.scss'
import '../../styles/_ironcolor/phosphor.scss'

export function colorSchemeSetup() {
	$(document.body).addClass(IronswornSettings.classes.join(' '))

	if (IronswornSettings.get('color-scheme') === 'phosphor') {
		// TODO: figure out a way to automate this without calling it out for every single theme.
		;(<string[]>CONFIG.TinyMCE.content_css)?.push(
			'/systems/foundry-ironsworn/styles/starforged-tinymce.css'
		)
	}
}

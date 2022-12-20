import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.scss'
import '../../styles/themes/ironsworn.scss'
import '../../styles/themes/starforged.scss'

export function themeSetup() {
  const currentTheme = IronswornSettings.get('theme')

  $(document.body).addClass(`theme-${currentTheme}`)

  if (currentTheme === 'starforged') {
    ;(<string[]>CONFIG.TinyMCE.content_css)?.push(
      '/systems/foundry-ironsworn/styles/starforged-tinymce.css'
    )
  }
}

import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/themes/ironsworn.less'
import '../../styles/themes/starforged.less'

export function themeSetup() {
  const currentTheme = IronswornSettings.theme

  $(document.body).addClass(`theme-${currentTheme}`)

  if (currentTheme === 'starforged') {
    ;(<string[]>CONFIG.TinyMCE.content_css)?.push(
      '/systems/foundry-ironsworn/styles/starforged-tinymce.css'
    )
  }
}

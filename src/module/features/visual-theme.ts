import { IronswornSettings } from '../helpers/settings'
import '../../styles/themes/ironsworn.less'
import '../../styles/themes/starforged.less'

export function themeSetup() {
  const currentTheme = IronswornSettings.theme

  $(document.body).addClass(`theme-${currentTheme}`)

  if (currentTheme === 'starforged') {
    CONFIG.TinyMCE.content_css =
      '/systems/foundry-ironsworn/styles/starforged-tinymce.css'
  }
}

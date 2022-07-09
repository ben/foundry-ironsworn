import { IronswornSettings } from '../helpers/settings'

export function themeSetup() {
  const currentTheme = IronswornSettings.theme

  if (currentTheme === 'starforged') {
    CONFIG.TinyMCE.content_css =
      '/systems/foundry-ironsworn/styles/starforged-tinymce.css'
  }

  // require(`../../styles/themes/${currentTheme}.less`)
}

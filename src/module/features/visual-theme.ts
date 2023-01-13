import { IronswornSettings } from '../helpers/settings'

import 'styles:styles.scss'

// FIXME: import theme names from the sass sheet as a map, so that all theme config is done there

export function themeSetup() {
  const currentTheme = IronswornSettings.get('theme')

  $(document.body).addClass(`theme-${currentTheme}`)

  if (currentTheme === 'starforged') {
    ;(<string[]>CONFIG.TinyMCE.content_css)?.push(
      // FIXME: do this in a nice sass sheet and import it after parsing
      '/systems/foundry-ironsworn/styles/starforged-tinymce.css'
    )
  }
}

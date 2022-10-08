import progressPageVue from '../vue/components/progress-page.vue'
import { VueSheetRenderHelperOptions } from '../vue/vue-render-helper'
import { VueJournalPageSheet } from '../vue/vuejournalpagesheet'

export class JournalProgressPageSheet extends JournalPageSheet {
  static get defaultOptions() {
    const options = super.defaultOptions
    options.classes.push('progress')
    return options
  }

  get template() {
    return 'systems/foundry-ironsworn/templates/journal/progress.hbs'
  }

  get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
    return {
      components: { 'progress-page': progressPageVue },
    }
  }
}

import { VueApplication } from './vueapp'
import { starforged } from 'dataforged'
import sfTruthsVue from '../vue/sf-truths.vue'

export class SFSettingTruthsDialogVue extends VueApplication {
  constructor() {
    super({})
  }

  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
      template: 'systems/foundry-ironsworn/templates/sf-truths-vue.hbs',
      id: 'setting-truths-dialog',
      resizable: true,
      width: 600,
      height: 700,
    })
  }

  async getVueData(): Promise<object> {
    return {
      truths: starforged['Setting Truths'],
    }
  }

  getComponents(): { [k: string]: any } {
    return {
      'sf-truths': sfTruthsVue,
    }
  }

  activateVueListeners(html: JQuery<HTMLElement>, repeat?: boolean): void {
    super.activateVueListeners(html, repeat)
    // this.vueRoot?.$on('submit', async (content) => {
    // const journal = await JournalEntry.create({
    //   name: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
    //   content,
    // })
    // journal?.sheet?.render(true)
    //   this.close()
    // })
  }
}

import { VueApplication } from '../../vue/vueapp'
import editSectorVue from '../../vue/edit-sector.vue'

export class EditSectorDialog extends VueApplication {
  constructor(protected sceneId: string) {
    super()
  }

  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.Sector'),
      template: 'systems/foundry-ironsworn/templates/edit-sector.hbs',
      id: 'edit-sector-dialog',
      resizable: true,
      left: 115,
      top: 60,
      width: 400,
      height: 200,
    })
  }

  async getVueData(): Promise<object> {
    return { sceneId: this.sceneId }
  }

  getComponents(): { [k: string]: any } {
    return { 'edit-sector': editSectorVue }
  }
}

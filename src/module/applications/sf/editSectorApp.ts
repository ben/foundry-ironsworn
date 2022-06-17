import { VueApplication } from '../vueapp'

export class EditSectorDialog extends VueApplication {
  constructor(protected sceneId: string) {
    super({})
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

  getData(options) {
    const data: any = super.getData(options)

    data.sceneId = this.sceneId
    console.log({ data })

    return data
  }
}

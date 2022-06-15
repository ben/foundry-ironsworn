import { IronswornSettings } from '../../helpers/settings'
import { IronswornVueActorSheet } from '../vueactorsheet'

export class FoeSheet extends IronswornVueActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [
        'ironsworn',
        'sheet',
        'shared',
        `theme-${IronswornSettings.theme}`,
      ],
      width: 400,
      height: 500,
      template: 'systems/foundry-ironsworn/templates/actor/foe.hbs',
      submitOnClose: true,
      submitOnChange: true,
    })
  }

  getData() {
    let data: any = super.getData()

    // Allow every itemtype to add data to the actorsheet
    for (const itemType of CONFIG.IRONSWORN.itemClasses) {
      data = itemType.getActorSheetData(data, this)
    }

    data.actor = this.actor.toObject(false)

    return data
  }

  _getHeaderButtons() {
    return [
      {
        class: 'ironsworn-toggle-edit-mode',
        label: 'Edit',
        icon: 'fas fa-edit',
        onclick: () => {
          const item = this.actor.items.find((x) => x.type === 'progress')
          item?.sheet?.render(true)
        },
      },
      ...super._getHeaderButtons(),
    ]
  }
}

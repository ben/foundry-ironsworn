/**
 * A Foundry implementation of the Ironsworn family of systems, by Shawn Tomkin
 */

import { IRONSWORN } from './config'
import { IronswornActor } from './module/actor/actor'
import { IronswornCharacterSheet } from './module/actor/sheets/charactersheet'
import { IronswornHandlebarsHelpers } from './module/helpers/handlebars'
import { IronswornSettings } from './module/helpers/settings'
import { TemplatePreloader } from './module/helpers/templatepreloader'
import { AssetSheet } from './module/item/asset/assetsheet'
import { BondsetSheet } from './module/item/bondset/bondsetsheet'
import { IronswornItem } from './module/item/item'
import { MoveSheet } from './module/item/move/movesheet'
import { ProgressSheet } from './module/item/progress/progresssheet'
import { VowSheet } from './module/item/vow/vowsheet'

import './styles/ironsworn.less'

Hooks.once('init', async () => {
  console.log('Ironsworn | initializing system')

  CONFIG.IRONSWORN = IRONSWORN

  // Define custom Entity classes
  CONFIG.Actor.entityClass = IronswornActor
  CONFIG.Item.entityClass = IronswornItem

  // CONFIG.RollTable.resultTemplate =
  //   'systems/foundry-ironsworn/templates/chat/table-draw.hbs'

  // Turn off Foundry defaults
  Actors.unregisterSheet('core', ActorSheet)
  Items.unregisterSheet('core', ItemSheet)

  // Register our own sheets
  Actors.registerSheet('ironsworn', IronswornCharacterSheet, {
    types: ['character'],
    makeDefault: true,
  })

  Items.registerSheet('ironsworn', AssetSheet, {
    types: ['asset'],
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', BondsetSheet, {
    types: ['bondset'],
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', MoveSheet, {
    types: ['move'],
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', ProgressSheet, {
    types: ['progress'],
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', VowSheet, {
    types: ['vow'],
    makeDefault: true,
  })

  // Preload all needed templates
  await TemplatePreloader.preloadHandlebarsTemplates()

  // Register Handlebars helpers
  IronswornHandlebarsHelpers.registerHelpers()

  IronswornSettings.registerSettings()
})

Hooks.once('setup', () => {
  Roll.prototype.render = async function (chatOptions = {}) {
    const template = 'systems/foundry-ironsworn/templates/chat/roll.hbs'
    chatOptions = mergeObject(
      {
        user: game?.user?.id,
        flavor: null,
        template: template,
        blind: false,
      },
      chatOptions
    )
    const isPrivate = chatOptions.isPrivate
    // Execute the roll, if needed
    if (!this._evaluated) await this.evaluate()
    // Define chat data
    const chatData = {
      formula: isPrivate ? '???' : this.formula,
      roll: this, // this is new
      flavor: isPrivate ? null : chatOptions.flavor,
      user: chatOptions.user,
      tooltip: isPrivate ? '' : await this.getTooltip(),
      total: isPrivate ? '?' : Math.round(this.total * 100) / 100,
    }
    // Render the roll display template
    return renderTemplate(chatOptions.template || template, chatData)
  }
})

/* -------------------------------- */
/*	Webpack HMR                     */
/* -------------------------------- */
if (module.hot) {
  module.hot.accept()

  if (module.hot.status() === 'apply') {
    for (const template in _templateCache) {
      if (Object.prototype.hasOwnProperty.call(_templateCache, template)) {
        delete _templateCache[template]
      }
    }

    TemplatePreloader.preloadHandlebarsTemplates().then(() => {
      for (const application in ui.windows) {
        if (Object.prototype.hasOwnProperty.call(ui.windows, application)) {
          ui.windows[application].render(true)
        }
      }
    })
  }
}

/**
 * A Foundry implementation of the Ironsworn family of systems, by Shawn Tomkin
 */

import { IronswornActor } from "./module/actor/actor"
import { IronswornActorSheet } from "./module/actor/sheets/actor-sheet"
import { importFromDatasworn } from "./module/datasworn"
import { IronswornHandlebarsHelpers } from "./module/helpers/handlebars"
import { IronswornItem } from "./module/item/item"
import { IronswornItemSheet } from "./module/item/sheets/item-sheet"
import "./styles/ironsworn.less"

Hooks.once('init', async () => {
  console.log('Ironsworn | initializing system')

  // Define custom Entity classes
  CONFIG.Actor.entityClass = IronswornActor
  CONFIG.Item.entityClass = IronswornItem
//   TODO: CONFIG.Dice.template = 'systems/foundry-ironsworn/templates/chat/roll.hbs'
  // CONFIG.RollTable.resultTemplate =
  //   'systems/foundry-ironsworn/templates/chat/table-draw.hbs'

  // Turn off Foundry defaults
  Actors.unregisterSheet('core', ActorSheet)
  Items.unregisterSheet('core', ItemSheet)

  // Register our own sheets
  Actors.registerSheet('ironsworn', IronswornActorSheet, {
    // types: [],
    makeDefault: true
  })
  Items.registerSheet('ironsworn', IronswornItemSheet, {
    // types: [],
    makeDefault: true
  })

  // Register Handlebars helpers
  IronswornHandlebarsHelpers.registerHelpers()

  // Some handy globals
  game.Ironsworn = {
    importFromDatasworn
  }
})

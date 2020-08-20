/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { IronswornActor } from './actor.js'
import { IronswornItemSheet } from './item-sheet.js'
import { IronswornActorSheet } from './actor-sheet.js'

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  console.log(`Initializing Ironsworn System`)

  // Define custom Entity classes
  CONFIG.Actor.entityClass = IronswornActor

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('ironsworn', IronswornActorSheet, { makeDefault: true })
  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('ironsworn', IronswornItemSheet, { makeDefault: true })

  // Register system settings
  game.settings.register('ironsworn', 'macroShorthand', {
    name: 'SETTINGS.SimpleMacroShorthandN',
    hint: 'SETTINGS.SimpleMacroShorthandL',
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  })
})

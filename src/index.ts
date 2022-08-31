/**
 * A Foundry implementation of the Ironsworn family of systems, by Shawn Tomkin
 */

import { IRONSWORN } from './config'
import { IronswornActor } from './module/actor/actor'
import { IronswornCharacterSheetV2 } from './module/actor/sheets/charactersheet-v2'
import { IronswornCompactCharacterSheet } from './module/actor/sheets/compactsheet'
import { FoeSheet } from './module/actor/sheets/foesheet'
import { StarforgedCharacterSheet } from './module/actor/sheets/sf-charactersheet'
import { StarforgedLocationSheet } from './module/actor/sheets/sf-locationsheet'
import { IronswornSharedSheetV2 } from './module/actor/sheets/sharedsheet-v2'
import { IronswornSiteSheetV2 } from './module/actor/sheets/sitesheet-v2'
import { StarshipSheet } from './module/actor/sheets/starshipsheet'
import { CreateActorDialog } from './module/applications/createActorDialog'
import { FirstStartDialog } from './module/applications/firstStartDialog'
import { IronswornChatCard } from './module/chat/cards'
import { registerChatAlertHooks } from './module/features/chat-alert'
import { registerCompendiumCategoryHook } from './module/features/compendium-categories'
import { registerDragAndDropHooks } from './module/features/drag-and-drop'
import { primeCommonPackCaches } from './module/features/pack-cache'
import { activateSceneButtonListeners } from './module/features/sceneButtons'
import { runStartupMacro } from './module/features/startup-macro'
import { registerTokenHUDButtons } from './module/features/tokenRotateButtons'
import { themeSetup } from './module/features/visual-theme'
import { patchZIndex } from './module/features/z-index'
import { IronswornHandlebarsHelpers } from './module/helpers/handlebars'
import { runDataMigrations } from './module/helpers/migrations'
import { IronswornSettings } from './module/helpers/settings'
import { AssetSheet } from './module/item/asset/assetsheet'
import { AssetSheetV2 } from './module/item/asset/assetsheet-v2'
import { BondsetSheet } from './module/item/bondset/bondsetsheet'
import { BondsetSheetV2 } from './module/item/bondset/bondsetsheet-v2'
import { DelveThemeOrDomainSheet } from './module/item/delve-theme-domain/delvethemeordomainsheet'
import { IronswornItem } from './module/item/item'
import { MoveSheet } from './module/item/move/movesheet'
import { SFMoveSheet } from './module/item/move/sfmovesheet'
import { ProgressSheet } from './module/item/progress/progresssheet'
import { ProgressSheetV2 } from './module/item/progress/progresssheet-v2'

declare global {
  interface LenientGlobalVariableTypes {
    game: never // the type doesn't matter
  }
}

Hooks.once('init', async () => {
  console.log('Ironsworn | initializing system')

  // Bootstrap settings and pull in theme
  IronswornSettings.registerSettings()

  // Theme configuration
  themeSetup()

  CONFIG.IRONSWORN = IRONSWORN

  // Define custom Entity classes
  CONFIG.Actor.documentClass = IronswornActor
  CONFIG.Item.documentClass = IronswornItem

  // CONFIG.RollTable.resultTemplate =
  //   'systems/foundry-ironsworn/templates/chat/table-draw.hbs'

  // Turn off Foundry defaults
  Actors.unregisterSheet('core', ActorSheet)
  Items.unregisterSheet('core', ItemSheet)

  // Register our own sheets
  Actors.registerSheet('ironsworn', IronswornCharacterSheetV2, {
    label: 'Ironsworn character sheet',
    types: ['character'],
    makeDefault: true,
  })
  Actors.registerSheet('ironsworn', StarforgedCharacterSheet, {
    label: 'Starforged character sheet',
    types: ['character'],
  })
  Actors.registerSheet('ironsworn', IronswornCompactCharacterSheet, {
    label: 'Compact sheet',
    types: ['character'],
  })

  Actors.registerSheet('ironsworn', IronswornSharedSheetV2, {
    types: ['shared'],
    label: 'Shared sheet',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', FoeSheet, {
    types: ['foe'],
    label: 'Foe Sheet',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', StarshipSheet, {
    types: ['starship'],
    label: 'Starship sheet',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', StarforgedLocationSheet, {
    types: ['location'],
    label: 'Starforged Location Sheet',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', IronswornSiteSheetV2, {
    types: ['site'],
    label: 'Site sheet',
    makeDefault: true,
  })

  Items.registerSheet('ironsworn', AssetSheetV2, {
    types: ['asset'],
    label: 'Asset sheet v2',
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', AssetSheet, {
    types: ['asset'],
    label: 'Asset sheet',
  })

  Items.registerSheet('ironsworn', BondsetSheetV2, {
    types: ['bondset'],
    label: 'Bondset sheet v2',
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', BondsetSheet, {
    types: ['bondset'],
    label: 'Bondset sheet',
  })

  Items.registerSheet('ironsworn', MoveSheet, {
    types: ['move'],
    label: 'Move sheet',
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', SFMoveSheet, {
    types: ['sfmove'],
    label: 'Starforged move sheet',
  })
  Items.registerSheet('ironsworn', DelveThemeOrDomainSheet, {
    types: ['delve-theme', 'delve-domain'],
    label: 'Delve Theme/Domain Sheet',
    makeDefault: true,
  })

  Items.registerSheet('ironsworn', ProgressSheetV2, {
    types: ['vow', 'progress'],
    label: 'Progress sheet v2',
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', ProgressSheet, {
    types: ['vow', 'progress'],
    label: 'Progress Sheet',
  })

  // Register Handlebars helpers
  IronswornHandlebarsHelpers.registerHelpers()
  IronswornChatCard.registerHooks()
  patchZIndex()
  registerCompendiumCategoryHook()
  registerTokenHUDButtons()
  activateSceneButtonListeners()
})

Hooks.once('ready', async () => {
  await runDataMigrations()

  registerDragAndDropHooks()
  registerChatAlertHooks()
  runStartupMacro()

  CONFIG.IRONSWORN.applications.createActorDialog = new CreateActorDialog({})
  FirstStartDialog.maybeShow()

  // Pre-load all the oracles
  await primeCommonPackCaches()
})

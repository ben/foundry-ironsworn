/**
 * A Foundry implementation of the Ironsworn family of systems, by Shawn Tomkin
 */

import { merge } from 'lodash'
import { IRONSWORN } from './config'
import { IronswornActor } from './module/actor/actor'
import { IronswornCharacterSheetV2 } from './module/actor/sheets/charactersheet-v2'
import { IronswornCompactCharacterSheet } from './module/actor/sheets/compactsheet'
import { FoeSheet } from './module/actor/sheets/foesheet'
import { StarforgedCharacterSheet } from './module/actor/sheets/sf-charactersheet'
import { StarforgedLocationSheet } from './module/actor/sheets/sf-locationsheet'
import { IronswornSharedSheetV2 } from './module/actor/sheets/sharedsheet-v2'
import { IronswornSiteSheet } from './module/actor/sheets/sitesheet'
import { StarshipSheet } from './module/actor/sheets/starshipsheet'
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
import { BondsetSheetV2 } from './module/item/bondset/bondsetsheet-v2'
import { DelveThemeOrDomainSheet } from './module/item/delve-theme-domain/delvethemeordomainsheet'
import { IronswornItem } from './module/item/item'
import { SFMoveSheet } from './module/item/move/sfmovesheet'
import { ProgressSheetV2 } from './module/item/progress/progresssheet-v2'
import { IronswornJournalPage } from './module/journal/journal-entry-page'
import { JournalProgressPageSheet } from './module/journal/sheet/progress-page'
import { TruthJournalPageSheet } from './module/journal/truth-page'

import 'virtual:svg-icons-register'

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
  CONFIG.JournalEntryPage.documentClass = IronswornJournalPage

  // CONFIG.RollTable.resultTemplate =
  //   'systems/foundry-ironsworn/templates/chat/table-draw.hbs'

  // Turn off Foundry defaults
  Actors.unregisterSheet('core', ActorSheet)
  Items.unregisterSheet('core', ItemSheet)

  // Register our own sheets
  Actors.registerSheet('ironsworn', IronswornCharacterSheetV2, {
    label: 'IRONSWORN.ACTOR.SheetCharacterClassic',
    types: ['character'],
    makeDefault: true,
  })
  Actors.registerSheet('ironsworn', StarforgedCharacterSheet, {
    label: 'IRONSWORN.ACTOR.SheetCharacterStarforged',
    types: ['character'],
  })
  Actors.registerSheet('ironsworn', IronswornCompactCharacterSheet, {
    label: 'IRONSWORN.ACTOR.SheetCompact',
    types: ['character'],
  })

  Actors.registerSheet('ironsworn', IronswornSharedSheetV2, {
    types: ['shared'],
    label: 'IRONSWORN.ACTOR.TypeShared',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', FoeSheet, {
    types: ['foe'],
    label: 'IRONSWORN.ACTOR.SheetFoe',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', StarshipSheet, {
    types: ['starship'],
    label: 'IRONSWORN.ACTOR.TypeStarship',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', StarforgedLocationSheet, {
    types: ['location'],
    label: 'IRONSWORN.ACTOR.SheetStarforgedLocation',
    makeDefault: true,
  })

  Actors.registerSheet('ironsworn', IronswornSiteSheet, {
    types: ['site'],
    label: 'IRONSWORN.ACTOR.TypeSite',
    makeDefault: true,
  })

  Items.registerSheet('ironsworn', AssetSheetV2, {
    types: ['asset'],
    label: `${game.i18n.localize('IRONSWORN.ITEM.SheetAssetV2')} v2`,
    makeDefault: true,
  })
  Items.registerSheet('ironsworn', AssetSheet, {
    types: ['asset'],
    label: 'IRONSWORN.ITEM.TypeAsset',
  })

  Items.registerSheet('ironsworn', BondsetSheetV2, {
    types: ['bondset'],
    label: 'IRONSWORN.ITEM.TypeBondset',
    makeDefault: true,
  })

  Items.registerSheet('ironsworn', SFMoveSheet, {
    types: ['sfmove'],
    label: 'IRONSWORN.ITEM.TypeMove',
  })
  Items.registerSheet('ironsworn', DelveThemeOrDomainSheet, {
    types: ['delve-theme', 'delve-domain'],
    label:
      game.i18n.localize('IRONSWORN.ITEM.TypeDelveTheme') +
      ' / ' +
      game.i18n.localize('IRONSWORN.ITEM.TypeDelveDomain'),
    makeDefault: true,
  })

  Items.registerSheet('ironsworn', ProgressSheetV2, {
    types: ['progress'],
    label: 'IRONSWORN.ITEM.TypeProgressTrack',
    makeDefault: true,
  })

  DocumentSheetConfig.registerSheet(
    JournalEntryPage,
    'ironsworn',
    JournalProgressPageSheet,
    {
      types: ['progress'],
      makeDefault: true,
      label: 'IRONSWORN.JOURNALENTRYPAGE.TypeProgressTrack',
    }
  )

  DocumentSheetConfig.registerSheet(
    // @ts-ignore
    JournalEntryPage,
    'ironsworn',
    // @ts-ignore
    TruthJournalPageSheet,
    {
      types: ['truth'],
      makeDefault: true,
      label: 'IRONSWORN.JOURNALENTRYPAGE.TypeTruth',
    }
  )

  // @ts-ignore
  CONFIG.JournalEntryPage.typeLabels = merge(
    // @ts-ignore
    CONFIG.JournalEntryPage.typeLabels,
    {
      truth: 'IRONSWORN.JOURNALENTRYPAGE.TypeTruth',
      progress: 'IRONSWORN.JOURNALENTRYPAGE.TypeProgressTrack',
    }
  )
  // @ts-ignore
  CONFIG.JournalEntryPage.typeIcons = merge(CONFIG.JournalEntryPage.typeIcons, {
    truth: 'fa-solid fa-angles-up',
    progress: 'fas fa-asterisk',
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

  FirstStartDialog.maybeShow()

  // Pre-load all the oracles
  await primeCommonPackCaches()
})

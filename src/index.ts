/**
 * A Foundry implementation of the Ironsworn family of systems, by Shawn Tomkin
 */

import { IRONSWORN } from './config'
import { IronswornActor } from './module/actor/actor'
import { IronswornCharacterSheet } from './module/actor/sheets/charactersheet'
import { IronswornCharacterSheetV2 } from './module/actor/sheets/charactersheet-v2'
import { IronswornCompactCharacterSheet } from './module/actor/sheets/compactsheet'
import { FoeSheet } from './module/actor/sheets/foesheet'
import { StarforgedCharacterSheet } from './module/actor/sheets/sf-charactersheet'
import { StarforgedLocationSheet } from './module/actor/sheets/sf-locationsheet'
import { IronswornSharedSheet } from './module/actor/sheets/sharedsheet'
import { IronswornSharedSheetV2 } from './module/actor/sheets/sharedsheet-v2'
import { IronswornSiteSheet } from './module/actor/sheets/sitesheet'
import { IronswornSiteSheetV2 } from './module/actor/sheets/sitesheet-v2'
import { StarshipSheet } from './module/actor/sheets/starshipsheet'
import { CreateActorDialog } from './module/applications/createActorDialog'
import { WorldTruthsDialog } from './module/applications/worldTruthsDialog'
import { IronswornChatCard } from './module/chat/cards'
import { activateChangelogListeners } from './module/features/changelog'
import { maybePromptForDependencies } from './module/features/dependencies'
import { activateDragDropListeners } from './module/features/dragdrop'
import { activateSceneButtonListeners } from './module/features/sceneButtons'
import { registerTokenHUDButtons } from './module/features/tokenRotateButtons'
import { registerZIndexHook } from './module/features/z-index'
import { IronswornHandlebarsHelpers } from './module/helpers/handlebars'
import { runDataMigrations } from './module/helpers/migrations'
import { IronswornSettings } from './module/helpers/settings'
import { TemplatePreloader } from './module/helpers/templatepreloader'
import { AssetSheet } from './module/item/asset/assetsheet'
import { AssetSheetV2 } from './module/item/asset/assetsheet-v2'
import { BondsetSheet } from './module/item/bondset/bondsetsheet'
import { BondsetSheetV2 } from './module/item/bondset/bondsetsheet-v2'
import { DelveThemeOrDomainSheet } from './module/item/delve-theme-domain/delvethemeordomainsheet'
import { IronswornItem } from './module/item/item'
import { MoveSheet } from './module/item/move/movesheet'
import { MoveSheetV2 } from './module/item/move/movesheetv2'
import { ProgressSheet } from './module/item/progress/progresssheet'
import { ProgressSheetV2 } from './module/item/progress/progresssheet-v2'

import './styles/styles.less'

declare global {
  interface LenientGlobalVariableTypes {
    game: never // the type doesn't matter
  }
}

Hooks.once('init', async () => {
  console.log('Ironsworn | initializing system')

  // Bootstrap settings and pull in theme
  IronswornSettings.registerSettings()
  require(`./styles/themes/${IronswornSettings.theme}.less`)

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
    label: 'Character sheet v2',
    types: ['character'],
    makeDefault: true,
  })
  if (CONFIG.IRONSWORN.IronswornSettings.starforgedBeta) {
    Actors.registerSheet('ironsworn', StarforgedCharacterSheet, {
      label: 'Starforged character sheet',
      types: ['character'],
    })
  }
  Actors.registerSheet('ironsworn', IronswornCompactCharacterSheet, {
    label: 'Compact sheet',
    types: ['character'],
  })
  Actors.registerSheet('ironsworn', IronswornCharacterSheet, {
    types: ['character'],
    label: 'Classic character sheet',
  })

  Actors.registerSheet('ironsworn', IronswornSharedSheetV2, {
    types: ['shared'],
    label: 'Shared sheet v2',
    makeDefault: true,
  })
  Actors.registerSheet('ironsworn', IronswornSharedSheet, {
    types: ['shared'],
    label: 'Classic shared sheet',
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
    label: 'Site sheet v2',
    makeDefault: true,
  })
  Actors.registerSheet('ironsworn', IronswornSiteSheet, {
    types: ['site'],
    label: 'Classic site sheet',
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
  Items.registerSheet('ironsworn', MoveSheetV2, {
    types: ['move'],
    label: 'Move sheet v2',
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

  // Preload all needed templates
  await TemplatePreloader.preloadHandlebarsTemplates()

  // Register Handlebars helpers
  IronswornHandlebarsHelpers.registerHelpers()
  IronswornChatCard.registerHooks()
  activateSceneButtonListeners()
  registerZIndexHook()
  registerTokenHUDButtons()
})

Hooks.once('ready', async () => {
  await runDataMigrations()

  await maybePromptForDependencies()

  activateDragDropListeners()
  activateChangelogListeners()

  CONFIG.IRONSWORN.applications.createActorDialog = new CreateActorDialog({})
  WorldTruthsDialog.maybeShow()

  // Quill theme stylesheet
  const link = document.createElement('link')
  // link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = '//cdn.quilljs.com/1.3.6/quill.bubble.css'
  document.head.appendChild(link)
})

Hooks.once('setup', () => {
  Roll.prototype.render = async function (chatOptions = {}) {
    const template = 'systems/foundry-ironsworn/templates/chat/default-roll.hbs'
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
      themeClass: `theme-${IronswornSettings.theme}`,
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

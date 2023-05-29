/**
 * A Foundry implementation of the Ironsworn family of systems, by Shawn Tomkin
 */

import { IRONSWORN } from './config'
import { IronswornActor } from './module/actor/actor'
import { IronswornCharacterSheetV2 } from './module/actor/sheets/charactersheet-v2'
import { FoeSheet } from './module/actor/sheets/foesheet'
import { StarforgedCharacterSheet } from './module/actor/sheets/sf-charactersheet'
import { StarforgedLocationSheet } from './module/actor/sheets/sf-locationsheet'
import { IronswornSharedSheetV2 } from './module/actor/sheets/sharedsheet-v2'
import { IronswornSiteSheet } from './module/actor/sheets/sitesheet'
import { StarshipSheet } from './module/actor/sheets/starshipsheet'
import { FirstStartDialog } from './module/applications/firstStartDialog'
import { IronswornChatCard } from './module/chat/cards'
import { registerChatAlertHooks } from './module/features/chat-alert'
import { registerDragAndDropHooks } from './module/features/drag-and-drop'
import { primeCommonPackCaches } from './module/features/pack-cache'
import { activateSceneButtonListeners } from './module/features/sceneButtons'
import { runStartupMacro } from './module/features/startup-macro'
import { registerTokenHUDButtons } from './module/features/tokenRotateButtons'
import * as IronColor from './module/features/ironcolor'
import { patchZIndex } from './module/features/z-index'
import { IronswornHandlebarsHelpers } from './module/helpers/handlebars'
import { runDataMigrations } from './module/helpers/migrations'
import { IronswornSettings } from './module/helpers/settings'
import { AssetSheetV2 } from './module/item/asset/assetsheet-v2'
import { BondsetSheetV2 } from './module/item/bondset/bondsetsheet-v2'
import { ThemeDomainSheet } from './module/item/delve-theme-domain/theme-domain-sheet'
import { IronswornItem } from './module/item/item'
import { SFMoveSheet } from './module/item/move/sfmovesheet'
import { ProgressSheetV2 } from './module/item/progress/progresssheet-v2'
import { IronswornJournalPage } from './module/journal/journal-entry-page'
import { JournalProgressPageSheet } from './module/journal/sheet/progress-page'
import { TruthJournalPageSheet } from './module/journal/sheet/truth-page'
import { registerTours } from './module/features/tours'
import { CompactPCSheet } from './module/actor/sheets/compact-pc-sheet'

import 'virtual:svg-icons-register'
import { registerDefaultOracleTrees } from './module/features/customoracles'
import { OracleTable } from './module/roll-table/oracle-table'
import { OracleTableResult } from './module/roll-table/oracle-table-result'
import { IronswornJournalEntry } from './module/journal/journal-entry'
import type {
	DocumentSubTypes,
	DocumentType
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { Oracles } from './module/roll-table/oracles'

declare global {
	interface LenientGlobalVariableTypes {
		game: never // the type doesn't matter
	}

	// fix missing LoFD type inference
	interface Game {
		documentTypes: {
			[P in DocumentType as Omit<DocumentType, 'JournalEntryPage'> &
				DocumentType]: Array<DocumentSubTypes<P>>
		} & {
			JournalEntryPage: JournalEntryPageType[]
		}
	}

	// v11 renames this function
	function parseUuid(uuid: string, relative?: any): ResolvedUUID
}

Hooks.once('init', async () => {
	console.log('Ironsworn | initializing system')

	// Bootstrap settings and pull in theme
	IronswornSettings.registerSettings()

	// Theme configuration
	IronColor.colorSchemeSetup()

	CONFIG.IRONSWORN = IRONSWORN

	// Define custom Entity classes
	CONFIG.Actor.documentClass = IronswornActor
	CONFIG.Item.documentClass = IronswornItem

	CONFIG.JournalEntry.documentClass = IronswornJournalEntry
	CONFIG.JournalEntryPage.documentClass = IronswornJournalPage

	CONFIG.RollTable.documentClass = OracleTable
	CONFIG.RollTable.collection = Oracles
	// CONFIG.RollTable.sidebarIcon = 'fa-solid fa-crystal-ball'
	CONFIG.RollTable.resultIcon = 'icons/dice/d10black.svg'
	CONFIG.TableResult.documentClass = OracleTableResult

	CONFIG.RollTable.compendiumIndexFields.push('flags.foundry-ironsworn.dfid')

	// CONFIG.RollTable.resultTemplate =
	// 	'systems/foundry-ironsworn/templates/rolls/oracle-roll-message.hbs'

	// Turn off Foundry defaults
	Actors.unregisterSheet('core', ActorSheet)
	Items.unregisterSheet('core', ItemSheet)

	// Register our own sheets
	Actors.registerSheet('ironsworn', IronswornCharacterSheetV2, {
		label: 'IRONSWORN.Ironsworn',
		types: ['character'],
		makeDefault: true
	})
	Actors.registerSheet('ironsworn', StarforgedCharacterSheet, {
		label: 'IRONSWORN.Starforged',
		types: ['character']
	})
	Actors.registerSheet('ironsworn', CompactPCSheet, {
		label: 'IRONSWORN.ACTOR.SheetCompact',
		types: ['character']
	})

	Actors.registerSheet('ironsworn', IronswornSharedSheetV2, {
		types: ['shared'],
		label: 'IRONSWORN.ACTOR.TypeShared',
		makeDefault: true
	})

	Actors.registerSheet('ironsworn', FoeSheet, {
		types: ['foe'],
		label: 'IRONSWORN.ACTOR.SheetFoe',
		makeDefault: true
	})

	Actors.registerSheet('ironsworn', StarshipSheet, {
		types: ['starship'],
		label: 'IRONSWORN.ACTOR.TypeStarship',
		makeDefault: true
	})

	Actors.registerSheet('ironsworn', StarforgedLocationSheet, {
		types: ['location'],
		label: 'IRONSWORN.ACTOR.SheetStarforgedLocation',
		makeDefault: true
	})

	Actors.registerSheet('ironsworn', IronswornSiteSheet, {
		types: ['site'],
		label: 'IRONSWORN.ACTOR.TypeDelveSite',
		makeDefault: true
	})

	Items.registerSheet('ironsworn', AssetSheetV2, {
		types: ['asset'],
		label: 'IRONSWORN.ITEM.TypeAsset',
		makeDefault: true
	})

	Items.registerSheet('ironsworn', BondsetSheetV2, {
		types: ['bondset'],
		label: 'IRONSWORN.ITEM.TypeBondset',
		makeDefault: true
	})

	Items.registerSheet('ironsworn', SFMoveSheet, {
		types: ['sfmove'],
		label: 'IRONSWORN.ITEM.TypeMove'
	})

	Items.registerSheet('ironsworn', ThemeDomainSheet, {
		types: ['delve-theme', 'delve-domain'],
		label: 'IRONSWORN.ITEM.TypeDelveThemeOrDomain',
		makeDefault: true
	})

	Items.registerSheet('ironsworn', ProgressSheetV2, {
		types: ['progress'],
		label: 'IRONSWORN.ITEM.TypeProgressTrack',
		makeDefault: true
	})

	DocumentSheetConfig.registerSheet(
		JournalEntryPage,
		'ironsworn',
		JournalProgressPageSheet,
		{
			types: ['progress'],
			makeDefault: true,
			label: 'IRONSWORN.JOURNALENTRYPAGE.TypeProgressTrack'
		}
	)

	DocumentSheetConfig.registerSheet(
		JournalEntryPage,
		'ironsworn',
		TruthJournalPageSheet,
		{
			types: ['truth'],
			makeDefault: true,
			label: 'IRONSWORN.JOURNALENTRYPAGE.TypeTruth'
		}
	)

	CONFIG.Item.typeLabels = mergeObject(CONFIG.Item.typeLabels, {
		asset: 'IRONSWORN.ITEM.TypeAsset',
		progress: 'IRONSWORN.ITEM.TypeProgressTrack',
		bondset: 'IRONSWORN.ITEM.TypeBondset',
		sfmove: 'IRONSWORN.ITEM.TypeMove',
		'delve-domain': 'IRONSWORN.ITEM.TypeDelveDomain',
		'delve-theme': 'IRONSWORN.ITEM.TypeDelveTheme'
	})
	CONFIG.Item.typeIcons = mergeObject(CONFIG.Item.typeIcons, {
		asset: 'fa-solid fa-cards-blank',
		progress: 'fa-solid fa-asterisk',
		bondset: 'fa-solid fa-handshake',
		sfmove: 'icon isicon-d10-tilt',
		// FIXME ideally, these would be distinct from assets, but all three card types are abstract enough than an icon is tricky
		'delve-domain': 'fa-duotone fa-cards-blank',
		'delve-theme': 'fa-duotone fa-cards-blank'
	})

	CONFIG.Actor.typeLabels = mergeObject(CONFIG.Actor.typeLabels, {
		character: 'IRONSWORN.ACTOR.TypeCharacter',
		foe: 'IRONSWORN.ACTOR.TypeFoe',
		location: 'IRONSWORN.ACTOR.TypeLocation',
		shared: 'IRONSWORN.ACTOR.TypeShared',
		site: 'IRONSWORN.ACTOR.TypeDelveSite',
		starship: 'IRONSWORN.ACTOR.TypeStarship'
	})
	CONFIG.Actor.typeIcons = mergeObject(CONFIG.Actor.typeIcons, {
		character: 'fa-solid fa-user-pen',
		foe: 'fa-solid fa-masks-theater',
		location: 'fa-solid fa-location-dot',
		shared: 'fa-solid fa-people-group',
		site: 'fa-solid fa-dungeon',
		starship: 'fa-solid fa-starship-freighter'
	})

	CONFIG.JournalEntryPage.typeLabels = mergeObject(
		CONFIG.JournalEntryPage.typeLabels,
		{
			truth: 'IRONSWORN.JOURNALENTRYPAGE.TypeTruth',
			progress: 'IRONSWORN.JOURNALENTRYPAGE.TypeProgressTrack'
		}
	)
	CONFIG.JournalEntryPage.typeIcons = mergeObject(
		CONFIG.JournalEntryPage.typeIcons,
		{
			truth: 'fa-solid fa-books',
			progress: 'fa-solid fa-asterisk'
		}
	)

	// Register Handlebars helpers
	IronswornHandlebarsHelpers.registerHelpers()
	IronswornChatCard.registerHooks()
	patchZIndex()
	await registerTokenHUDButtons()
	activateSceneButtonListeners()
})

Hooks.once('ready', async () => {
	await runDataMigrations()

	registerDragAndDropHooks()
	registerChatAlertHooks()

	await registerDefaultOracleTrees()

	await FirstStartDialog.maybeShow()
	await registerTours()

	runStartupMacro()
})

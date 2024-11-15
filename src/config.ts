import { IronswornActor } from './module/actor/actor'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Emitter, EventType } from 'mitt'
import Mitt from 'mitt'
import {
	IronswornRoll,
	IronswornPrerollDialog,
	IronswornRollMessage
} from './module/rolls'
import { AssetCompendiumBrowser } from './module/item/asset-compendium-browser'
import { FirstStartDialog } from './module/applications/firstStartDialog'
import { SFSettingTruthsDialogVue } from './module/applications/vueSfSettingTruthsDialog'
import { OracleWindow } from './module/applications/oracle-window'
import { SFCharacterMoveSheet } from './module/actor/sheets/sf-charactermovesheet'
import {
	getOracleTree,
	registerOracleTree
} from './module/features/customoracles'
import { OracleTable } from './module/roll-table/oracle-table'
import { FoeBrowser } from './module/item/foe-browser'

export interface EmitterEvents extends Record<EventType, unknown> {
	highlightMove: string // Foundry UUID
	highlightOracle: string // Datasworn 2 ID
	globalConditionChanged: { name: string; enabled: boolean } // info about condition that changed
	dragStart: string // type of item
	dragEnd: string // type of item
}
export type IronswornEmitter = Emitter<EmitterEvents>

export interface IronswornConfig {
	actorClass: typeof IronswornActor
	OracleTable: typeof OracleTable

	showdown: showdown.Converter

	applications: {
		// Dialogs
		FirstStartDialog: typeof FirstStartDialog
		SFSettingTruthsDialog: typeof SFSettingTruthsDialogVue
		AssetCompendiumBrowser: typeof AssetCompendiumBrowser
		FoeBrowser: typeof FoeBrowser
		OracleWindow: typeof OracleWindow
		SFCharacterMoveSheet: typeof SFCharacterMoveSheet

		// Rolling
		IronswornRoll: typeof IronswornRoll
		IronswornPrerollDialog: typeof IronswornPrerollDialog
		IronswornRollMessage: typeof IronswornRollMessage
	}

	emitter: IronswornEmitter

	registerOracleTree: typeof registerOracleTree
	getOracleTree: typeof getOracleTree

	// Patch for v10 + v11 compat
	parseUuid: typeof _parseUuid
}

export const IRONSWORN: IronswornConfig = {
	actorClass: IronswornActor,
	OracleTable,

	// TODO: if we wanted to implement enrichMarkdown as a showdown plugin, we could use our own instance instead.
	get showdown() {
		return JournalTextPageSheet._converter
	},

	applications: {
		FirstStartDialog,
		SFSettingTruthsDialog: SFSettingTruthsDialogVue,
		AssetCompendiumBrowser,
		FoeBrowser,
		OracleWindow,
		SFCharacterMoveSheet,

		IronswornRoll,
		IronswornPrerollDialog,
		IronswornRollMessage
	},

	emitter: Mitt<EmitterEvents>(),

	registerOracleTree,
	getOracleTree,

	parseUuid: typeof parseUuid === 'function' ? parseUuid : _parseUuid
}

import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { BaseUser } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import type { IRow } from 'dataforged'
import { clamp } from 'lodash-es'
import { ChallengeRank, RANK_INCREMENTS } from '../constants'
import { typedDeleteDialog } from '../helpers/util'
import { OracleTable } from '../roll-table/oracle-table'
import { OracleTableResult } from '../roll-table/oracle-table-result'
import type {
	ProgressTrackDataPropertiesData,
	TruthOptionDataPropertiesData
} from './journal-entry-page-types'

/**
 * Extends the base {@link JournalEntryPage} document class.
 */
export class IronswornJournalPage<
	T extends JournalEntryPageType = JournalEntryPageType
> extends JournalEntryPage<T> {
	protected override async _preCreate(
		data: JournalEntryPageData.ConstructorData,
		options: DocumentModificationOptions,
		user: BaseUser
	): Promise<void> {
		// FIXME: JEPs aren't initialized with proper defaults, so we DIY it.
		// https://github.com/foundryvtt/foundryvtt/issues/8628
		const defaults = game.system.template.JournalEntryPage?.[
			data.type
		] as JournalEntryPageDataSource
		if (defaults != null) {
			const alreadySet = data.system
			const newSourceData = mergeObject(defaults, alreadySet ?? {}, {
				recursive: true
			})
			// @ts-expect-error
			this.updateSource({ system: newSourceData })
		}
		await super._preCreate(data, options, user)
	}

	toTruthTableResultData() {
		if (this.type !== 'truth') return undefined
		const system = this.system as TruthOptionDataPropertiesData
		const data: TableResultDataConstructorData = {
			range: [system.Floor ?? 0, system.Ceiling ?? 100],
			text: system.Result,
			flags: {
				'foundry-ironsworn': {
					sourceId: this.uuid,
					type: 'truth-option'
				}
			}
		}
		return data
	}

	// SETTING TRUTH OPTION METHODS
	get subtable() {
		if (this.type !== 'truth') return undefined
		const pageSystem = this.system as TruthOptionDataPropertiesData
		if (pageSystem.Subtable?.length == null) return undefined
		return new OracleTable({
			name: this.name ?? '???',
			formula: '1d100',
			results: pageSystem.Subtable.map((row) =>
				OracleTableResult.getConstructorData(
					row as IRow & { Floor: number; Ceiling: number }
				)
			),
			flags: {
				'foundry-ironsworn': {
					subtitle: game.i18n.localize('IRONSWORN.First Start.SettingTruths'),
					sourceId: this.uuid,
					type: 'truth-option-subtable'
				}
			}
		})
	}

	// PROGRESS METHODS
	/**
	 * Mark progress on a progress track.
	 * @param progressUnits The number of times that progress is to be marked.
	 */
	async markProgress(progressUnits = 1) {
		if (this.type !== 'progress') return
		const system = this.system as ProgressTrackDataPropertiesData
		const legacyRank = ChallengeRank[system.rank]
		const oldTicks = system.ticks ?? 0
		const minTicks = 0
		const maxTicks = 40
		const increment = RANK_INCREMENTS[legacyRank] * progressUnits
		const newValue = clamp(oldTicks + increment, minTicks, maxTicks)
		return await this.update({ 'system.ticks': newValue })
	}

	override async deleteDialog(options?: Partial<DialogOptions>) {
		return await typedDeleteDialog(this, options)
	}
}

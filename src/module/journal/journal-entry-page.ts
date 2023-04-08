import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { BaseUser } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import type { IRow } from 'dataforged'
import { clamp } from 'lodash-es'
import { ChallengeRank, RANK_INCREMENTS } from '../constants'
import { OracleTable } from '../roll-table/oracle-table'
import { OracleTableResult } from '../roll-table/oracle-table-result'
import type {
	ProgressTrackDataPropertiesData,
	TruthOptionDataProperties,
	TruthOptionDataPropertiesData
} from './journal-entry-page-types'

/**
 * Extends the base {@link JournalEntryPage} document class.
 */
export class IronswornJournalPage<
	T extends DataConfig['JournalEntryPage'] = DataConfig['JournalEntryPage']
> extends JournalEntryPage {
	declare system: T['system']
	declare type: T['type']
	protected override async _preCreate(
		data: JournalEntryPageData.ConstructorData,
		options: DocumentModificationOptions,
		user: BaseUser
	): Promise<void> {
		// FIXME: JEPs aren't initialized with proper defaults, so we DIY it.
		// https://github.com/foundryvtt/foundryvtt/issues/8628
		const defaults = game.system.template.JournalEntryPage?.[
			// @ts-expect-error
			data.type
		] as JournalEntryPageDataSource
		if (defaults) {
			const alreadySet = data.system
			const newSourceData = mergeObject(defaults, alreadySet ?? {}, {
				recursive: true
			})
			// @ts-expect-error
			this.updateSource({ system: newSourceData })
		}
		await super._preCreate(data, options, user)
	}

	toTableResultData() {
		if (this.type !== 'truth') return undefined
		const system = this.system as TruthOptionDataPropertiesData
		const data: TableResultDataConstructorData = {
			range: [system.Floor ?? 0, system.Ceiling ?? 100],
			text: system.Result,
			flags: {
				'foundry-ironsworn': {
					sourceUuid: this.uuid,
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
		const results = pageSystem.Subtable.map((row) =>
			OracleTableResult.fromDataforged(
				row as IRow & { Floor: number; Ceiling: number }
			)
		)
		const tableData: RollTableDataConstructorData = {
			name: this.name ?? '???',
			results,
			flags: {
				'foundry-ironsworn': {
					subtitle: game.i18n.localize('IRONSWORN.First Start.SettingTruths'),
					sourceUuid: this.uuid,
					type: 'truth-option-subtable'
				}
			}
		}
		return new OracleTable(tableData)
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
}

declare global {
	interface DocumentClassConfig {
		JournalEntryPage: typeof IronswornJournalPage
	}
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Game {
		interface SystemData<T> extends PackageData<T> {
			model: {
				JournalEntryPage: Record<string, Record<string, unknown>>
			}
			template: {
				JournalEntryPage?: {
					types: string[]
					templates?: Record<string, unknown>
				} & Record<string, unknown>
			}
		}
	}
}

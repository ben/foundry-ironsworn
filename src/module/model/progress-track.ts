import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { ChallengeRank } from 'dataforged'
import { IRONSWORN } from '../../config'
import type { DocumentType } from '../../types/helperTypes'
import { ChallengeRankField } from '../fields/ChallengeRankField'
import type { DataSchema } from '../fields/utils'
import type { IronswornItem } from '../item/item'
import { IronswornPrerollDialog } from '../rolls'

export class ProgressTrack<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<
	ProgressTrackSource,
	ProgressTrackPropertiesData,
	Parent
> {
	/** Get the most recent Document ancestor */
	getNearestDocument(): Parent extends foundry.abstract.Document<any, any, any>
		? Parent
		: foundry.abstract.Document<any, any, any> | null
	getNearestDocument<T extends DocumentType>(
		type: T
	): Parent extends InstanceType<ConfiguredDocumentClassForName<T>>
		? Parent
		: InstanceType<ConfiguredDocumentClassForName<T>> | null
	getNearestDocument<T extends DocumentType | undefined = undefined>(
		type?: T
	): T extends DocumentType
		? Parent extends InstanceType<ConfiguredDocumentClassForName<T>>
			? Parent
			: InstanceType<ConfiguredDocumentClassForName<T>> | null
		: foundry.abstract.Document<any, any, any> | null {
		let DocClass: typeof foundry.abstract.Document

		if (type == null) DocClass = foundry.abstract.Document
		else
			DocClass = getDocumentClass(type) as ConfiguredDocumentClassForName<
				Exclude<T, undefined>
			>

		if (DocClass == null) return null as any

		if (this.parent instanceof DocClass) return this.parent as any

		let current: foundry.abstract.DataModel.AnyOrDoc | null | undefined =
			this.parent

		while (current != null)
			if (current.parent instanceof DocClass) return current.parent as any
			else current = current.parent

		return null as any
	}

	max?: number
	value?: number

	/** The derived progress score, an integer from 0 to 10. */
	get score() {
		return Math.clamped(
			Math.floor(this.ticks / ProgressTrack.TICKS_PER_BOX),
			ProgressTrack.SCORE_MIN,
			ProgressTrack.SCORE_MAX
		)
	}

	/** The number of ticks per unit of progress (in other words, per instance of "mark progress") for this track's challenge rank. */
	get #unit() {
		return ProgressTrack.INCREMENT[this.rank]
	}

	/**
	 * Configure a `Document.update` data object for use in marking this progress track. Use negative `times` to erase progress.
	 * @param times The number of units of progress to be marked (default: `1`).
	 */
	getMarkData(times = 1) {
		return {
			ticks: Math.clamped(
				this.ticks + this.#unit * times,
				ProgressTrack.TICKS_MIN,
				ProgressTrack.TICKS_MAX
			)
		}
	}

	#inferObjective(): string | null {
		if (typeof (this.parent as any)?.objective === 'string')
			return (this.parent as any).objective
		const docTypes: DocumentType[] = ['Item', 'JournalEntryPage']
		for (const docType of docTypes) {
			const doc = this.getNearestDocument(docType) as any
			if (doc != null) return doc.name ?? null
		}
		return null
	}

	/** Make a progress roll to resolve the progress track. */
	async resolve(objective?: string) {
		let moveDfId: string | undefined
		const actor = this.getNearestDocument('Actor')
		const toolset = actor?.toolset ?? 'starforged'

		switch (this.subtype) {
			case 'vow':
				moveDfId =
					toolset === 'starforged'
						? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
						: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
				break
			case 'connection':
				if (toolset === 'starforged')
					moveDfId = 'Starforged/Moves/Connection/Forge_a_Bond'
				break
			default:
				break
		}

		return await IronswornPrerollDialog.showForProgress(
			objective ?? this.#inferObjective() ?? '(progress)',
			this.score,
			actor ?? undefined,
			moveDfId
		)
	}

	static override migrateData(source) {
		// @ts-expect-error
		source = super.migrateData(source)
		foundry.abstract.Document._addDataFieldMigration(source, 'current', 'ticks')

		if (source.subtype === 'bond') source.subtype = 'connection'

		return source
	}

	/** Provide a localized label for this progress track's challenge rank. */
	localizeRank() {
		const field = this.schema.getField('rank') as unknown as ChallengeRankField
		return game.i18n.localize(field.choices[this.rank])
	}

	static override defineSchema(): DataSchema<ProgressTrackPropertiesData> {
		const fields = foundry.data.fields
		return {
			ticks: new fields.NumberField({
				initial: this.TICKS_MIN,
				min: this.TICKS_MIN,
				max: this.TICKS_MAX
			}),
			enabled: new fields.BooleanField({ initial: true }),
			rank: new ChallengeRankField(),
			progress_move: new fields.ForeignDocumentField(
				IRONSWORN.IronswornItem as any,
				{
					required: false,
					nullable: true
				}
			) as any,
			subtype: new fields.StringField({
				choices: {
					progress: 'IRONSWORN.ITEM.SubtypeProgress',
					vow: 'IRONSWORN.ITEM.SubtypeVow',
					connection: 'IRONSWORN.ITEM.SubtypeConnection',
					foe: 'IRONSWORN.ITEM.SubtypeFoe'
				},
				initial: 'progress'
			})
		}
	}

	/** The minimum score when making a progress roll. */
	static readonly SCORE_MIN = 0
	/** The maximum score when making a progress roll. */
	static readonly SCORE_MAX = 10
	/** The number of ticks in one box of progress. */
	static readonly TICKS_PER_BOX = 4
	/** The number of boxes in a progress track. */
	static readonly BOXES = this.SCORE_MAX
	/** The minimum number of ticks in a progress track. */
	static readonly TICKS_MIN = 0
	/** The maximum number of ticks in a progress track. */
	static readonly TICKS_MAX = this.TICKS_PER_BOX * this.BOXES

	static readonly INCREMENT: Record<
		| ValueOf<(typeof ChallengeRankField)['RANK']>
		| keyof (typeof ChallengeRankField)['RANK'],
		number
	> = {
		[ChallengeRankField.RANK.Troublesome]: 12,
		Troublesome: 12,
		[ChallengeRankField.RANK.Dangerous]: 8,
		Dangerous: 8,
		[ChallengeRankField.RANK.Formidable]: 4,
		Formidable: 4,
		[ChallengeRankField.RANK.Extreme]: 2,
		Extreme: 2,
		[ChallengeRankField.RANK.Epic]: 1,
		Epic: 1
	} as const
}
export interface ProgressTrack<
	Parent extends foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<
			ProgressTrackSource,
			ProgressTrackPropertiesData,
			Parent
		>,
		ProgressTrackPropertiesData {}

type ProgressSubtype = 'vow' | 'progress' | 'connection' | 'foe'

export interface ProgressTrackSource {
	rank: ChallengeRank
	ticks: number // previously: current
	subtype: ProgressSubtype
	enabled?: boolean
	progress_move?: string | null
}

export interface ProgressTrackPropertiesData
	extends Omit<ProgressTrackSource, 'progress_move'> {
	progress_move: IronswornItem<'sfmove'> | null
}

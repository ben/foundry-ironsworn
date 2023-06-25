import type {
	IMove,
	IMoveReroll,
	IMoveTrigger,
	IMoveTriggerOptionAction,
	IMoveTriggerOptionProgress,
	IOutcomeInfo
} from 'dataforged'
import { DataforgedIDField } from '../../fields/DataforgedIDField'
import type { Display } from '../../fields/DisplayField'
import { DisplayField } from '../../fields/DisplayField'
import { SourceField } from '../../fields/SourceField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'

export class SFMoveModel extends foundry.abstract.TypeDataModel<
	SFMoveDataSourceData,
	SFMoveDataSourceData,
	IronswornItem<'sfmove'>
> {
	static _enableV10Validation = true

	static readonly rerollType = [
		/**
		 * The player can pick and choose which dice to reroll.
		 */
		'Any',
		/**
		 * The player can pick and choose which challenge dice to reroll.
		 */
		'Challenge dice',
		/**
		 * The action die is rerolled.
		 */
		'Action die',
		/**
		 * The player can choose one challenge die to reroll.
		 */
		'Challenge die',
		/**
		 * Reroll *all* dice
		 */
		'All'
	]

	static readonly outcome = ['Miss', 'Weak Hit', 'Strong Hit']

	static readonly rollType = ['Action roll', 'Progress roll']

	static readonly rollMethod = [
		/**
		 * When rolling with this move trigger option, *every* stat or progress track of the `Using` key is rolled.
		 */
		'All',
		/**
		 * When rolling with this move trigger option, use the highest/best option from the `Using` key.
		 */
		'Highest',
		/**
		 * When rolling with this move trigger option, use the lowest/worst option from the `Using` key.
		 */
		'Lowest',
		/**
		 * When rolling with this move trigger option, the user picks which stat to use.
		 *
		 * This is the default option for triggers that offer a single stat.
		 */
		'Any',
		/**
		 * This move trigger option has no roll method of its own, and must inherit its roll from another move trigger option.
		 *
		 * If the parent's `Using` is defined, the inherited roll must use one of those stats/progress tracks.
		 *
		 * Typically appears on children of `IAlterMove`.
		 */
		'Inherit',
		/**
		 * The move trigger option results in an automatic strong hit - no roll required.
		 */
		'Strong Hit',
		/**
		 * The move trigger option results in an automatic weak hit - no roll required.
		 */
		'Weak Hit'
	]

	get isProgressMove(): boolean {
		return (
			this.Trigger.Options?.some(
				(option) => option['Roll type'] === 'Progress roll'
			) ?? false
		)
	}

	static override defineSchema() {
		const fields = foundry.data.fields
		return {
			dfid: new DataforgedIDField(),
			Category: new DataforgedIDField(),
			Source: new SourceField(),
			'Progress Move': new fields.BooleanField(),
			Display: new DisplayField(),
			Text: new fields.HTMLField(),
			Oracles: new fields.ArrayField(new DataforgedIDField()),
			Trigger: new SFMoveTriggerField(),
			Outcomes: new fields.SchemaField(
				{
					'Strong Hit': new SFMoveOutcomeMatchableField(),
					'Weak Hit': new SFMoveOutcomeField(),
					Miss: new SFMoveOutcomeMatchableField()
				},
				{ required: false }
			)
		}
	}
}

export interface SFMoveOutcome
	extends Omit<IOutcomeInfo, 'With a Match' | '$id'> {}
export interface SFMoveOutcomeMatchable extends SFMoveOutcome {
	'With a Match'?: SFMoveOutcome
}

export class SFMoveOutcomeField extends foundry.data.fields.SchemaField<
	Omit<SFMoveOutcome, 'In Control'>
> {
	constructor(options = {}) {
		const fields = foundry.data.fields
		super(
			{
				Text: new fields.HTMLField(),
				Reroll: new fields.SchemaField(
					{
						Text: new fields.HTMLField(),
						Dice: new fields.StringField<
							ValueOf<typeof SFMoveModel.rerollType>
						>({
							choices: SFMoveModel.rerollType
						})
					},
					{ required: false }
				) as any,
				'Count as': new fields.StringField({
					choices: SFMoveModel.outcome as any,
					required: false
				})
			},
			options
		)
	}
}

export class SFMoveOutcomeMatchableField extends foundry.data.fields
	.SchemaField<Omit<SFMoveOutcomeMatchable, 'In Control'>> {
	constructor(options = {}) {
		const fields = foundry.data.fields
		super(
			{
				Text: new fields.HTMLField(),
				Reroll: new fields.SchemaField(
					{
						Text: new fields.HTMLField(),
						Dice: new fields.StringField<
							ValueOf<typeof SFMoveModel.rerollType>
						>({
							choices: SFMoveModel.rerollType
						})
					},
					{ required: false }
				) as any,
				'Count as': new fields.StringField<ValueOf<typeof SFMoveModel.outcome>>(
					{
						choices: SFMoveModel.outcome,
						required: false
					}
				) as any,
				'With a Match': new SFMoveOutcomeField({ required: false }) as any
			},
			options
		)
	}
}
export interface SFMoveModel extends SFMoveDataSourceData {}

export interface SFMoveDataSourceData
	extends Required<
		Pick<IMove, 'Category' | 'Source' | 'Text' | 'Oracles' | 'Progress Move'>
	> {
	dfid: string
	Trigger: SFMoveTrigger
	Display: Display
	Outcomes?: {
		'Strong Hit': SFMoveOutcomeMatchable
		'Weak Hit': SFMoveOutcome
		Miss: SFMoveOutcomeMatchable
	}
}

export interface SFMoveTrigger extends Pick<IMoveTrigger, 'Text'> {
	Options: SFMoveTriggerOption[]
}

type SFMoveTriggerOption = Omit<
	IMoveTriggerOptionAction | IMoveTriggerOptionProgress,
	'$id' | 'Custom stat'
>

export class SFMoveTriggerOptionField extends foundry.data.fields
	.SchemaField<SFMoveTriggerOption> {
	constructor() {
		const fields = foundry.data.fields
		super({
			'Roll type': new fields.StringField<any, any>({
				choices: SFMoveModel.rollType
			}),
			Text: new fields.HTMLField(),
			Method: new fields.StringField<any, any>({
				choices: SFMoveModel.rollMethod
			}),
			Using: new fields.ArrayField(new fields.StringField() as any)
		})
	}
}

export class SFMoveTriggerField extends foundry.data.fields
	.SchemaField<SFMoveTrigger> {
	constructor() {
		const fields = foundry.data.fields
		super({
			Text: new fields.HTMLField(),
			Options: new fields.ArrayField(new SFMoveTriggerOptionField())
		})
	}
}

export interface SFMoveDataSource {
	type: 'sfmove'
	data: SFMoveDataSourceData
	system: SFMoveDataSourceData
}
export interface SFMoveDataProperties {
	type: 'sfmove'
	data: SFMoveModel
	system: SFMoveModel
}

import type {
	IMove,
	IMoveReroll,
	IMoveTrigger,
	IMoveTriggerOptionAction,
	IMoveTriggerOptionProgress,
	IOutcomeInfo
} from 'dataforged'
import { RerollType, MoveOutcome, RollType, RollMethod } from 'dataforged'
import { DataforgedIDField } from '../../fields/DataforgedIDField'
import type { Display } from '../../fields/DisplayField'
import { DisplayField } from '../../fields/DisplayField'
import { SourceField } from '../../fields/SourceField'
import type { DataSchema } from '../../fields/utils'
import { enumKeys, enumValues } from '../../fields/utils'

export class SFMoveData extends foundry.abstract
	.DataModel<SFMoveDataSourceData> {
	static _enableV10Validation = true

	get isProgressMove(): boolean {
		return (
			this.Trigger.Options?.some(
				(option) => option['Roll type'] === 'Progress roll'
			) ?? false
		)
	}

	static override defineSchema(): DataSchema<SFMoveDataSourceData> {
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
			// @ts-expect-error
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

export class SFMoveOutcomeField extends foundry.data.fields
	.SchemaField<SFMoveOutcome> {
	constructor(options = {}) {
		const fields = foundry.data.fields
		super(
			{
				Text: new fields.HTMLField(),
				Reroll: new fields.SchemaField<IMoveReroll>(
					{
						Text: new fields.HTMLField(),
						// @ts-expect-error
						Dice: new fields.StringField<RerollType>({
							choices: enumValues(RerollType)
						})
					},
					{ required: false }
				),
				// @ts-expect-error
				'Count as': new fields.StringField<keyof typeof MoveOutcome>({
					choices: enumKeys(MoveOutcome),
					required: false
				})
			},
			options
		)
	}
}

export class SFMoveOutcomeMatchableField extends foundry.data.fields
	.SchemaField<SFMoveOutcomeMatchable> {
	constructor(options = {}) {
		const fields = foundry.data.fields
		super(
			{
				Text: new fields.HTMLField(),
				Reroll: new fields.SchemaField<IMoveReroll>(
					{
						Text: new fields.HTMLField(),
						// @ts-expect-error
						Dice: new fields.StringField<RerollType>({
							choices: enumValues(RerollType)
						})
					},
					{ required: false }
				),
				// @ts-expect-error
				'Count as': new fields.StringField<keyof typeof MoveOutcome>({
					choices: enumKeys(MoveOutcome),
					required: false
				}),
				'With a Match': new SFMoveOutcomeField({ required: false })
			},
			options
		)
	}
}
export interface SFMoveData extends SFMoveDataSourceData {}

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
				choices: enumValues(RollType)
			}),
			Text: new fields.HTMLField(),
			Method: new fields.StringField<any, any>({
				choices: enumValues(RollMethod)
			}),
			Using: new fields.ArrayField(new fields.StringField())
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
	data: SFMoveData
	system: SFMoveData
}

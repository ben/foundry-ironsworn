import type {
	IMove,
	IMoveTrigger,
	IMoveTriggerOptionAction,
	IMoveTriggerOptionProgress
} from 'dataforged'
import { RollType, RollMethod } from 'dataforged'
import { DataforgedIDField } from '../../fields/DataforgedIDField'
import type { Display } from '../../fields/DisplayField'
import { DisplayField } from '../../fields/DisplayField'
import { SourceField } from '../../fields/SourceField'
import type { DataSchema } from '../../fields/utils'
import { enumValues } from '../../fields/utils'

export class SFMoveData extends foundry.abstract
	.DataModel<SFMoveDataPropertiesData> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<SFMoveDataPropertiesData> {
		const fields = foundry.data.fields
		return {
			dfid: new DataforgedIDField(),
			Category: new DataforgedIDField(),
			Source: new SourceField(),
			'Progress Move': new fields.BooleanField(),
			Display: new DisplayField(),
			Text: new fields.HTMLField(),
			Oracles: new fields.ArrayField(new DataforgedIDField()),
			Trigger: new SFMoveTriggerField()
		}
	}
}

export interface SFMoveData extends SFMoveDataPropertiesData {}

export interface SFMoveDataPropertiesData
	extends Required<
		Pick<IMove, 'Category' | 'Source' | 'Text' | 'Oracles' | 'Progress Move'>
	> {
	dfid: string
	Trigger: SFMoveTrigger
	Display: Display
}

interface SFMoveTrigger extends Pick<IMoveTrigger, 'Text'> {
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
	data: SFMoveDataPropertiesData
	system: SFMoveDataPropertiesData
}
export interface SFMoveDataProperties {
	type: 'sfmove'
	data: SFMoveDataPropertiesData
	system: SFMoveDataPropertiesData
}

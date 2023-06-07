import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import { ClockSchema } from './common'

export class AssetData extends foundry.abstract.DataModel<
	AssetDataSourceData,
	IronswornItem<'asset'>
> {
	static _enableV10Validation = true

	static override defineSchema(): DataSchema<AssetDataSourceData> {
		const fields = foundry.data.fields

		return {
			// @ts-expect-error Weird LoFD types causing grief
			color: new fields.ColorField(),
			category: new fields.StringField(),
			description: new fields.HTMLField(), // FIXME: i think this is deprecated. could we append it to requirement to preserve the data?
			requirement: new fields.HTMLField(),
			abilities: new fields.ArrayField(new AssetAbilityField()),
			exclusiveOptions: new fields.ArrayField(
				new fields.SchemaField<AssetExclusiveOption>({
					name: new fields.StringField(),
					selected: new fields.BooleanField()
				})
			),
			conditions: new fields.ArrayField(
				new fields.SchemaField<AssetCondition>({
					name: new fields.StringField(),
					ticked: new fields.BooleanField()
				})
			),
			fields: new fields.ArrayField(
				new fields.SchemaField<AssetField>({
					name: new fields.StringField(),
					value: new fields.StringField()
				})
			),
			track: new ConditionMeterField()
		}
	}
}

export class ConditionMeterField extends foundry.data.fields
	.SchemaField<AssetConditionMeter> {
	constructor() {
		const fields = foundry.data.fields

		super({
			enabled: new fields.BooleanField(),
			name: new fields.StringField(),
			current: new fields.NumberField({ integer: true, min: 0, initial: 5 }),
			max: new fields.NumberField({ integer: true, min: 0, initial: 5 })
		})
	}
}
export interface AssetData extends AssetDataPropertiesData {}

export interface AssetConditionMeter {
	enabled: boolean
	name: string
	current: number
	max: number
}

export interface AssetField {
	name: string
	value: string
}

export class AssetAbilityField extends foundry.data.fields
	.SchemaField<AssetAbility> {
	constructor() {
		const fields = foundry.data.fields

		super({
			name: new fields.StringField({
				required: false,
				nullable: true
			}),
			enabled: new fields.BooleanField(),
			description: new fields.HTMLField(),
			hasClock: new foundry.data.fields.BooleanField(),
			clockTicks: new foundry.data.fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				max: 12
			}),
			clockMax: new foundry.data.fields.NumberField({
				initial: 4,
				choices: [4, 6, 8, 10, 12]
			})
		})
	}
}

export interface AssetAbility {
	name?: string
	enabled: boolean
	description: string
	hasClock: boolean
	clockMax: number
	clockTicks: number
}

interface AssetExclusiveOption {
	name: string
	selected: boolean
}

interface AssetCondition {
	name: string
	ticked: boolean
}

interface AssetDataSourceData {
	category: string
	description?: string
	requirement: string
	color: string
	fields: AssetField[]
	abilities: AssetAbility[]
	track: AssetConditionMeter
	exclusiveOptions: AssetExclusiveOption[]
	conditions: AssetCondition[]
}

export interface AssetDataPropertiesData extends AssetDataSourceData {}

export interface AssetDataSource {
	type: 'asset'
	data: AssetDataSourceData
	system: AssetDataSourceData
}

export interface AssetDataProperties {
	type: 'asset'
	data: AssetDataPropertiesData
	system: AssetDataPropertiesData
}

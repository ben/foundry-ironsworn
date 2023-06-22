import { MeterField } from '../../fields/MeterField'
import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'

export class AssetData extends foundry.abstract.TypeDataModel<
	AssetDataSourceData,
	AssetDataPropertiesData,
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
			// @ts-expect-error
			track: new AssetConditionMeterField()
		}
	}
}
export interface AssetData extends AssetDataSourceData {}

export interface AssetDataSourceData {
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
	/**
	 * @deprecated
	 */
	data: AssetDataSourceData
	system: AssetDataSourceData
}

export interface AssetDataProperties {
	type: 'asset'
	/**
	 * @deprecated
	 */
	data: AssetData
	system: AssetData
}

export class AssetConditionMeterField extends MeterField<AssetConditionMeter> {
	constructor() {
		const fields = foundry.data.fields

		super(
			{},
			{
				enabled: new fields.BooleanField(),
				name: new fields.StringField()
			}
		)
	}
}

export interface AssetConditionMeter {
	enabled: boolean
	name: string
	value: number
	min: number
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

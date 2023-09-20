import { IronswornActor } from '../actor/actor'
import type { CharacterDataSourceData } from '../actor/subtypes/character'
import type { DataSchema } from './utils'

export interface MeterSource {
	value: number
	max: number
	min: number
}

interface MeterFieldOptions<
	T extends ConditionMeterSource = ConditionMeterSource
> extends foundry.data.fields.SchemaField.Options<T> {
	meterMax: number
	meterMin: number
	initialValue: number
}

export abstract class MeterField<
	T extends MeterSource = MeterSource
> extends foundry.data.fields.SchemaField<T, T> {
	constructor(
		{
			meterMin = 0,
			meterMax = 5,
			initialValue = meterMax,
			...options
		}: Partial<MeterFieldOptions<T>>,
		extendFields: DataSchema<Omit<T, keyof MeterSource>>
	) {
		const Fields = foundry.data.fields
		const schema: DataSchema<T> = {
			value: new Fields.NumberField({ integer: true, initial: initialValue }),
			max: new Fields.NumberField({ integer: true, initial: meterMax }),
			min: new Fields.NumberField({
				integer: true,
				readonly: true,
				initial: meterMin
			}),
			...(extendFields ?? {})
		} as any
		super(schema, options)
	}

	migrateSource(sourceData: object, fieldData: any) {
		if (typeof fieldData === 'number') {
			fieldData = { value: fieldData }
		}

		IronswornActor._addDataFieldMigration(fieldData, 'current', 'value')

		return super.migrateSource(sourceData, fieldData)
	}
}

export class ConditionMeterField extends MeterField {
	constructor(options) {
		super(options, {})
	}
}
export interface ConditionMeterField extends MeterField, ConditionMeterSource {}

export interface ConditionMeterSource extends MeterSource {}

export interface MomentumSource extends MeterSource {
	resetValue: number
}

export class MomentumField extends MeterField<MomentumSource> {
	static readonly MAX = 10
	static readonly MIN = -6
	static readonly INITIAL = 2
	static readonly RESET_MIN = 0

	constructor() {
		const fields = foundry.data.fields
		super(
			{
				meterMax: MomentumField.MAX,
				meterMin: MomentumField.MIN,
				initialValue: MomentumField.INITIAL,
				label: 'IRONSWORN.Momentum'
			},
			{
				resetValue: new fields.NumberField({
					initial: MomentumField.INITIAL,
					min: MomentumField.RESET_MIN,
					max: MomentumField.MAX,
					integer: true
				})
			}
		)
	}

	override migrateSource(
		sourceData: CharacterDataSourceData,
		fieldData: MomentumSource
	): void {
		super.migrateSource(sourceData, fieldData)
		if (typeof sourceData?.momentum === 'number') {
			console.log('Migrating sourceData, fieldData', sourceData, fieldData)
			IronswornActor._addDataFieldMigration(
				sourceData,
				'momentumReset',
				'momentum.resetValue'
			)
			IronswornActor._addDataFieldMigration(
				sourceData,
				'momentumMax',
				'momentum.max'
			)
		}
	}
}
export interface MomentumField extends MomentumSource {}

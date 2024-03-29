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

	override _cast(value: unknown): any {
		// Cast numberish values to a meter-shaped object
		return Number.isNumeric(value)
			? { value: Number(value) }
			: super._cast(value)
	}

	override migrateSource(sourceData: object, fieldData: any) {
		// migrate legacy asset condition meters
		IronswornActor._addDataFieldMigration(fieldData, 'current', 'value')

		// the _cast method above handles migrations from simple number values

		return super.migrateSource(sourceData, fieldData)
	}
}

export class ConditionMeterField extends MeterField {
	constructor(options) {
		super(options, {})
	}
}

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
				// it's for later use by ActiveEffect to model impact/debility behavior
				// if you need to get at the resetValue, use the getter Actor.system.momentumReset instead. otherwise, it won't be sensitive to impacts.
				resetValue: new fields.NumberField({
					initial: MomentumField.INITIAL,
					min: MomentumField.RESET_MIN,
					max: MomentumField.MAX,
					integer: true
				})
			}
		)
	}
}
export interface MomentumField extends MomentumSource {}

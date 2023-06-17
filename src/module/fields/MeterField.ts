import { IronswornActor } from '../actor/actor'
import type { CharacterDataSourceData } from '../actor/subtypes/character'
import type { DataSchema } from './utils'

export interface MeterField extends MeterSource {}
export interface MeterSource {
	noRecover?: boolean | undefined
	value: number
	max: number
	min: number
}

interface MeterFieldOptions<
	T extends ConditionMeterSource = ConditionMeterSource
> extends foundry.data.fields.SchemaField.Options<T> {
	meterMax: number
	meterMin: number
	absoluteMin?: number
	absoluteMax?: number
	initialValue: number
}

export abstract class MeterField<
	T extends MeterSource = MeterSource
> extends foundry.data.fields.SchemaField<T> {
	constructor(
		{
			meterMin = 0,
			meterMax = 5,
			initialValue = meterMax,
			absoluteMax,
			absoluteMin = 0,
			...options
		}: Partial<MeterFieldOptions<T>>,
		extendFields: DataSchema<Omit<T, keyof MeterSource>>
	) {
		const Fields = foundry.data.fields
		const schema: DataSchema<T> = {
			noRecover: new Fields.BooleanField({
				required: false,
				initial: undefined,
				nullable: true
			}),
			value: new Fields.NumberField({
				integer: true,
				initial: initialValue
			}),
			max: new Fields.NumberField({
				integer: true,
				initial: meterMax,
				max: absoluteMax
			}),
			min: new Fields.NumberField({
				integer: true,
				readonly: true,
				initial: meterMin,
				min: absoluteMin
			}),
			...(extendFields ?? {})
		} as any
		super(schema, options)
	}

	migrateSource(sourceData: object, fieldData: any) {
		// migrate single value meters to unified meter format
		if (typeof fieldData === 'number') {
			fieldData = { value: fieldData.valueOf() }
		}

		// migrate asset meters to unified meter format
		IronswornActor._addDataFieldMigration(fieldData, 'current', 'value')

		super.migrateSource(sourceData, fieldData)
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
	/** The absolute maximum for `Momentum.value` */
	static readonly MAX = 10
	/** The absolute minimum for `Momentum.value` */
	static readonly MIN = -6
	/** The default `Momentum.resetValue`, also used to initialize `Momentum.value` */
	static readonly INITIAL = 2
	/** The absolute minimum of `Momentum.resetValue` */
	static readonly RESET_MIN = 0
	/** The minimum `Momentum.value` required before burning momentum. */
	static readonly BURN_MIN = 3

	constructor() {
		const fields = foundry.data.fields
		super(
			{
				meterMax: MomentumField.MAX,
				meterMin: MomentumField.MIN,
				absoluteMax: MomentumField.MAX,
				absoluteMin: MomentumField.MIN,
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

	override migrateSource(sourceData: any, fieldData: any): void {
		super.migrateSource(sourceData, fieldData)

		// migrate to momentum object
		if (typeof sourceData.momentum === 'number') {
			sourceData.momentum = { value: sourceData.momentum.valueOf() }

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

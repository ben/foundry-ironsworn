import { inRange } from 'lodash-es'

export interface MeterField extends MeterSource {}
export interface MeterSource {
	value: number
	max: number
	min: number
}

function migrateMeterField(_: object, fieldData: any) {
	if (typeof fieldData === 'number') {
		fieldData = { value: fieldData }
	}
}

interface ConditionMeterFieldOptions
	extends foundry.data.fields.SchemaField.Options<ConditionMeterSource> {
	meterMax: number
	initialValue: number
}

export class ConditionMeterField extends foundry.data.fields
	.SchemaField<ConditionMeterSource> {
	constructor({
		meterMax = 5,
		initialValue = meterMax,
		...options
	}: Partial<ConditionMeterFieldOptions>) {
		const fields = foundry.data.fields
		super(
			{
				value: new fields.NumberField({ integer: true, initial: initialValue }),
				max: new fields.NumberField({ integer: true, initial: meterMax }),
				min: new fields.NumberField({
					integer: true,
					readonly: true,
					initial: 0
				})
			},

			options
		)
	}

	migrateSource(sourceData: object, fieldData: any) {
		migrateMeterField(sourceData, fieldData)
		super.migrateSource(sourceData, fieldData)
	}
}

export interface ConditionMeterSource extends MeterSource {}

export interface MomentumSource extends MeterSource {
	resetValue: number
}

export class MomentumField extends foundry.data.fields
	.SchemaField<MomentumSource> {
	static readonly MAX = 10
	static readonly MIN = -6
	static readonly INITIAL = 2
	static readonly RESET_MIN = 0

	constructor() {
		const fields = foundry.data.fields
		super(
			{
				max: new fields.NumberField({
					initial: MomentumField.MAX,
					max: MomentumField.MAX
				}),
				min: new fields.NumberField({
					initial: MomentumField.MIN,
					readonly: true
				}),
				value: new fields.NumberField({
					initial: MomentumField.INITIAL,
					max: MomentumField.MAX,
					min: MomentumField.MIN
				}),
				resetValue: new fields.NumberField({
					initial: MomentumField.INITIAL,
					min: MomentumField.RESET_MIN
				})
			},
			{ label: 'IRONSWORN.Momentum' }
		)
	}

	migrateSource(sourceData: object, fieldData: any) {
		migrateMeterField(sourceData, fieldData)
		super.migrateSource(sourceData, fieldData)
	}
}
export interface MomentumField extends MomentumSource {}

import type { DataSchema } from '../fields/utils'

export class Clock<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<ClockSource, ClockSource, Parent> {
	static readonly MIN = 0
	static readonly MAX = 12
	static readonly SIZES = [4, 6, 8, 10, 12]
	static readonly SIZE_MIN = 4

	static override defineSchema(): DataSchema<ClockSource> {
		return {
			value: new foundry.data.fields.NumberField({
				initial: Clock.MIN,
				integer: true,
				min: Clock.MIN,
				max: Clock.MAX,
				label: 'IRONSWORN.SegmentsFilled'
			}),
			max: new foundry.data.fields.NumberField({
				initial: Clock.SIZE_MIN,
				integer: true,
				choices: Clock.SIZES as any[],
				min: Clock.SIZE_MIN,
				max: Clock.MAX,
				label: 'IRONSWORN.SegmentsMax'
			}),
			enabled: new foundry.data.fields.BooleanField({
				required: false,
				label: 'IRONSWORN.Enabled'
			})
		}
	}
}
export interface Clock<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends ClockSource {}

export interface ClockSource {
	value: number
	max: 4 | 6 | 8 | 10 | 12
	enabled?: boolean
}

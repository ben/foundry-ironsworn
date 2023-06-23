import type { DataSchema } from '../fields/utils'

export class Clock<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<ClockSource, ClockSource, Parent> {
	static readonly MIN = 0

	static override defineSchema(): DataSchema<ClockSource> {
		return {
			value: new foundry.data.fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				max: 12,
				label: 'IRONSWORN.SegmentsFilled'
			}),
			max: new foundry.data.fields.NumberField({
				initial: 4,
				integer: true,
				choices: [4, 6, 8, 10, 12],
				min: 4,
				max: 12,
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

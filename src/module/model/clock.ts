import type { ConfiguredDocumentClassForName } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentType } from '../../types/helperTypes'
import type { DataSchema } from '../fields/utils'

export class Clock<
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<ClockSource, ClockSource, Parent> {
	static readonly MIN = 0

	async advance(times = 1) {
		const valueField = this.schema.getField(
			'value'
		) as unknown as foundry.data.fields.NumberField
		const value = Math.clamped(this.value + times, Clock.MIN, this.max)
		return await this.#getNearestDocument()?.update({
			[valueField.fieldPath]: value
		})
	}

	async set(value: number) {
		const valueField = this.schema.getField(
			'value'
		) as unknown as foundry.data.fields.NumberField
		return await this.#getNearestDocument()?.update({
			[valueField.fieldPath]: Math.clamped(value, Clock.MIN, this.max)
		})
	}

	/** Get the most recent Document ancestor */
	#getNearestDocument(): Parent extends foundry.abstract.Document<any, any, any>
		? Parent
		: foundry.abstract.Document<any, any, any> | null
	#getNearestDocument<T extends DocumentType>(
		type: T
	): Parent extends InstanceType<ConfiguredDocumentClassForName<T>>
		? Parent
		: InstanceType<ConfiguredDocumentClassForName<T>> | null
	#getNearestDocument<T extends DocumentType | undefined = undefined>(
		type?: T
	): T extends DocumentType
		? Parent extends InstanceType<ConfiguredDocumentClassForName<T>>
			? Parent
			: InstanceType<ConfiguredDocumentClassForName<T>> | null
		: foundry.abstract.Document<any, any, any> | null {
		let DocClass: typeof foundry.abstract.Document

		if (type == null) DocClass = foundry.abstract.Document
		else
			DocClass = getDocumentClass(type) as ConfiguredDocumentClassForName<
				Exclude<T, undefined>
			>

		if (DocClass == null) return null as any

		if (this.parent instanceof DocClass) return this.parent as any

		let current: foundry.abstract.DataModel.AnyOrDoc | null | undefined =
			this.parent

		while (current != null)
			if (current.parent instanceof DocClass) return current.parent as any
			else current = current.parent

		return null as any
	}

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
			enabled: new foundry.data.fields.BooleanField({ required: false })
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

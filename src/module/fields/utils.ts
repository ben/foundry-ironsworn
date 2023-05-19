/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { cloneDeep, mapValues } from 'lodash-es'

export function Partial<
	T extends Record<string, foundry.data.fields.DataField.Any>
>(data: T) {
	const newSchema = cloneDeep(data)
	return mapValues(newSchema, (v) => (v.required = false))
}

export function enumEntries<T extends Record<any, unknown>>(enumLike: T) {
	const values = Object.values(enumLike).filter(
		(x) => !isNaN(+(x as number | string))
	) as Array<T[keyof T]>
	return values.map((v) => [enumLike[v], v]) as [[keyof T, T[keyof T]]]
}

export type FieldToData<T extends foundry.data.fields.DataField.Any> =
	T extends foundry.data.fields.SchemaField<infer U>
		? { [K in keyof U]: FieldToData<U[K]> }
		: T extends foundry.data.fields.DataField<infer U>
		? U
		: unknown

export type SchemaToSourceData<
	T extends typeof foundry.abstract.DataModel<any, any>
> = {
	[K in keyof ReturnType<T['defineSchema']>]: FieldToData<
		ReturnType<T['defineSchema']>[K]
	>
}

export type DataToField<T> = T extends foundry.data.fields.DataField.Any
	? T
	: T extends number
	? foundry.data.fields.NumberField
	: T extends string
	? foundry.data.fields.StringField
	: T extends boolean
	? foundry.data.fields.BooleanField
	: T extends Iterable<infer U>
	? foundry.data.fields.ArrayField<DataToField<U>, T>
	: T extends Record<infer K, infer U>
	? foundry.data.fields.SchemaField<Record<K, DataToField<U>>>
	: foundry.data.fields.DataField.Any

export type DataToFields<T extends Record<string, any>> = {
	[K in keyof T]: DataToField<T[K]>
}

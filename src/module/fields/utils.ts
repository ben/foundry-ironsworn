/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

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

export type DataToField<T> = T extends FieldToData<infer U> ? U : never

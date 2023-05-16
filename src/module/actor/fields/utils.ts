import type { StringField } from './StringField'
import type { DataField } from './DataField'
import type { NumberField } from './NumberField'
import type { BooleanField } from './BooleanField'
import type { ArrayField, SetField } from './ArrayField'
import { SchemaField } from './SchemaField'

export type FieldDataType<T extends DataField<any, any>> = T extends DataField<
	infer U,
	any
>
	? U
	: never

export type ToField<T> = T extends string
	? StringField<T>
	: T extends number
	? NumberField<T>
	: T extends boolean
	? BooleanField
	: T extends Array<infer U>
	? ArrayField<DataField<U, any>>
	: T extends Set<infer U>
	? SetField<DataField<U, any>>
	: // TODO add collection field when it's done
	T extends Record<string, any>
	? SchemaField<T>
	: never

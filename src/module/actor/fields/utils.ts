/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { SystemDocumentType, SystemTypeData } from '../../../types/helperTypes'
import DataField from './DataField'
import { DataSchema } from './DataModel'
import SchemaField from './SchemaField'

export type DataToField<T> = T extends string
	? foundry.data.fields.StringField<T>
	: T extends number
	? foundry.data.fields.NumberField<T>
	: T extends boolean
	? foundry.data.fields.BooleanField
	: T extends Array<infer U>
	? foundry.data.fields.ArrayField<foundry.data.fields.DataField<U, any>>
	: T extends Set<infer U>
	? foundry.data.fields.SetField<foundry.data.fields.DataField<U, any>>
	: T extends SystemTypeData<infer U, infer F>
	? foundry.data.fields.SystemDataField<U, F>
	: T extends Record<string, any>
	? // TODO add collection field when it's done
	  foundry.data.fields.SchemaField<DataSchema<T>>
	: foundry.data.fields.DataField.Any

export type FieldToData<T extends foundry.data.fields.DataField.Any> =
	T extends foundry.data.fields.SchemaField<infer U>
		? { [K in keyof U]: FieldToData<U[K]> }
		: T extends foundry.data.fields.DataField<infer U>
		? U
		: unknown

type SystemDataModels<T extends SystemDocumentType> = Partial<{
	[K in keyof DataConfig[T]]: foundry.abstract.SystemDataField<
		DataConfig[T][K],
		DataSchema
	>
}>

declare global {
	interface SourceConfig {
		Card: Record<string, unknown>
		Cards: Record<string, unknown>
	}

	interface DataConfig {
		Card: Record<string, unknown>
		Cards: Record<string, unknown>
	}

	interface CONFIG {
		Actor: {
			/** @deprecated since v10. Use `#dataModels` instead */
			systemDataModels: SystemDataModels<'Actor'>
			/** @defaultValue `{}` */
			dataModels: SystemDataModels<'Actor'>
		}
		Item: {
			/** @deprecated since v10. Use `#dataModels` instead */
			systemDataModels: SystemDataModels<'Item'>
			/** @defaultValue `{}` */
			dataModels: SystemDataModels<'Item'>
		}
		JournalEntryPage: {
			/** @deprecated since v10. Use `#dataModels` instead */
			systemDataModels: SystemDataModels<'JournalEntryPage'>
			/** @defaultValue `{}` */
			dataModels: SystemDataModels<'JournalEntryPage'>
		}

		// Cards: {
		// 	/** @deprecated since v10. Use `#dataModels` instead */
		// 	systemDataModels: SystemDataModels<'Cards'>
		// 	/** @defaultValue `{}` */
		// 	dataModels: SystemDataModels<'Cards'>
		// }
		// Card: {
		// 	/** @deprecated since v10. Use `#dataModels` instead */
		// 	systemDataModels: SystemDataModels<'Card'>
		// 	/** @defaultValue `{}` */
		// 	dataModels: SystemDataModels<'Card'>
		// }
	}
}

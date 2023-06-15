import type { AnyDocumentData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs'
import type { Metadata } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'

declare global {
	namespace foundry {
		namespace abstract {
			// export interface Document<
			// 	ConcreteDocumentData extends AnyDocumentData,
			// 	Parent extends Document<any, any, Metadata<any>> | null = null,
			// 	ConcreteMetadata extends Metadata<any> = Metadata<any>
			// > {}
			export namespace Document {
				/**
				 * Define a simple migration from one field name to another.
				 * The value of the data can be transformed during the migration by an optional application function.
				 * @param data - The data object being migrated
				 * @param oldKey - The old field name
				 * @param newKey - The new field name
				 * @param apply - An application function, otherwise the old value is applied
				 * @internal
				 */
				export function _addDataFieldMigration<
					TIn extends object,
					TOut extends object
				>(
					data: TIn,
					oldKey: string,
					newKey: string,
					apply?: (data: TIn) => TOut
				): void
			}
		}
	}
}

export {}

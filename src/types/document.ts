import type { AnyDocumentData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs'
import type { Metadata } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { SourceDataType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

declare global {
	/** A type alias for any client document. */
	export type ClientDocument<
		T extends foundry.abstract.Document<
			any,
			any,
			any
		> = foundry.abstract.Document<any, any, any>
	> = InstanceType<ReturnType<typeof ClientDocumentMixin<ConstructorOf<T>>>>

	export namespace foundry {
		export namespace abstract {
			export interface Document<
				ConcreteDocumentData extends AnyDocumentData,
				Parent extends Document<any, any, Metadata<any>> | null = null,
				ConcreteMetadata extends Metadata<any> = Metadata<any>
			> {
				// from DataModel
				/**
				 * Update the DataModel locally by applying an object of changes to its source data.
				 * The provided changes are cleaned, validated, and stored to the source data object for this model.
				 * The source data is then re-initialized to apply those changes to the prepared data.
				 * The method returns an object of differential changes which modified the original data.
				 *
				 * @param changes - New values which should be applied to the data model
				 *                  (default: `{}`)
				 * @param options - Options which determine how the new data is merged
				 *                  (default: `{}`)
				 * @returns - An object containing the changed keys and values
				 */
				updateSource(
					changes?: DeepPartial<SourceDataType<ConcreteDocumentData>>,
					options?: foundry.abstract.DataModel.UpdateSourceOptions
				): DeepPartial<SourceDataType<ConcreteDocumentData>>
			}
			export namespace Document {
				/**
				 * A reusable helper for adding migration shims.
				 * @protected
				 * @ignore
				 */
				export function _addDataFieldShims(
					data: any,
					shims: Record<string, string>,
					options?: object
				): void

				/**
				 * A reusable helper for adding a migration shim
				 * @protected
				 * @ignore
				 */
				export function _addDataFieldShim(
					data: any,
					oldKey: string,
					newKey: string,
					options?: object
				): void

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

				/**
				 * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
				 * @param source - The candidate source data from which the model will be constructed
				 * @returns Migrated source data, if necessary
				 */
				export function migrateData(source: any): any
				/**
				 * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to support older code which uses this data.
				 * @param data - Data which matches the current schema
				 * @param options - Additional shimming options
				 *                  (default: `{}`)
				 * @returns - Data with added backwards-compatible properties
				 */
				// export function shimData(
				// 	data: Record<string, unknown>,
				// 	options: object
				// ): Record<string, unknown>
				// export function defineSchema<
				// 	T extends Record<string, any>
				// >(): DataSchema<T>

				// /**
				//  * View the schema of this data model in a representative "flattened" format.
				//  */
				// export const flatSchema: DataSchema
			}
		}
	}
}

export {}

/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import type { DocumentConstructor } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
				 */
				export class ArrayField<
					TElementField extends DataField.Any,
					TIterable extends Iterable<any> = Array<
						TElementField extends DataField<infer U, any> ? U : never
					>,
					TOptions extends ArrayField.Options<TIterable> = ArrayField.Options<TIterable>
				> extends DataField<TIterable, TOptions> {
					/**
					 * @param element         A DataField instance which defines the type of element contained in the Array.
					 * @param options  Options which configure the behavior of the field
					 */
					constructor(element: TElementField, options?: Partial<TOptions>)

					element: TElementField

					static _validateElementType(element: unknown)

					/**
					 * Validate every element of the ArrayField
					 * @param value The array to validate
					 * @param options Validation options
					 * @returns A validation failure if any of the elements failed validation, otherwise void.
					 */
					protected _validateElements(
						value: unknown[],
						options: DataField.ValidateOptions
					): DataModelValidationFailure | void

					/**
					 * Migrate this field's candidate source data.
					 * @param sourceData Candidate source data of the root model
					 * @param fieldData The value of this field within the source data
					 */
					migrateSource(sourceData: object, fieldData: any): void
				}
				export namespace ArrayField {
					export interface Options<T> extends DataField.Options<T> {
						/** @default true */
						required: DataField.Options<T>['required']
						/** @default false */
						nullable: DataField.Options<T>['nullable']
						/** @default () => [] */
						initial: DataField.Options<T>['initial']
					}
				}
				// // @ts-expect-error
				// export class SetField<TElement extends DataField<any, any>>
				// 	extends ArrayField<
				// 		TElement,
				// 		Set<TElement extends DataField<infer U, any> ? U : never>
				// 	>
				// 	implements SetField.Options<Set<any>> {}
				// export namespace SetField {
				// 	export interface Options<T extends Set<any>>
				// 		extends ArrayField.Options<T> {}
				// }

				// // TODO
				// // eslint-disable-next-line @typescript-eslint/no-extraneous-class
				// // @ts-expect-error
				// export class EmbeddedCollectionField<
				// 	ConcreteDocumentConstructor extends DocumentConstructor
				// > extends ArrayField<
				// 	DataField<ConcreteDocumentConstructor>,
				// 	// @ts-expect-error *sigh*
				// 	EmbeddedCollection<ConcreteDocumentConstructor, any>
				// > {}

				// export namespace EmbeddedCollectionField {
				// 	type Any = EmbeddedCollectionField<DocumentConstructor>
				// }
			}
		}
	}
}

export default foundry.data.fields

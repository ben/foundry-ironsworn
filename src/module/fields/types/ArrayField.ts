/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

import type { IterableElement } from '../utils'

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
				 */
				export class ArrayField<
					ConcreteData extends Iterable<any> = any[],
					TElementField extends DataField<
						IterableElement<ConcreteData>
					> = DataField<IterableElement<ConcreteData>>,
					TOptions extends ArrayField.Options<ConcreteData> = ArrayField.Options<ConcreteData>
				> extends DataField<ConcreteData, TOptions> {
					/**
					 * @param element         A DataField instance which defines the type of element contained in the Array.
					 * @param options  Options which configure the behavior of the field
					 */
					constructor(element: TElementField, options?: Partial<TOptions>)

					element: TElementField

					/** @default true */
					static override recursive: boolean

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
					): DataModelValidationFailure<IterableElement<ConcreteData>> | void

					/**
					 * Migrate this field's candidate source data.
					 * @param sourceData Candidate source data of the root model
					 * @param fieldData The value of this field within the source data
					 */
					migrateSource(sourceData: object, fieldData: any): void
				}
				export interface ArrayField<
					ConcreteData extends Iterable<any> = any[],
					TElementField extends DataField<
						IterableElement<ConcreteData>
					> = DataField<IterableElement<ConcreteData>>,
					TOptions extends ArrayField.Options<ConcreteData> = ArrayField.Options<ConcreteData>
				> extends DataField<ConcreteData, TOptions> {}

				export namespace ArrayField {
					export interface Options<
						ConcreteData extends Iterable<any> = Iterable<any>
					> extends DataField.Options<ConcreteData> {
						/** @default true */
						required: DataField.Options<ConcreteData>['required']
						/** @default false */
						nullable: DataField.Options<ConcreteData>['nullable']
						/** @default () => [] */
						initial?: DataField.Options<ConcreteData>['initial']
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

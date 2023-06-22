/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
				 */
				export class ArrayField<
					ElementField extends foundry.data.fields.DataField.Any = foundry.data.fields.DataField.Any,
					SourceData extends any[] = any[],
					ConcreteData extends Iterable<any> = SourceData,
					Options extends foundry.data.fields.DataField.Options<
						SourceData,
						ConcreteData
					> = foundry.data.fields.DataField.Options<SourceData, ConcreteData>
				> extends DataField<SourceData, ConcreteData, Options> {
					/**
					 * @param element - A DataField instance which defines the type of element contained in the Array.
					 * @param options - Options which configure the behavior of the field
					 */
					constructor(element: ElementField, options?: Partial<Options>)

					element: ElementField

					static _validateElementType(element: unknown): void

					/**
					 * Validate every element of the ArrayField
					 * @param value The array to validate
					 * @param options Validation options
					 * @returns A validation failure if any of the elements failed validation, otherwise void.
					 * @throws {DataModelValidationFailure<SourceData>}
					 */
					protected _validateElements(
						value: unknown[],
						options?: DataField.ValidateOptions<SourceData>
					): void

					/**
					 * Migrate this field's candidate source data.
					 * @param sourceData Candidate source data of the root model
					 * @param fieldData The value of this field within the source data
					 */
					migrateSource(sourceData: unknown, fieldData: unknown): void
				}

				// type FieldConcreteData<T extends foundry.data.fields.DataField.Any> =
				// 	ReturnType<T['initialize']>
				// type FieldSourceData<T extends foundry.data.fields.DataField.Any> =
				// 	ReturnType<T['toObject']>

				export namespace ArrayField {
					export interface Options<
						SourceData extends any[] = any[],
						ConcreteData extends Iterable<any> = SourceData
					> extends DataField.Options<SourceData, ConcreteData> {
						/** @default true */
						required: DataField.Options<SourceData, ConcreteData>['required']
						/** @default false */
						nullable: DataField.Options<SourceData, ConcreteData>['nullable']
						/** @default () => [] */
						initial?: DataField.Options<SourceData, ConcreteData>['initial']
					}
				}

				export class SetField<
					ElementField extends foundry.data.fields.DataField.Any = foundry.data.fields.DataField.Any,
					SourceData extends any[] = any[],
					ConcreteData extends Set<any> = Set<any>,
					Options extends foundry.data.fields.DataField.Options<
						SourceData,
						ConcreteData
					> = foundry.data.fields.DataField.Options<SourceData, ConcreteData>
				> extends ArrayField<ElementField, SourceData, ConcreteData, Options> {}

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

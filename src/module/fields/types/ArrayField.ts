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
					ConcreteData extends Iterable<
						foundry.abstract.ConcreteDataOf<ElementField>
					> = Array<foundry.abstract.ConcreteDataOf<ElementField>>,
					Options extends ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					> = ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					>
				> extends DataField<
					Array<foundry.abstract.SourceDataOf<ElementField>>,
					ConcreteData,
					Options
				> {
					/**
					 * @param element         A DataField instance which defines the type of element contained in the Array.
					 * @param options  Options which configure the behavior of the field
					 */
					constructor(element: ElementField, options?: Partial<Options>)

					element: ElementField

					static _validateElementType<
						T extends ConstructorOf<ArrayField<any, any, any>>
					>(
						this: T,
						element: foundry.abstract.SourceDataOf<InstanceType<T>> | unknown
					)

					/**
					 * Validate every element of the ArrayField
					 * @param value The array to validate
					 * @param options Validation options
					 * @returns A validation failure if any of the elements failed validation, otherwise void.
					 */
					protected _validateElements(
						value: unknown[],
						options: DataField.ValidateOptions<
							foundry.abstract.SourceDataOf<ElementField>
						>
					): DataModelValidationFailure<
						foundry.abstract.SourceDataOf<ElementField>
					> | void

					/**
					 * Migrate this field's candidate source data.
					 * @param sourceData Candidate source data of the root model
					 * @param fieldData The value of this field within the source data
					 */
					migrateSource(sourceData: object, fieldData: any): void
				}
				export interface ArrayField<
					ElementField extends foundry.data.fields.DataField.Any = foundry.data.fields.DataField.Any,
					ConcreteData extends Iterable<
						foundry.abstract.ConcreteDataOf<ElementField>
					> = Array<foundry.abstract.ConcreteDataOf<ElementField>>,
					Options extends ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					> = ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					>
				> extends DataField<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData,
						Options
					> {}

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
					ConcreteData extends Set<
						foundry.abstract.ConcreteDataOf<ElementField>
					> = Set<foundry.abstract.ConcreteDataOf<ElementField>>,
					Options extends ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					> = ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					>
				> extends ArrayField<ElementField, ConcreteData, Options> {}

				export interface SetField<
					ElementField extends foundry.data.fields.DataField.Any = foundry.data.fields.DataField.Any,
					ConcreteData extends Set<
						foundry.abstract.ConcreteDataOf<ElementField>
					> = Set<foundry.abstract.ConcreteDataOf<ElementField>>,
					Options extends ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					> = ArrayField.Options<
						Array<foundry.abstract.SourceDataOf<ElementField>>,
						ConcreteData
					>
				> extends ArrayField<ElementField, ConcreteData, Options> {}

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

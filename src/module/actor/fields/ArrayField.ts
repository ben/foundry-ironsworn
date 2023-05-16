/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import { EmbeddedCollectionFieldOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.mjs'
import { DataField, DataModelValidationFailure } from './DataField'

/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 */
export declare class ArrayField<
	TElementField extends DataField<any, any>,
	T extends Iterable<
		TElementField extends DataField<infer U, any> ? U : never
	> = Array<TElementField extends DataField<infer U, any> ? U : never>,
	TOptions extends ArrayField.Options<T> = ArrayField.Options<T>
> extends DataField<T, TOptions> {
	/**
	 * @param element         A DataField instance which defines the type of element contained in the Array.
	 * @param options  Options which configure the behavior of the field
	 */
	constructor(element: TElementField, options: TOptions)

	static _validateElementType(element: unknown)

	/**
	 * Validate every element of the ArrayField
	 * @param value The array to validate
	 * @param options Validation options
	 * @returns A validation failure if any of the elements failed validation, otherwise void.
	 */
	protected _validateElements(
		value: unknown[],
		options: DataField.ValidationOptions
	): DataModelValidationFailure | void

	/**
	 * Migrate this field's candidate source data.
	 * @param sourceData Candidate source data of the root model
	 * @param fieldData The value of this field within the source data
	 */
	migrateSource(sourceData: object, fieldData: any): void
}
export namespace ArrayField {
	export interface Options<T extends Iterable<any>>
		extends DataField.Options<T> {
		/** @default true */
		required: DataField.Options<T>['required']
		/** @default false */
		nullable: DataField.Options<T>['nullable']
		/** @default () => [] */
		initial: DataField.Options<T>['initial']
	}
}

export declare class SetField<TElement extends DataField<any, any>>
	extends ArrayField<
		TElement,
		Set<TElement extends DataField<infer U, any> ? U : never>
	>
	implements SetField.Options<Set<any>> {}
export namespace SetField {
	export interface Options<T extends Set<any>> extends ArrayField.Options<T> {}
}

// export declare class EmbeddedCollectionField<
// 		TElement extends DataField<foundry.abstract.Document<any, any, any>, any>
// 	>
// 	extends ArrayField<
// 		TElement,
// 		EmbeddedCollection<
// 			TElement extends DataField<infer U, any> ? U : never,
// 			TElement extends DataField<infer U, any> ? U['parent'] : never
// 		>
// 	>
// 	implements EmbeddedCollectionField.Options<EmbeddedCollection<any, any>> {}
// export namespace EmbeddedCollectionField {
// 	export interface Options<T extends EmbeddedCollection<any, any>>
// 		extends ArrayField.Options<T> {}
// }

export {}

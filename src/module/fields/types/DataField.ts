/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				export abstract class DataField<
					SourceData = any,
					ConcreteData = SourceData,
					Options extends DataField.Options<
						SourceData,
						ConcreteData
					> = DataField.Options<SourceData, ConcreteData>
				> {
					constructor(options?: Partial<Options>)

					static _defaults: DataField.Options
					options: Options

					/**
					 * Whether this field defines part of a Document/Embedded Document hierarchy.
					 * @default false
					 */
					static hierarchical: boolean

					/**
					 * Does this field type contain other fields in a recursive structure?
					 * Examples of recursive fields are SchemaField, ArrayField, or TypeDataField
					 * Examples of non-recursive fields are StringField, NumberField, or ObjectField
					 * @default false
					 */
					static recursive: boolean

					/**
					 * A dot-separated string representation of the field path within the parent schema.
					 */
					get fieldPath(): string

					/**
					 * Apply a function to this DataField which propagates through recursively to any contained data schema.
					 * @param fn The function to apply
					 * @param value The current value of this field
					 * @param options         Additional options passed to the applied function
					 * @returns The results object
					 */
					apply(fn, value, options?): unknown // DeepPartial<ConcreteData>

					/* -------------------------------------------- */
					/*  Field Cleaning                              */
					/* -------------------------------------------- */

					/**
					 * Coerce source data to ensure that it conforms to the correct data type for the field.
					 * Data coercion operations should be simple and synchronous as these are applied whenever a DataModel is constructed.
					 * For one-off cleaning of user-provided input the sanitize method should be used.
					 * @param value The initial value
					 * @param options Additional options for how the field is cleaned
					 * @returns The cast value
					 */
					clean(value: SourceData | unknown, options: DataField.CleanOptions) // ConcreteData

					/* -------------------------------------------- */

					/**
					 * Apply any cleaning logic specific to this DataField type.
					 * @param value The appropriately coerced value.
					 * @param options Additional options for how the field is cleaned.
					 * @returns The cleaned value.
					 */
					protected _cleanType(value, options) // ConcreteData

					/* -------------------------------------------- */

					/**
					 * Cast a non-default value to ensure it is the correct type for the field
					 * @param value The provided non-default value
					 * @returns The standardized value
					 */
					protected _cast(value): ConcreteData

					/* -------------------------------------------- */

					/**
					 * Attempt to retrieve a valid initial value for the DataField.
					 * @param {object} data   The source data object for which an initial value is required
					 * @returns A valid initial value
					 * @throws An error if there is no valid initial value defined
					 */
					getInitialValue(data): ConcreteData

					/* -------------------------------------------- */
					/*  Field Validation                            */
					/* -------------------------------------------- */

					/**
					 * Validate a candidate input for this field, ensuring it meets the field requirements.
					 * A validation failure can be provided as a raised Error (with a string message), by returning false, or by returning
					 * a DataModelValidationFailure instance.
					 * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
					 * @param value The initial value
					 * @param options Options which affect validation behavior
					 * @returns Returns a DataModelValidationFailure if a validation failure occurred.
					 */
					validate: (
						value: unknown,
						options?: DataField.ValidateOptions<SourceData>
					) => DataModelValidationFailure<SourceData>

					/* -------------------------------------------- */

					/**
					 * Special validation rules which supersede regular field validation.
					 * This validator screens for certain values which are otherwise incompatible with this field like null or undefined.
					 * @param value The candidate value
					 * @returns A boolean to indicate with certainty whether the value is valid. Otherwise, return void.
					 * @throws May throw a specific error if the value is not valid
					 */
					protected _validateSpecial(value: unknown): boolean | void

					/* -------------------------------------------- */

					/**
					 * A default type-specific validator that can be overridden by child classes
					 * @param value The candidate value
					 * @param options Options which affect validation behavior
					 * @returns A boolean to indicate with certainty whether the value is valid, or specific DataModelValidationFailure information, otherwise void.
					 * @throws May throw a specific error if the value is not valid
					 */
					protected _validateType(
						value: SourceData | unknown,
						options?: DataField.ValidateOptions<SourceData>
					): boolean | DataModelValidationFailure<SourceData> | void

					/* -------------------------------------------- */

					/**
					 * Certain fields may declare joint data validation criteria.
					 * This method will only be called if the field is designated as recursive.
					 * @param data - Candidate data for joint model validation
					 * @param options - Options which modify joint model validation
					 * @throws  An error if joint model validation fails
					 */
					protected _validateModel(data: object, options: object)

					/* -------------------------------------------- */
					/*  Initialization and Serialization            */
					/* -------------------------------------------- */

					/**
					 * Initialize the original source data into a mutable copy for the DataModel instance.
					 * @param value The source value of the field
					 * @param model The DataModel instance that this field belongs to
					 * @param options Initialization options
					 * @returns An initialized copy of the source data
					 */
					initialize(
						value: SourceData,
						model: foundry.abstract.DataModel.AnyOrDoc,
						options?: object
					): ConcreteData

					/**
					 * Export the current value of the field into a serializable object.
					 * @param value The initialized value of the field
					 * @returns An exported representation of the field
					 */
					toObject(value: ConcreteData): SourceData

					/**
					 * Recursively traverse a schema and retrieve a field specification by a given path
					 * @param path - The field path as an array of strings
					 */
					protected _getField(path: string[]): undefined | this
				}
				export interface DataField<
					SourceData = any,
					ConcreteData = SourceData,
					Options extends DataField.Options<
						SourceData,
						ConcreteData
					> = DataField.Options<SourceData, ConcreteData>
				> {
					initial: ((data: unknown) => ConcreteData) | ConcreteData
					required: Options['required']
					nullable: Options['nullable']
					readonly: Options['readonly']
					label: Options['label']
					hint: Options['hint']
				}
				export namespace DataField {
					export type Any = DataField<any, any, any>
					export interface CleanOptions {
						/**  Whether to perform partial cleaning? */
						partial?: boolean
						/** The root data model being cleaned */
						source?: unknown
					}
					export type Choices<T extends number | string> =
						| T[]
						| Record<T, string>
						| (() => T[] | Record<T, string>)

					export interface ValidateOptions<SourceData = any> {
						/** Whether this is a partial schema validation, or a complete one.  */
						partial?: boolean
						/**  Whether to allow replacing invalid values with valid fallbacks. */
						fallback?: boolean
						/** The full source object being evaluated. */
						source?: SourceData
						/**
						 * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments collection rather than causing the parent to be considered invalid.
						 */
						dropInvalidEmbedded?: boolean
					}

					export interface Options<
						SourceData = unknown,
						ConcreteData = SourceData
					> {
						/**
						 * Is this field required to be populated?
						 * @default false
						 */
						required: boolean
						/**
						 * Can this field have null values?
						 * @default false
						 */
						nullable: boolean
						/**
						 * The initial value of a field, or a function which assigns that initial value.
						 */
						initial?:
							| ConcreteData
							| Partial<ConcreteData>
							| ((data: SourceData) => ConcreteData | Partial<ConcreteData>)
							| undefined
						/**
						 * A data validation function which accepts one argument with the current value.
						 */
						validate: (value: SourceData) => boolean
						/**
						 * Should the prepared value of the field be read-only, preventing it from being changed unless a change to the _source data is applied.
						 * @default false
						 */
						readonly: boolean
						/**
						 * A localizable label displayed on forms which render this field.
						 */
						label: string
						/**
						 * Localizable help text displayed on forms which render this field.
						 */
						hint: string
						/**
						 * A custom validation error string. When displayed will be prepended with the document name, field name, and candidate value.
						 */
						validationError: string
					}
				}

				export type DataFieldConstructor<
					SourceData = unknown,
					ConcreteData = SourceData,
					Options extends DataField.Options<
						SourceData,
						ConcreteData
					> = DataField.Options<SourceData, ConcreteData>
				> = Pick<
					typeof DataField<SourceData, ConcreteData, Options>,
					keyof typeof DataField<SourceData, ConcreteData, Options>
				> &
					(new (...args: any[]) => DataField<SourceData, ConcreteData, Options>)

				export class DataModelValidationFailure<T = unknown>
					implements DataModelValidationFailure.Options<T>
				{
					constructor(options?: Partial<DataModelValidationFailure.Options<T>>)
					invalidValue: unknown
					fallback: T
					dropped: boolean
					message: string
					unresolved: boolean
				}
				export namespace DataModelValidationFailure {
					export interface Options<T = any> {
						/** The value that failed validation for this field. */
						invalidValue: unknown
						/**
						 * The value it was replaced by, if any.
						 */
						fallback: T
						/**
						 * Whether the value was dropped from some parent collection.
						 * @default false
						 */
						dropped: boolean
						/**  The validation error message. */
						message: string
						/**  Whether this failure was unresolved */
						unresolved: boolean
					}
				}

				type AnyFn = (...args: any[]) => any

				type ApplyOption<T> = MethodKeys<T, AnyFn> | AnyFn

				type ApplyMethod<
					This,
					Options,
					Value = unknown,
					ReturnValue = unknown
				> = (this: This, value: Value, options?: Options) => ReturnValue
				type ApplyMethodByKey<T, K extends keyof T> = T[K] extends AnyFn
					? T[K]
					: never

				type ExtractMethods<T, F extends AnyFn = AnyFn> = Extract<T[keyof T], F>
				type MethodKeys<T, F extends AnyFn = AnyFn> = keyof ExtractMethods<T, F>
			}
		}
	}
}

export default foundry.data.fields
export {}

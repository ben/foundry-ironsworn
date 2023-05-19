/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				export abstract class DataField<
					T,
					TOptions extends DataField.Options<T> = DataField.Options<T>
				> implements Omit<DataField.Options<T>, 'validate'>
				{
					constructor(options?: Partial<TOptions>)
					readonly: boolean

					required: boolean
					nullable: boolean

					initial: ((data: object) => T) | T

					label: string
					hint: string
					validationError: string

					static _defaults: DataField.Options

					/**
					 * A dot-separated string representation of the field path within the parent schema.
					 * @type {string}
					 */
					get fieldPath(): string

					/**
					 * Apply a function to this DataField which propagates through recursively to any contained data schema.
					 * @param fn The function to apply
					 * @param value The current value of this field
					 * @param {object} [options={}]         Additional options passed to the applied function
					 * @returns {object}                    The results object
					 */
					apply(
						fn:
							| MethodKeys<this, (...args: any[]) => any>
							| ((...args: any[]) => any),
						value: T,
						options?
					)

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
					clean(value: unknown, options: DataField.CleanOptions): T

					/* -------------------------------------------- */

					/**
					 * Apply any cleaning logic specific to this DataField type.
					 * @param value The appropriately coerced value.
					 * @param options Additional options for how the field is cleaned.
					 * @returns The cleaned value.
					 */
					protected _cleanType(value: T, options: DataField.CleanOptions): T

					/* -------------------------------------------- */

					/**
					 * Cast a non-default value to ensure it is the correct type for the field
					 * @param value The provided non-default value
					 * @returns The standardized value
					 */
					protected _cast(value: unknown): T

					/* -------------------------------------------- */

					/**
					 * Attempt to retrieve a valid initial value for the DataField.
					 * @param {object} data   The source data object for which an initial value is required
					 * @returns A valid initial value
					 * @throws An error if there is no valid initial value defined
					 */
					getInitialValue(data): T

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
						options?: DataField.ValidateOptions<T>
					) => DataModelValidationFailure<T>

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
						value: unknown,
						options?: DataField.ValidateOptions
					): boolean | DataModelValidationFailure | void

					/* -------------------------------------------- */

					/**
					 * Certain fields may declare joint data validation criteria.
					 * This method will only be called if the field is designated as recursive.
					 * @param {object} data       Candidate data for joint model validation
					 * @param {object} options    Options which modify joint model validation
					 * @throws  An error if joint model validation fails
					 * @internal
					 */
					_validateModel(data, options?)

					/* -------------------------------------------- */
					/*  Initialization and Serialization            */
					/* -------------------------------------------- */

					/**
					 * Initialize the original source data into a mutable copy for the DataModel instance.
					 * @param value The source value of the field
					 * @param {Object} model The DataModel instance that this field belongs to
					 * @param options Initialization options
					 * @returns An initialized copy of the source data
					 */
					initialize(value: unknown, model, options?): T

					/**
					 * Export the current value of the field into a serializable object.
					 * @param value The initialized value of the field
					 * @returns An exported representation of the field
					 */
					toObject(
						value: T
					): T extends { toObject: () => any } ? ReturnType<T['toObject']> : T

					/**
					 * Recursively traverse a schema and retrieve a field specification by a given path
					 * @param {string[]} path             The field path as an array of strings
					 * @protected
					 */
					_getField(path): undefined | this
				}
				export namespace DataField {
					export type Any = DataField<any, any>
					export interface CleanOptions {
						/**  Whether to perform partial cleaning? */
						partial?: boolean
						/** The root data model being cleaned */
						source?: object
					}
					export type Choices<T extends number | string> =
						| T[]
						| Record<T, string>
						| ((...args: any[]) => T[])

					export interface ValidateOptions<TValue = any> {
						/** Whether this is a partial schema validation, or a complete one.  */
						partial?: boolean
						/**  Whether to allow replacing invalid values with valid fallbacks. */
						fallback?: boolean
						/** The full source object being evaluated. */
						source?: TValue
						/**
						 * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments collection rather than causing the parent to be considered invalid.
						 */
						dropInvalidEmbedded?: boolean
					}

					export interface Options<TValue = any> {
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
						initial: TValue | ((data: object) => TValue)
						/**
						 * A data validation function which accepts one argument with the current value.
						 */
						validate: (value: any) => boolean
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

				export class DataModelValidationFailure<T = any>
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

				type ExtractMethods<
					T,
					F extends (...args: any[]) => any = (...args: any[]) => any
				> = Extract<T[keyof T], F>
				type MethodKeys<
					T,
					F extends (...args: any[]) => any = (...args: any[]) => any
				> = keyof ExtractMethods<T, F>
			}
		}
	}
}

export default foundry.data.fields
export {}

/* eslint-disable @typescript-eslint/no-namespace */

import { Data } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll'
import type { Document } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs'
import type { SchemaField } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.mjs'
import { DataToField } from '../utils'

export interface DataSchema
	extends Record<string, foundry.data.fields.DataField.Any> {}

type AnyDocument = Document<any, any, any>

declare global {
	namespace foundry {
		namespace abstract {
			export abstract class DataModel<
				ConcreteDataSchema extends DataSchema,
				Parent extends DataModel.Any | null = null
			> {
				constructor(
					data: ConcreteDataSchema,
					options?: foundry.data.fields.DataField.ValidateOptions & {
						parent?: Parent
					}
				)

				/**
				 * Configure the data model instance before validation and initialization workflows are performed.
				 */
				protected _configure(
					options?: foundry.data.fields.DataField.ValidateOptions
				): void
				/**
				 * The source data object for this DataModel instance.
				 * Once constructed, the source object is sealed such that no keys may be added nor removed.
				 */
				readonly _source: ConcreteDataSchema

				/**
				 * The defined and cached Data Schema for all instances of this DataModel.
				 */
				private static readonly _schema: foundry.data.fields.SchemaField<any>

				/**
				 * An immutable reverse-reference to a parent DataModel to which this model belongs.
				 */
				readonly parent: Parent

				/* ---------------------------------------- */
				/*  Data Schema                             */
				/* ---------------------------------------- */

				/**
				 * Define the data schema for documents of this type.
				 * The schema is populated the first time it is accessed and cached for future reuse.
				 * @abstract
				 */
				static defineSchema(): DataSchema

				/**
				 * The Data Schema for all instances of this DataModel.
				 */
				static get schema(): foundry.data.fields.SchemaField<
					Record<string, any>
				>

				/**
				 * Define the data schema for this document instance.
				 */
				get schema(): foundry.data.fields.SchemaField<ConcreteDataSchema>

				/**
				 * Is the current state of this DataModel invalid?
				 * The model is invalid if there is any unresolved failure.
				 */
				get invalid(): boolean

				/**
				 * An array of validation failure instances which may have occurred when this instance was last validated.
				 */
				get validationFailures(): {
					fields: DataModelValidationFailure<ConcreteDataSchema> | null
					joint: DataModelValidationFailure<ConcreteDataSchema> | null
				}

				/* ---------------------------------------- */
				/*  Data Cleaning Methods                   */
				/* ---------------------------------------- */

				/**
				 * Initialize the source data for a new DataModel instance.
				 * One-time migrations and initial cleaning operations are applied to the source data.
				 * @param data - The candidate source data from which the model will be constructed
				 * @param options - Options provided to the model constructor
				 * @returns Migrated and cleaned source data which will be stored to the model instance
				 */
				protected _initializeSource(
					data: object | this,
					options?: object
				): object

				/**
				 * Clean a data source object to conform to a specific provided schema.
				 * @param source The source data object
				 * @param options Additional options which are passed to field cleaning methods
				 * @returns The cleaned source data
				 */
				static cleanData(source?: object, options?: object): object

				/* ---------------------------------------- */
				/*  Data Initialization                     */
				/* ---------------------------------------- */

				/**
				 * A generator that orders the DataFields in the DataSchema into an expected initialization order.
				 */
				protected static _initializationOrder(): Generator<
					[string, foundry.data.fields.DataField<any, any>]
				>

				/**
				 * Initialize the instance by copying data from the source object to instance attributes.
				 * This mirrors the workflow of foundry.data.fields.SchemaField#initialize but with some added functionality.
				 * @param options - Options provided to the model constructor
				 */
				protected _initialize(options?: object): void

				/**
				 * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
				 */
				reset(): void

				/**
				 * Clone a model, creating a new data model by combining current data with provided overrides.
				 * @param data - Additional data which overrides current document data at the time of creation
				 * @param context - Context options passed to the data model constructor
				 * @returns The cloned Document instance
				 */
				clone(data?: object, context?: object): this | Promise<this>

				/* ---------------------------------------- */
				/*  Data Validation Methods                 */
				/* ---------------------------------------- */

				/**
				 * Validate the data contained in the document to check for type and content
				 * @param options - Optional parameters which customize how validation occurs. (default: `{}`)
				 * @throw This function throws an error if data within the document is not valid
				 * @return An indicator for whether the document contains valid data
				 */
				validate(options?: DataModel.ValidateOptions): boolean

				/* ---------------------------------------- */

				/**
				 * Get an array of validation errors from the provided error structure
				 * @param options - (default: `{}`)
				 */
				static formatValidationErrors(
					errors: Record<string, Error>,
					options?: DataModel.FormatValidationErrorsOptions
				): string

				/* ---------------------------------------- */

				/**
				 * Jointly validate the overall data model after each field has been individually validated.
				 * @param data - The candidate data object to validate
				 * @throws - An error if a validation failure is detected
				 */
				protected _validateModel(
					data: object // foundry.abstract.DataModel.Schema<this['schema']>
				): void

				/* ---------------------------------------- */
				/*  Data Management                         */
				/* ---------------------------------------- */

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
					changes?: DeepPartial<DataModel.SchemaToSource<ConcreteDataSchema>>,
					options?: DataModel.UpdateSourceOptions
				): Partial<DataModel.SchemaToSource<ConcreteDataSchema>>

				/* ---------------------------------------- */

				/**
				 * Update the source data for a specific DataSchema.
				 * @param schema - The data schema to update
				 * @param source - Source data to be updated
				 * @param changes - Changes to apply to the source data
				 * @param options - Options which modify the update workflow
				 *                           (default: `{}`)
				 * @returns The updated source data
				 * @throws - An error if the update operation was unsuccessful
				 */
				static #updateData(
					schema: DataSchema,
					source: Record<string, unknown>,
					changes: Record<string, unknown>,
					options: DataModel.UpdateDataOptions
				): Record<string, unknown>

				/* ---------------------------------------- */

				/**
				 * Update the source data for a specific foundry.data.fields.DataField.
				 * @param name - The field name being updated
				 * @param field - The field definition being updated
				 * @param source - The source object being updated
				 * @param value - The new value for the field
				 * @param options - Options which modify the update workflow
				 * @throws - An error if the new candidate value is invalid
				 */
				static #updateField(
					name: string,
					field: foundry.data.fields.DataField.Any,
					source: Record<string, unknown>,
					value: unknown,
					options: Record<string, unknown>
				): Record<string, unknown>

				/* ---------------------------------------- */
				/*  Serialization and Storage               */
				/* ---------------------------------------- */

				/**
				 * Copy and transform the DataModel into a plain object.
				 * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
				 * @param source - Draw values from the underlying data source rather than transformed values
				 *                 (default: `true`)
				 * @returns The extracted primitive object
				 */
				toObject(source?: true): this['_source']

				toObject(source: false): object

				/* ---------------------------------------- */

				/**
				 * Extract the source data for the DataModel into a simple object format that can be serialized.
				 * @returns - The document source data expressed as a plain object
				 */
				toJSON(): object // ToObjectType<this, true>

				/* -------------------------------------------- */

				/**
				 * Create a new instance of this DataModel from a source record.
				 * The source is presumed to be trustworthy and is not strictly validated.
				 * @param source - Initial document data which comes from a trusted source.
				 * @param context - Model construction context
				 */
				protected static fromSource(
					source: object,
					context: DataModel.FromSourceContext
				): DataModel.Any

				/* ---------------------------------------- */

				/**
				 * Create a DataModel instance using a provided serialized JSON string.
				 * @param json - Serialized document data in string format
				 * @returns - A constructed data model instance
				 */
				static fromJSON(json: string): DataModel.Any

				/* -------------------------------------------- */

				/**
				 * View the schema of this data model in a representative "flattened" format.
				 */
				static get flatSchema(): DataSchema

				/* -------------------------------------------- */
				/*  Deprecations and Compatibility              */
				/* -------------------------------------------- */

				/**
				 * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
				 * @param source - The candidate source data from which the model will be constructed
				 * @returns Migrated source data, if necessary
				 */
				static migrateData(
					source: Record<string, unknown>
				): Record<string, unknown>

				/* ---------------------------------------- */

				/**
				 * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to support older code which uses this data.
				 * @param data - Data which matches the current schema
				 * @param options - Additional shimming options
				 *                  (default: `{}`)
				 * @returns - Data with added backwards-compatible properties
				 */
				static shimData(
					data: Record<string, unknown>,
					options: DataModel.ShimDataOptions
				): Record<string, unknown>
			}

			export namespace DataModel {
				export type SchemaToData<T extends DataSchema> = {
					[K in keyof T]: DataToField<T[K]>
				}

				export type SchemaToSource<T extends DataSchema> = SchemaToData<T>

				export type ConstructorOptions = InexactPartial<{
					/**
					 * A parent DataModel instance to which this DataModel belongs
					 * @default null
					 */
					parent: Any | null
					/**
					 * Control the strictness of validation for initially provided data
					 * @default true
					 */
					strict: boolean
				}>

				export type FormatValidationErrorsOptions = InexactPartial<{
					/** A prefix label that should prepend any error messages */
					label: string

					/** A field namespace that should prepend key names with dot-notation */
					namespace: string
				}>
				export type CleanDataOptions = Partial<{
					/**
					 * Allow partial cleaning of source data, ignoring absent fields
					 * @default false
					 */
					partial: boolean
				}>
				export type InitializeOptions = Record<string, never>
				export type ValidateOptions<
					SourceData extends Record<string, unknown> = Record<string, unknown>
				> = InexactPartial<{
					/** A specific set of proposed changes to validate, rather than the full source data of the model. */
					changes: DeepPartial<SourceData>
					/**
					 * If changes are provided, attempt to clean the changes before validating them?
					 * @default false
					 */
					clean: boolean
					/**
					 * Allow replacement of invalid values with valid defaults?
					 * @default false
					 */
					fallback: boolean
					/**
					 * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments collection rather than causing the parent to be considered invalid.
					 * @default false
					 */
					dropInvalidEmbedded: boolean
					/**
					 * Throw if an invalid value is encountered, otherwise log a warning?
					 * @default true
					 */
					strict: boolean
					/**
					 * Perform validation on individual fields?
					 * @default true
					 */
					fields: boolean
					/**
					 * Perform joint validation on the full data model?
					 *
					 * Joint validation will be performed by default if no changes are passed.
					 *
					 * Joint validation will be disabled by default if changes are passed.
					 *
					 * Joint validation can be performed on a complete set of changes (for example testing a complete data model) by explicitly passing `true`.
					 */
					joint: boolean
				}>
				export type FromSourceContext = {
					/**
					 * Models created from trusted source data are validated non-strictly
					 * (default: `false`)
					 */
					strict?: boolean
				} & Record<string, unknown>

				export interface UpdateSourceOptions {
					/**
					 * Allow replacement of invalid values with valid defaults?
					 * (default: `false`)
					 */
					fallback: boolean
				}

				export type UpdateDataOptions = {
					_backup: Record<string, unknown>
					_diff: Record<string, unknown>
				} & UpdateFieldOptions

				export interface UpdateFieldOptions {
					/**
					 * Allow replacement of invalid values with valid defaults?
					 * (default: `false`)
					 */
					fallback?: boolean
					recursive?: boolean
					_collections?: Record<
						string,
						foundry.data.fields.EmbeddedCollectionField<any, any>
					>
					_diff: Record<string, unknown>
				}

				export type ShimDataOptions = Partial<{
					/**
					 * Apply shims to embedded models?
					 * (default: `true`)
					 */
					embedded: boolean
				}>

				// export type InitializedDataFor<Model extends Any> =
				// 	Model extends DataModel<any, infer ConcreteDataSchema>
				// 		? SchemaToData<ConcreteDataSchema>
				// 		: never

				// export type SchemaToSourceInputSimple<
				// 	ConcreteDataSchema extends DataSchema
				// > = FlattenSystem<
				// 	GetSchemaValue<
				// 		ConstructReadonly<RemoveIndex<ConcreteDataSchema>>,
				// 		'SourceType'
				// 	>
				// >

				// export type SchemaToSourceInput<ConcreteDataSchema extends DataSchema> =
				// 	FlattenSystem<
				// 		// TODO
				// 		GetSchemaValue<
				// 			ConstructPartial<
				// 				ConstructReadonly<RemoveIndex<ConcreteDataSchema>>,
				// 				'SourceType'
				// 			>,
				// 			'SourceType'
				// 		>
				// 	>

				// type ConstructPartial<
				// 	ConcreteDataSchema extends DataSchema,
				// 	ExtendsOptionsKey extends keyof foundry.data.fields.DataField.AnyExtendsOptions
				// > = PartialProps<
				// 	ConcreteDataSchema,
				// 	{
				// 		// Essentially tests this condition that will give if it's required:
				// 		//   !fieldTypes(field, ExtendsOptionsKey).includes(initial) ||
				// 		//   (field instanceof StringField && blank === false && initial === '')
				// 		// In both cases validation will automatically fail if given no value thusly a value must be given to prevent this error.
				// 		[K in keyof ConcreteDataSchema]: Or<
				// 			// Check if the initial type is in any of the field source types
				// 			Not<
				// 				ItemExtends<
				// 					foundry.data.fields.DataField.InitialTypeFor<
				// 						ConcreteDataSchema[K]
				// 					>,
				// 					FieldType<ConcreteDataSchema[K], ExtendsOptionsKey>
				// 				>
				// 			>,
				// 			'blank' extends keyof ConcreteDataSchema[K]
				// 				? And<
				// 						Extends<ConcreteDataSchema[K]['blank'], false>,
				// 						Equals<ConcreteDataSchema[K]['initial'], ''>
				// 				  >
				// 				: false
				// 		> extends false
				// 			? K
				// 			: never
				// 	}[keyof ConcreteDataSchema]
				// >

				// export type SchemaToSource<ConcreteDataSchema extends DataSchema> =
				// 	FlattenSystem<
				// 		GetSchemaValue<
				// 			ConstructReadonly<RemoveIndex<ConcreteDataSchema>>,
				// 			'SourceType'
				// 		>
				// 	>

				// export type FieldType<
				// 	Field extends foundry.data.fields.DataField.Any,
				// 	Key extends keyof foundry.data.fields.DataField.AnyExtendsOptions
				// > =
				// 	| foundry.data.fields.DataField.ExtendsOptionsFor<Field>[Key]
				// 	| foundry.data.fields.DataField.ExtraTypes<Field>

				// export type GetSchemaValue<
				// 	ConcreteDataSchema extends DataSchema,
				// 	ExtendsOptionsKey extends keyof foundry.data.fields.DataField.AnyExtendsOptions
				// > = {
				// 	[K in keyof ConcreteDataSchema]: GetFieldType<
				// 		ConcreteDataSchema[K],
				// 		ExtendsOptionsKey
				// 	>
				// }

				// export type GetFieldType<
				// 	T,
				// 	ExtendsOptionsKey extends keyof foundry.data.fields.DataField.AnyExtendsOptions
				// > = T extends DataField<infer Options, infer ExtendsOptions>
				// 	? FieldType<T, ExtendsOptionsKey>
				// 	: T

				// export type ConstructReadonly<ConcreteDataSchema extends DataSchema> =
				// 	ReadonlyProps<
				// 		ConcreteDataSchema,
				// 		{
				// 			[K in keyof ConcreteDataSchema]: ConcreteDataSchema[K]['readonly'] extends true
				// 				? K
				// 				: never
				// 		}[keyof ConcreteDataSchema]
				// 	>

				// The given source and data type of system is a lie. It's a union that looks like `{ type: SubType1, system: SystemData1 } | ...`, when in reality it's just `SystemData1 | SystemData2 | ...`
				// However, it keeps these types extraordinarily simple compared to alternatives.
				type DistributeSystem<
					ConstructedSchema extends Record<string, unknown>
				> = [unknown] extends ConstructedSchema['system']
					? ConstructedSchema
					: ConstructedSchema['system'] &
							Omit<ConstructedSchema, 'type' | 'system'>

				// type FlattenSystem<ConstructedSchema extends Record<string, unknown>> =
				// 	[unknown] extends ConstructedSchema['system']
				// 		? ConstructedSchema
				// 		: {
				// 				system: GetKey<ConstructedSchema['system'], 'system', never>
				// 		  } & Omit<ConstructedSchema, 'system'>

				// export type SchemaToData<ConcreteDataSchema extends DataSchema> =
				// 	FlattenSystem<
				// 		GetSchemaValue<
				// 			ConstructReadonly<RemoveIndex<ConcreteDataSchema>>,
				// 			'InitializedType'
				// 		>
				// 	>

				// HACK: in v10+, documents derive from DataModel
				export type Any = DataModel<any, any> | AnyDocument

				export type AnyConstructor = Pick<
					typeof DataModel,
					keyof typeof DataModel
				> &
					(abstract new (...params: any[]) => DataModel.Any)
			}

			export class DataModelValidationFailure<T = unknown>
				implements Required<DataModelValidationFailure.Options<T>>
			{
				constructor({
					invalidValue,
					fallback,
					dropped,
					message,
					unresolved
				}: DataModelValidationFailure.Options<T>)

				invalidValue: unknown
				fallback: T
				dropped: boolean
				message: string
				unresolved: boolean

				/**
				 * If this field contains other fields that are validated as part of its validation, their results are recorded here.
				 */
				fields: keyof T extends string
					? { [K in keyof T & string]: DataModelValidationFailure<T[K]> }
					: Record<string, unknown>

				/**
				 * Record whether a validation failure is unresolved.
				 * This reports as true if validation for this field or any hierarchically contained field is unresolved.
				 * A failure is unresolved if the value was invalid and there was no valid fallback value available.
				 */
				elements: T extends Iterable<any>
					? DataModelValidationFailure.ElementValidationFailure<T>
					: []

				/**
				 * Return this validation failure as an Error object.
				 */
				asError(): DataModelValidationError
				/**
				 * Whether this failure contains other sub-failures.
				 */
				isEmpty(): boolean
				/**
				 * Return the base properties of this failure, omitting any nested failures.
				 */
				toObject(): {
					invalidValue: unknown
					fallback: T
					dropped: boolean
					message: string
				}
			}

			export namespace DataModelValidationFailure {
				export interface ElementValidationFailure<
					T extends Iterable<any> = Iterable<unknown>
				> {
					/** Either the element's index or some other identifier for it. */
					id: string | number
					/** Optionally a user-friendly name for the element. */
					name?: string
					/** The element's validation failure. */
					failure: DataModelValidationFailure<
						T extends Iterable<infer U> ? U : never
					>
				}
				export interface Options<T = unknown> {
					/** The value that failed validation for this field. */
					invalidValue?: unknown
					/** The value it was replaced by, if any. */
					fallback?: T
					/**
					 * Whether the value was dropped from some parent collection.
					 * @default false
					 */
					dropped?: boolean
					/**
					 * The validation error message.
					 */
					message?: string
					/**
					 * Whether this failure was unresolved
					 */
					unresolved?: boolean
				}
			}

			export class DataModelValidationError extends Error {
				/**
				 * @param failure The failure that triggered this error or an error message
				 * @param params Additional Error constructor parameters
				 */
				constructor(
					failure: DataModelValidationFailure | string,
					...params: Parameters<typeof Error>
				)

				/** The root validation failure that triggered this error. */
				#failure: DataModelValidationFailure

				/**
				 * Retrieve the root failure that caused this error, or a specific sub-failure via a path.
				 * @param path The property path to the failure.
				 *
				 * @example Retrieving a failure.
				 * ```js
				 * const changes = {
				 *   "foo.bar": "validValue",
				 *   "foo.baz": "invalidValue"
				 * };
				 * try {
				 *   doc.validate(expandObject(changes));
				 * } catch ( err ) {
				 *   const failure = err.getFailure("foo.baz");
				 *   console.log(failure.invalidValue); // "invalidValue"
				 * }
				 * ```
				 */
				getFailure(path?: string): DataModelValidationFailure

				/**
				 * Retrieve a flattened object of all the properties that failed validation as part of this error.
				 *
				 * @example Removing invalid changes from an update delta.
				 * ```js
				 * const changes = {
				 *   "foo.bar": "validValue",
				 *   "foo.baz": "invalidValue"
				 * };
				 * try {
				 *   doc.validate(expandObject(changes));
				 * } catch ( err ) {
				 *   const failures = err.getAllFailures();
				 *   if ( failures ) {
				 *     for ( const prop in failures ) delete changes[prop];
				 *     doc.validate(expandObject(changes));
				 *   }
				 * }
				 * ```
				 */
				getAllFailures(): Record<string, DataModelValidationFailure>

				/**
				 * Log the validation error as a table.
				 */
				logAsTable(): ReturnType<(typeof console)['table']>

				/**
				 * Generate a nested tree view of the error as an HTML string.
				 */
				asHTML(): string

				/**
				 * Collect nested failures into an aggregate object.
				 * @param failure The failure.
				 * @returns Returns the failure at the leaf of the tree, otherwise an object of sub-failures.
				 */
				static #aggregateFailures(
					failure: DataModelValidationFailure
				):
					| DataModelValidationFailure
					| Record<string, DataModelValidationFailure>
			}
		}
	}
}

export {}

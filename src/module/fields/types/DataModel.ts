/* eslint-disable @typescript-eslint/no-namespace */

import type { Document } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs'
import type {
	ModuleData,
	SystemData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs'
import type { DataSchema } from '../utils'

type AnyDocument = foundry.abstract.Document<any, any, any>
declare global {
	namespace foundry {
		namespace abstract {
			/**
			 * @template SourceData
			 * @template ConcreteData
			 * @template Parent
			 */
			export abstract class DataModel<
				SourceData extends object,
				ConcreteData extends object = SourceData,
				Parent extends DataModel.AnyOrDoc | null = null
			> {
				constructor(
					data: SourceData,
					options?: foundry.data.fields.DataField.ValidateOptions<SourceData> & {
						parent?: Parent
					}
				)

				/**
				 * Configure the data model instance before validation and initialization workflows are performed.
				 * @remarks Source code comments indicate that this is intended for use for subclass configuration.
				 */
				protected _configure(
					options?: foundry.data.fields.DataField.ValidateOptions<SourceData>
				): void
				/**
				 * The source data object for this DataModel instance.
				 * Once constructed, the source object is sealed such that no keys may be added nor removed.
				 */
				readonly _source: Readonly<SourceData>

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
				static defineSchema<T extends DataModelConstructor>(
					this: T
				): T['schema']

				/**
				 * The Data Schema for all instances of this DataModel.
				 */
				static get schema(): DataSchema<any>

				/**
				 * Define the data schema for this document instance.
				 */
				get schema(): foundry.data.fields.SchemaField<SourceData, ConcreteData>

				/**
				 * Is the current state of this DataModel invalid?
				 * The model is invalid if there is any unresolved failure.
				 */
				get invalid(): boolean

				/**
				 * An array of validation failure instances which may have occurred when this instance was last validated.
				 */
				get validationFailures(): {
					fields: DataModelValidationFailure<ConcreteData> | null
					joint: DataModelValidationFailure<ConcreteData> | null
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
				): ConcreteData

				/**
				 * Clean a data source object to conform to a specific provided schema.
				 * @param source The source data object
				 * @param options Additional options which are passed to field cleaning methods
				 * @returns The cleaned source data
				 */
				static cleanData<T extends DataModelConstructor>(
					source?: InstanceType<T>['_source'],
					options?: object
				): InstanceType<T>['_source']

				/* ---------------------------------------- */
				/*  Data Initialization                     */
				/* ---------------------------------------- */

				/**
				 * A generator that orders the DataFields in the DataSchema into an expected initialization order.
				 */
				protected static _initializationOrder<
					T extends DataModelConstructor
				>(): Generator<
					[keyof InstanceType<T>['schema'], ValueOf<InstanceType<T>['schema']>]
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
				protected _validateModel(data: unknown): void

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
					changes?: DeepPartial<SourceData>,
					options?: DataModel.UpdateSourceOptions
				): DeepPartial<SourceData>

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
				// static #updateData(
				// 	schema: any,
				// 	source: Record<string, unknown>,
				// 	changes: Record<string, unknown>,
				// 	options: DataModel.UpdateDataOptions
				// ): Record<string, unknown>

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
				// static #updateField<T extends DataModelConstructor>(
				// 	this: T,
				// 	name: string,
				// 	field: foundry.data.fields.DataField.Any,
				// 	source: Record<string, unknown>,
				// 	value: unknown,
				// 	options: Record<string, unknown>
				// )

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
				toObject<Source extends true>(source?: Source): SourceData
				toObject<Source extends false>(source: Source): SourceData

				/* ---------------------------------------- */

				/**
				 * Extract the source data for the DataModel into a simple object format that can be serialized.
				 * @returns - The document source data expressed as a plain object
				 */
				toJSON(): SourceData

				/* -------------------------------------------- */

				/**
				 * Create a new instance of this DataModel from a source record.
				 * The source is presumed to be trustworthy and is not strictly validated.
				 * @param source - Initial document data which comes from a trusted source.
				 * @param context - Model construction context
				 */
				protected static fromSource<T extends DataModelConstructor>(
					this: T,
					source: InstanceType<T>['_source'],
					context: DataModel.FromSourceContext
				): InstanceType<T>

				/* ---------------------------------------- */

				/**
				 * Create a DataModel instance using a provided serialized JSON string.
				 * @param json - Serialized document data in string format
				 * @returns - A constructed data model instance
				 */
				static fromJSON<T extends DataModelConstructor>(
					this: T,
					json: string
				): InstanceType<T>

				/* -------------------------------------------- */

				/**
				 * View the schema of this data model in a representative "flattened" format.
				 */
				static get flatSchema(): DataSchema<any>

				/* -------------------------------------------- */
				/*  Deprecations and Compatibility              */
				/* -------------------------------------------- */

				/**
				 * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
				 * @param source - The candidate source data from which the model will be constructed
				 * @returns Migrated source data, if necessary
				 */
				static migrateData<T extends DataModelConstructor>(
					this: T,
					source: Record<string, unknown>
				): InstanceType<T>['_source']

				/* ---------------------------------------- */

				/**
				 * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to support older code which uses this data.
				 * @param data - Data which matches the current schema
				 * @param options - Additional shimming options
				 *                  (default: `{}`)
				 * @returns - Data with added backwards-compatible properties
				 */
				static shimData<T extends DataModelConstructor>(
					this: T,
					data: InstanceType<T>['_source'],
					options?: DataModel.ShimDataOptions
				): Record<string, unknown>
			}

			export namespace DataModel {
				export type ConstructorOptions = InexactPartial<{
					/**
					 * A parent DataModel instance to which this DataModel belongs
					 * @default null
					 */
					parent: AnyOrDoc | null
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

				export type Any = DataModel<any, any, any>

				// HACK: in v10+, documents derive from DataModel
				export type AnyOrDoc = Any | AnyDocument
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

			/**
			 * A specialized subclass of DataModel, intended to represent a Document's type-specific data.
			 * Systems or Modules that provide DataModel implementations for sub-types of Documents (such as Actors or Items)
			 * should subclass this class instead of the base DataModel class.
			 *
			 * @see {@link Document}
			 *
			 * @example Registering a custom sub-type for a Module.
			 *
			 * **module.json**
			 * ```json
			 * {
			 *   "id": "my-module",
			 *   "esmodules": ["main.mjs"],
			 *   "documentTypes": {
			 *     "Actor": {
			 *       "sidekick": {},
			 *       "villain": {}
			 *     },
			 *     "JournalEntryPage": {
			 *       "dossier": {},
			 *       "quest": {
			 *         "htmlFields": ["description"]
			 *       }
			 *     }
			 *   }
			 * }
			 * ```
			 *
			 * **main.mjs**
			 * ```js
			 * Hooks.on("init", () => {
			 *   Object.assign(CONFIG.Actor.dataModels, {
			 *     "my-module.sidekick": SidekickModel,
			 *     "my-module.villain": VillainModel
			 *   });
			 *   Object.assign(CONFIG.JournalEntryPage.dataModels, {
			 *     "my-module.dossier": DossierModel,
			 *     "my-module.quest": QuestModel
			 *   });
			 * });
			 *
			 * class QuestModel extends foundry.abstract.TypeDataModel {
			 *   static defineSchema() {
			 *     const fields = foundry.data.fields;
			 *     return {
			 *       description: new fields.HTMLField({required: false, blank: true, initial: ""}),
			 *       steps: new fields.ArrayField(new fields.StringField())
			 *     };
			 *   }
			 *
			 *   prepareDerivedData() {
			 *     this.totalSteps = this.steps.length;
			 *   }
			 * }
			 * ```
			 */
			export abstract class TypeDataModel<
				SourceData extends object = object,
				ConcreteData extends object = SourceData,
				Parent extends AnyDocument & { system: object } = AnyDocument & {
					system: object
				}
			> extends DataModel<SourceData, ConcreteData, Parent> {
				/**
				 * The package that is providing this DataModel for the given sub-type.
				 */
				get modelProvider(): SystemData | ModuleData | null

				/**
				 * Prepare data related to this DataModel itself, before any derived data is computed.
				 */
				prepareBaseData(): void

				/**
				 * Apply transformations of derivations to the values of the source data object.
				 * Compute data fields whose values are not stored to the database.
				 */
				prepareDerivedData(): void
			}
			export interface TypeDataModel<
				SourceData extends object = object,
				ConcreteData extends object = SourceData,
				Parent extends AnyDocument & { system: object } = AnyDocument & {
					system: object
				}
			> extends DataModel<SourceData, ConcreteData, Parent> {}
			export namespace TypeDataModel {}

			// UTILITY TYPES

			export type DataModelConstructor<
				SourceData extends object = object,
				ConcreteData extends object = SourceData,
				Parent extends DataModel.AnyOrDoc | null = null
			> = Pick<
				typeof DataModel<SourceData, ConcreteData, Parent>,
				keyof typeof DataModel<SourceData, ConcreteData, Parent>
			> &
				(new (...args: any[]) => DataModel<SourceData, ConcreteData, Parent>)

			// export type ConcreteDataOf<
			// 	T extends
			// 		| foundry.data.fields.DataField.Any
			// 		| ConstructorOf<foundry.data.fields.DataField.Any>
			// 		| DataModel.Any
			// 		| DataModelConstructor
			// > = T extends DataModel<any, infer ConcreteData, any>
			// 	? ConcreteData
			// 	: T extends ConstructorOf<DataModel<any, infer ConcreteData, any>>
			// 	? ConcreteData
			// 	: T extends foundry.data.fields.DataField<any, infer ConcreteData, any>
			// 	? ConcreteData
			// 	: T extends ConstructorOf<
			// 			foundry.data.fields.DataField<any, infer ConcreteData, any>
			// 	  >
			// 	? ConcreteData
			// 	: never

			// export type SourceDataOf<
			// 	T extends
			// 		| DataModel.Any
			// 		| DataModelConstructor
			// 		| foundry.data.fields.DataField.Any
			// 		| ConstructorOf<foundry.data.fields.DataField.Any>
			// > = T extends DataModel<infer SourceData, any, any>
			// 	? SourceData
			// 	: T extends ConstructorOf<DataModel<infer SourceData, any, any>>
			// 	? SourceData
			// 	: T extends foundry.data.fields.DataField<infer SourceData, any, any>
			// 	? SourceData
			// 	: T extends ConstructorOf<
			// 			foundry.data.fields.DataField<infer SourceData, any, any>
			// 	  >
			// 	? SourceData
			// 	: never

			export type SchemaOf<T extends DataModel.Any | DataModelConstructor> =
				T extends DataModel<any, any, any>
					? T['schema']
					: T extends ConstructorOf<infer U extends DataModel<any, any, any>>
					? U['schema']
					: never
		}
	}
}

export {}

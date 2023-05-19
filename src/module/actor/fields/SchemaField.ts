/* eslint-disable @typescript-eslint/no-namespace */

import type { DataSchema } from './DataModel'

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A special class of {@link DataField} which defines a data schema.
				 */
				export class SchemaField<TDataSchema extends DataSchema>
					extends DataField<TDataSchema, SchemaField.Options<TDataSchema>>
					implements Iterable<ValueOf<TDataSchema>>
				{
					constructor(
						fields: TDataSchema,
						options?: SchemaField.Options<TDataSchema>
					)

					/** The contained field definitions. */
					fields: TDataSchema

					/**
					 * Initialize and validate the structure of the provided field definitions.
					 * @param fields     The provided field definitions
					 * @returns The validated schema
					 */
					protected _initialize(fields: DataSchema): TDataSchema

					/**
					 * Iterate over a SchemaField by iterating over its fields.
					 */
					[Symbol.iterator](): Iterator<ValueOf<TDataSchema>, any, undefined>

					/**
					 * An array of field names which are present in the schema.
					 */
					keys(): Array<keyof TDataSchema>

					/**
					 * An array of DataField instances which are present in the schema.
					 */
					values(): Array<ValueOf<TDataSchema>>

					/**
					 * An array of [name, DataField] tuples which define the schema.
					 */
					entries(): Array<[keyof TDataSchema, ValueOf<TDataSchema>]>
					/**
					 * Test whether a certain field name belongs to this schema definition.
					 * @param fieldName The field name
					 * @returns Does the named field exist in this schema?
					 */
					has(fieldName: string): boolean

					/**
					 * Get a DataField instance from the schema by name
					 * @param fieldName The field name
					 * @returns The DataField instance or undefined
					 */
					get<T extends keyof TDataSchema>(fieldName: T): TDataSchema[T]
					get(fieldName: string): undefined
					get(fieldName: string): DataField.Any | undefined

					/**
					 * Traverse the schema, obtaining the DataField definition for a particular field.
					 * @param fieldName       A field path like ["abilities", "strength"] or "abilities.strength"
					 * @returns The corresponding DataField definition for that field, or undefined
					 */
					getField(
						fieldName: string[] | string
					): SchemaField.Any | DataField.Any | undefined

					override _getField(path): undefined | this
					override _cast(value) // TODO
					_cleanType(data, options) // TODO
					override initialize(value, model, options) // TODO
					override _validateType(data, options) // TODO
					override _validateModel(changes, options) // TODO
					override toObject(value) // TODO
					override apply(fn, data, options) // TODO

					/**
					 * Migrate this field's candidate source data.
					 * @param {object} sourceData   Candidate source data of the root model
					 * @param {any} fieldData       The value of this field within the source data
					 */
					migrateSource(sourceData, fieldData) // TODO
				}
				export namespace SchemaField {
					/** Any SchemaField. */
					export type Any = SchemaField<any>
					export interface Options<T extends DataSchema>
						extends DataField.Options<T> {
						/** @default true */
						required: DataField.Options<T>['required']
						/** @default false */
						nullable: DataField.Options<T>['nullable']
						/** @default {} */
						initial: DataField.Options<T>['initial']
					}
				}

				/**
				 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
				 */
				export class EmbeddedDataField<
					T extends typeof foundry.abstract.DataModel
				> extends SchemaField<InstanceType<T>['schema']['fields']> {
					/**
					 * @param model          The class of DataModel which should be embedded in this field
					 * @param options        Options which configure the behavior of the field
					 */
					constructor(model: T, options?: DataField.Options)

					/**
					 * The embedded DataModel definition which is contained in this field.
					 */
					model: T

					/** @override */
					_initialize(schema)
					/** @override */
					initialize(value, model, options?)
					/** @override */
					toObject(value)
					/**
					 * Migrate this field's candidate source data.
					 * @param {object} sourceData   Candidate source data of the root model
					 * @param {any} fieldData       The value of this field within the source data
					 */
					migrateSource(sourceData, fieldData)
					/** @override */
					_validateModel(changes, options)
				}
			}
		}
	}
}

export default foundry.data.fields

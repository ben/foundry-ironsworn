/* eslint-disable @typescript-eslint/no-namespace */

import type { DataSchema } from '../utils'

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A special class of {@link DataField} which defines a data schema.
				 */
				export class SchemaField<
					SourceData extends object = object,
					ConcreteData extends object = SourceData,
					Options extends SchemaField.Options<
						SourceData,
						ConcreteData
					> = SchemaField.Options<SourceData, ConcreteData>
				> extends DataField<ConcreteData, SchemaField.Options<ConcreteData>> {
					constructor(
						fields: DataSchema<ConcreteData>,
						options?: Partial<SchemaField.Options<ConcreteData>>
					)

					/** @default true */
					static override recursive: boolean

					/** The contained field definitions. */
					fields: DataSchema<ConcreteData>

					/**
					 * Initialize and validate the structure of the provided field definitions.
					 * @param fields     The provided field definitions
					 * @returns The validated schema
					 */
					protected _initialize(fields: DataSchema): this['fields']

					/**
					 * Iterate over a SchemaField by iterating over its fields.
					 */
					[Symbol.iterator](): Iterator<ValueOf<this['fields']>, any, undefined>

					/**
					 * An array of field names which are present in the schema.
					 */
					keys(): Array<keyof this['fields']>

					/**
					 * An array of DataField instances which are present in the schema.
					 */
					values(): Array<ValueOf<this['fields']>>

					/**
					 * An array of [name, DataField] tuples which define the schema.
					 */
					entries(): Array<[keyof this['fields'], ValueOf<this['fields']>]>
					/**
					 * Test whether a certain field name belongs to this schema definition.
					 * @param fieldName The field name
					 * @returns Does the named field exist in this schema?
					 */
					has<T extends keyof this['fields']>(fieldName: T): true
					has(fieldName: string): boolean

					/**
					 * Get a DataField instance from the schema by name
					 * @param fieldName The field name
					 * @returns The DataField instance or undefined
					 */
					get<T extends keyof this['fields']>(fieldName: T): this['fields'][T]
					get(fieldName: string): undefined
					get(fieldName: string): DataField.Any | undefined

					/**
					 * Traverse the schema, obtaining the DataField definition for a particular field.
					 * @param fieldName       A field path like ["abilities", "strength"] or "abilities.strength"
					 * @returns The corresponding DataField definition for that field, or undefined
					 */
					getField(fieldName: string[] | string): DataField.Any | undefined

					/**
					 * Migrate this field's candidate source data.
					 * @param {object} sourceData   Candidate source data of the root model
					 * @param {any} fieldData       The value of this field within the source data
					 */
					migrateSource(sourceData, fieldData): void | SourceData // TODO
				}
				export interface SchemaField<
					SourceData extends object = object,
					ConcreteData extends object = SourceData,
					Options extends SchemaField.Options<
						SourceData,
						ConcreteData
					> = SchemaField.Options<SourceData, ConcreteData>
				> extends Iterable<ValueOf<DataSchema<ConcreteData>>>,
						Omit<
							SchemaField.Options<SourceData, ConcreteData>,
							'validate' | 'initial'
						> {}
				export namespace SchemaField {
					/** Any SchemaField. */
					export type Any = SchemaField<any, any, any>
					export interface Options<
						SourceData extends object = object,
						ConcreteData extends object = SourceData
					> extends DataField.Options<SourceData, ConcreteData> {
						/** @default true */
						required: DataField.Options<SourceData, ConcreteData>['required']
						/** @default false */
						nullable: DataField.Options<SourceData, ConcreteData>['nullable']
						/** @default {} */
						initial: DataField.Options<SourceData, ConcreteData>['initial']
					}
				}

				/**
				 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
				 */
				export class EmbeddedDataField<
					ConcreteConstructor extends foundry.abstract.DataModelConstructor<
						any,
						any,
						any
					> = foundry.abstract.DataModelConstructor<any, any, any>,
					Options extends foundry.data.fields.SchemaField.Options<
						InstanceType<ConcreteConstructor>['_source'],
						InstanceType<ConcreteConstructor>
					> = foundry.data.fields.SchemaField.Options<
						InstanceType<ConcreteConstructor>['_source'],
						InstanceType<ConcreteConstructor>
					>
				> extends SchemaField<
					InstanceType<ConcreteConstructor>['_source'],
					InstanceType<ConcreteConstructor>,
					Options
				> {
					/**
					 * @param model - The class of DataModel which should be embedded in this field
					 * @param options - Options which configure the behavior of the field
					 */
					constructor(model: ConcreteConstructor, options?: Partial<Options>)
					/**
					 * The embedded DataModel definition which is contained in this field.
					 */
					model: ConcreteConstructor

					// /** @override */
					// _initialize(schema)
					// /** @override */
					// initialize(value, model, options?)
					// /** @override */
					// toObject(value)
					/**
					 * Migrate this field's candidate source data.
					 * @param sourceData - Candidate source data of the root model
					 * @param fieldData - The value of this field within the source data
					 */
					migrateSource(
						sourceData:
							| InstanceType<ConcreteConstructor>['parent']['_source']
							| unknown,
						fieldData: InstanceType<ConcreteConstructor>['_source'] | unknown
					): void
					// /** @override */
					// _validateModel(changes, options)
				}
				export interface EmbeddedDataField<
					ConcreteConstructor extends foundry.abstract.DataModelConstructor<
						any,
						any,
						any
					> = foundry.abstract.DataModelConstructor<any, any, any>,
					Options extends foundry.data.fields.SchemaField.Options<
						InstanceType<ConcreteConstructor>['_source'],
						InstanceType<ConcreteConstructor>
					> = foundry.data.fields.SchemaField.Options<
						InstanceType<ConcreteConstructor>['_source'],
						InstanceType<ConcreteConstructor>
					>
				> extends SchemaField<
						InstanceType<ConcreteConstructor>['_source'],
						InstanceType<ConcreteConstructor>,
						Options
					> {}
			}
		}
	}
}

export {}
export default foundry.data.fields

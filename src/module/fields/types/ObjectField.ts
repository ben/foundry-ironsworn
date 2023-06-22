/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
				 */
				export class ObjectField<
					SourceData extends object = object,
					ConcreteData extends object = SourceData,
					Options extends ObjectField.Options<
						SourceData,
						ConcreteData
					> = ObjectField.Options<SourceData, ConcreteData>
				> extends DataField<SourceData, ConcreteData, Options> {}
				export interface ObjectField<
					SourceData extends object = object,
					ConcreteData extends object = SourceData,
					Options extends ObjectField.Options<
						SourceData,
						ConcreteData
					> = ObjectField.Options<SourceData, ConcreteData>
				> extends DataField<SourceData, ConcreteData, Options> {}

				export namespace ObjectField {
					export interface Options<SourceData, ConcreteData>
						extends DataField.Options<SourceData, ConcreteData> {
						/** @default true */
						required: DataField.Options<SourceData, ConcreteData>['required']
						/** @default false */
						nullable: DataField.Options<SourceData, ConcreteData>['nullable']
						/** @default () => {} */
						initial: DataField.Options<SourceData, ConcreteData>['initial'] // To ensure each instance is independent
					}
				}

				export interface DocumentStats {
					/** The package name of the system the Document was created in. */
					systemId?: string
					/** The version of the system the Document was created in. */
					systemVersion?: string
					/** The core version the Document was created in. */
					coreVersion?: string
					/** A timestamp of when the Document was created. */
					createdTime?: number
					/** A timestamp of when the Document was last modified. */
					modifiedTime?: number
					/** The ID of the user who last modified the Document. */
					lastModifiedBy?: string
				}

				/**
				 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
				 */
				export class DocumentOwnershipField extends ObjectField<
					DocumentStats,
					DocumentStats
				> {}
				export interface DocumentOwnershipField
					extends ObjectField<DocumentStats, DocumentStats> {}
			}
		}
	}
}

export default foundry.data.fields

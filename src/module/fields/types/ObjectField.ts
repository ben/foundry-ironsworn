/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
				 */
				// @ts-expect-error
				export class ObjectField<
					ConcreteData extends Record<string, any>,
					TOptions extends DataField.Options<ConcreteData>
				> extends DataField<ConcreteData, TOptions> {
					override _cast: DataField<ConcreteData, TOptions>['_cast']
					override initialize: DataField<ConcreteData, TOptions>['initialize']
					override toObject: DataField<ConcreteData, TOptions>['toObject']
					override _validateType: DataField<
						ConcreteData,
						TOptions
					>['_validateType']
				}
				export namespace ObjectField {
					export interface Options<T extends Record<string, any>>
						extends DataField.Options<T> {
						/** @default true */
						required: DataField.Options<T>['required']
						/** @default false */
						nullable: DataField.Options<T>['nullable']
						/** @default () => {} */
						initial: DataField.Options<T>['initial'] // To ensure each instance is independent
					}
				}

				export interface DocumentStats {
					/** The package name of the system the Document was created in. */
					systemId: string
					/** The version of the system the Document was created in. */
					systemVersion: string
					/** The core version the Document was created in. */
					coreVersion: string
					/** A timestamp of when the Document was created. */
					createdTime: number
					/** A timestamp of when the Document was last modified. */
					modifiedTime: number
					/** The ID of the user who last modified the Document. */
					lastModifiedBy: string
				}

				/**
				 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
				 */
				export class DocumentOwnershipField extends ObjectField<
					DocumentStats,
					DocumentOwnershipField.Options
				> {}
				export namespace DocumentOwnershipField {
					export interface Options extends ObjectField.Options<DocumentStats> {}
				}
			}
		}
	}
}

export default foundry.data.fields

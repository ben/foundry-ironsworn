/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				/**
				 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
				 */
				export class BooleanField extends foundry.data.fields.DataField<
					boolean,
					boolean,
					BooleanField.Options
				> {}
				export interface BooleanField
					extends foundry.data.fields.DataField<
						boolean,
						boolean,
						BooleanField.Options
					> {}
				export namespace BooleanField {
					export interface Options
						extends foundry.data.fields.DataField.Options<boolean, boolean> {
						/** @default true */
						required: DataField.Options<boolean>['required']
						/** @default false */
						nullable: DataField.Options<boolean>['nullable']
						/** @default false */
						initial?: DataField.Options<boolean>['initial']
					}
				}
			}
		}
	}
}

export default foundry.data.fields

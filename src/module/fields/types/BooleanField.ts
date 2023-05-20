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
					BooleanField.Options
				> {}
				export namespace BooleanField {
					export interface Options
						extends foundry.data.fields.DataField.Options {
						/** @default true */
						required: DataField.Options['required']
						/** @default false */
						nullable: DataField.Options['nullable']
						/** @default false */
						initial?: DataField.Options['initial']
					}
				}
			}
		}
	}
}

export default foundry.data.fields

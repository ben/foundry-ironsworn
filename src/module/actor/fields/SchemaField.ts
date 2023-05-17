/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				export class SchemaField<
					T extends Record<string, any>
				> extends DataField<T, SchemaField.Options<T>> {}
				export namespace SchemaField {
					/** Any DataField. */
					export type Any = DataField<any, any>
					export interface Options<T extends Record<string, any>>
						extends DataField.Options<T> {}
				}
			}
		}
	}
}

export {}

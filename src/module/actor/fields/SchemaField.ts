/* eslint-disable @typescript-eslint/no-namespace */

import { DataField } from './DataField'

export declare class SchemaField<
	T extends Record<string, any>
> extends DataField<T, SchemaField.Options<T>> {}
export namespace SchemaField {
	export interface Options<T extends Record<string, any>>
		extends DataField.Options<T> {}
}

export {}

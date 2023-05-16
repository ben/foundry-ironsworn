/* eslint-disable @typescript-eslint/no-namespace */
import { DataField } from './DataField'

/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
 */
export declare class BooleanField extends DataField<
	boolean,
	BooleanField.Options
> {}
export namespace BooleanField {
	export interface Options extends DataField.Options {
		/** @default true */
		required: DataField.Options['required']
		/** @default false */
		nullable: DataField.Options['nullable']
		/** @default false */
		initial: DataField.Options['initial']
	}
}

export {}

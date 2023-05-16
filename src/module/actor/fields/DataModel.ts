/* eslint-disable @typescript-eslint/no-namespace */

export declare abstract class DataModel {
	/**
	 * Configure the data model instance before validation and initialization workflows are performed.
	 */
	protected _configure(options)
	/**
	 * The source data object for this DataModel instance.
	 * Once constructed, the source object is sealed such that no keys may be added nor removed.
	 */
	_source: { [x: string]: any }

	/**
	 * The defined and cached Data Schema for all instances of this DataModel.
	 */
	private static readonly _schema: SchemaField

	/**
	 * An immutable reverse-reference to a parent DataModel to which this model belongs.
	 * @type {DataModel|null}
	 */
	parent: { baseActor: any }
}

export declare class DataModelValidationFailure<T = unknown>
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
		failure: DataModelValidationFailure<T extends Iterable<infer U> ? U : never>
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

export declare class DataModelValidationError extends Error {
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
	): DataModelValidationFailure | Record<string, DataModelValidationFailure>
}

export {}

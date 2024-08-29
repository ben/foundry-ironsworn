/* eslint-disable @typescript-eslint/no-namespace */

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				export class StringField<
					SourceData extends string = string,
					ConcreteData = SourceData,
					Options extends StringField.Options<
						SourceData,
						ConcreteData
					> = StringField.Options<SourceData, ConcreteData>
				> extends DataField<SourceData, ConcreteData, Options> {}

				export interface StringField<
					SourceData extends string = string,
					ConcreteData = SourceData,
					Options extends StringField.Options<
						SourceData,
						ConcreteData
					> = StringField.Options<SourceData, ConcreteData>
				> extends DataField<SourceData, ConcreteData, Options> {
					blank: Options['blank']
					trim: Options['trim']
					choices: Options['choices'] | undefined
					// @ts-expect-error
					nullable: Options['nullable']
				}

				export namespace StringField {
					export interface Options<
						SourceData extends string = string,
						ConcreteData = SourceData
					> extends DataField.Options<SourceData, ConcreteData> {
						/**
						 * Is the string allowed to be blank (empty)?
						 * @default true
						 */
						blank: boolean
						/**
						 * Should any provided string be trimmed as part of cleaning?
						 * @default true
						 */
						trim: boolean
						/**
						 * An array of values or an object of values/labels which represent allowed choices for the field. A function may be provided which dynamically returns the array of choices.
						 */
						choices: ConcreteData extends string | number
							? DataField.Choices<ConcreteData> | undefined
							: never
					}
				}

				/**
				 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
				 * The field may be initially null, but it must be non-null when it is saved to the database.
				 */
				export class DocumentIdField<
					ConcreteData extends
						| foundry.abstract.Document<any, any, any>
						| string = string,
					Options extends DocumentIdField.Options<ConcreteData> = DocumentIdField.Options<ConcreteData>
				> extends StringField<string, ConcreteData, Options> {}
				export namespace DocumentIdField {
					export interface Options<
						ConcreteData extends
							| foundry.abstract.Document<any, any, any>
							| string = string
					> extends StringField.Options<string, ConcreteData> {
						/** @default true */
						required: StringField.Options<string, ConcreteData>['required']
						/** @default false */
						blank: StringField.Options<string, ConcreteData>['blank']
						/** @default true */
						nullable: StringField.Options<string, ConcreteData>['nullable']
						/** @default null */
						initial: StringField.Options<string, ConcreteData>['initial']
						/** @default true */
						readonly: StringField.Options<string, ConcreteData>['readonly']
						/** @default "is not a valid Document ID string" */
						validationError: StringField.Options<
							string,
							ConcreteData
						>['validationError']
					}
				}

				// @ts-expect-error
				export class ForeignDocumentField<
					ConcreteData extends foundry.abstract.Document<
						any,
						any,
						any
					> = foundry.abstract.Document<any, any, any>,
					Options extends ForeignDocumentField.Options<ConcreteData> = ForeignDocumentField.Options<ConcreteData>
				> extends DocumentIdField<ConcreteData, Options> {}
				// @ts-expect-error
				export interface ForeignDocumentField<
					ConcreteData extends foundry.abstract.Document<
						any,
						any,
						any
					> = foundry.abstract.Document<any, any, any>,
					Options extends ForeignDocumentField.Options<ConcreteData> = ForeignDocumentField.Options<ConcreteData>
				> extends DocumentIdField<ConcreteData, Options> {
					idOnly: Options['idOnly']
				}

				export namespace ForeignDocumentField {
					export interface Options<
						ConcreteData extends foundry.abstract.Document<
							any,
							any,
							any
						> = foundry.abstract.Document<any, any, any>
					> extends DocumentIdField.Options<ConcreteData> {
						/** @default true */
						nullable: DocumentIdField.Options<ConcreteData>['nullable']
						/** @default true */
						readonly: DocumentIdField.Options<ConcreteData>['readonly']
						/** @default false */
						idOnly: boolean
					}
				}

				/**
				 * A special [StringField]{@link StringField} which records a standardized CSS color string.
				 */
				export class ColorField extends StringField<
					string,
					string,
					ColorField.Options
				> {
					// @ts-expect-error
					nullable: boolean
				}
				export interface ColorField
					extends StringField<string, string, ColorField.Options> {}
				export namespace ColorField {
					export interface Options extends StringField.Options<string> {
						/** @default true */
						nullable: StringField.Options['nullable']
						/** @default null */
						initial: StringField.Options['initial']
						/** @default false */
						blank: StringField.Options['blank']
						/** @default 'is not a valid hexadecimal color string' */
						validationError: StringField.Options['validationError']
					}
				}

				export class FilePathField<
					T extends FilePathField.FileCategory = FilePathField.FileCategory
				> extends StringField<string, string, FilePathField.Options<T>> {
					categories: T[]
					base64: boolean
					wildcard: boolean

					constructor(options: Partial<FilePathField.Options<T>>)
				}
				export interface FilePathField<
					T extends FilePathField.FileCategory = FilePathField.FileCategory
				> extends StringField<string, string, FilePathField.Options<T>> {}

				export namespace FilePathField {
					export type FileCategory = keyof typeof CONST.FILE_CATEGORIES

					export interface Options<T extends FileCategory = FileCategory>
						extends StringField.Options {
						/**
						 * A set of categories in CONST.FILE_CATEGORIES which this field supports
						 */
						categories: T[]
						/**
						 * Is embedded base64 data supported in lieu of a file path?
						 * @default false
						 */
						base64: boolean
						/**
						 * Does this file path field allow wildcard characters?
						 * @default false
						 */
						wildcard: boolean
					}
				}
				/**
				 * A special [StringField]{@link StringField} which contains serialized JSON data.
				 */
				export class JSONField<ConcreteData = any> extends StringField<
					string,
					ConcreteData,
					JSONField.Options<ConcreteData>
				> {}
				export interface JSONField<ConcreteData = any>
					extends StringField<
						string,
						ConcreteData,
						JSONField.Options<ConcreteData>
					> {}
				export namespace JSONField {
					export interface Options<ConcreteData>
						extends StringField.Options<string, ConcreteData> {
						/** @default false */
						blank: StringField.Options<string, ConcreteData>['blank']
						/** @default undefined */
						initial: StringField.Options<string, ConcreteData>['initial']
						/** @default 'is not a valid JSON string' */
						validationError: StringField.Options<
							string,
							ConcreteData
						>['validationError']
					}
				}

				/**
				 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
				 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
				 * require sanitization of user input.
				 */
				export class HTMLField extends StringField<
					string,
					string,
					HTMLField.Options
				> {}
				export interface HTMLField
					extends StringField<string, string, HTMLField.Options> {}

				export namespace HTMLField {
					export interface Options extends StringField.Options {
						/** @default true */
						required: StringField.Options['required']
						/** @default true */
						blank: StringField.Options['blank']
					}
				}
			}
		}
	}
}

export default foundry.data.fields

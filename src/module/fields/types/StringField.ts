/* eslint-disable @typescript-eslint/no-namespace */

import { RequireKey } from 'dataforged'

declare global {
	namespace foundry {
		namespace data {
			namespace fields {
				export class StringField<
						T extends string = string,
						TOptions extends StringField.Options<T> = StringField.Options<T>
					>
					extends DataField<T, TOptions>
					implements Omit<StringField.Options<T>, 'validate'>
				{
					blank: boolean
					trim: boolean
					choices: DataField.Choices<T> | undefined
					// @ts-expect-error
					nullable: boolean
				}
				export namespace StringField {
					export interface Options<T extends string = string>
						extends DataField.Options<T> {
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
						choices: DataField.Choices<T> | undefined
					}
				}

				/**
				 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
				 * The field may be initially null, but it must be non-null when it is saved to the database.
				 */
				export class DocumentIdField
					extends StringField<string, DocumentIdField.Options>
					implements Omit<DocumentIdField.Options, 'validate'> {}
				export namespace DocumentIdField {
					export interface Options extends StringField.Options {
						/** @default true */
						required: StringField.Options['required']
						/** @default false */
						blank: StringField.Options['blank']
						/** @default true */
						nullable: StringField.Options['nullable']
						/** @default null */
						initial: StringField.Options['initial']
						/** @default true */
						readonly: StringField.Options['readonly']
						/** @default "is not a valid Document ID string" */
						validationError: StringField.Options['validationError']
					}
				}

				// @ts-expect-error
				export class ForeignDocumentField
					extends DocumentIdField
					implements ForeignDocumentField.Options
				{
					idOnly: boolean
				}
				export namespace ForeignDocumentField {
					export interface Options extends DocumentIdField.Options {
						/** @default true */
						nullable: DocumentIdField.Options['nullable']
						/** @default true */
						readonly: DocumentIdField.Options['readonly']
						/** @default false */
						idOnly: boolean
					}
				}

				/**
				 * A special [StringField]{@link StringField} which records a standardized CSS color string.
				 */
				export class ColorField extends StringField<
					string,
					ColorField.Options
				> {
					// @ts-expect-error
					nullable: boolean
				}
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
					>
					extends StringField<string, FilePathField.Options<T>>
					implements Omit<FilePathField.Options<T>, 'validate'>
				{
					categories: T[]
					base64: boolean
					wildcard: boolean

					constructor(
						options: RequireKey<Partial<FilePathField.Options<T>>, 'categories'>
					)
				}

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
				export class JSONField extends StringField<string, JSONField.Options> {}
				export namespace JSONField {
					export interface Options extends StringField.Options {
						/** @default false */
						blank: StringField.Options['blank']
						/** @default undefined */
						initial: StringField.Options['initial']
						/** @default 'is not a valid JSON string' */
						validationError: StringField.Options['validationError']
					}
				}

				/**
				 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
				 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
				 * require sanitization of user input.
				 */
				export class HTMLField
					extends StringField<string, HTMLField.Options>
					implements Omit<HTMLField.Options, 'validate'> {}
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

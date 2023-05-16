/* eslint-disable @typescript-eslint/no-namespace */

import { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import {
	ConfiguredDocumentClassForName,
	DocumentSubTypes,
	DocumentType,
	SystemDocumentType
} from '../../../types/helperTypes'
import { DataField } from './DataField'

/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
 */
export declare class ObjectField<
	T extends Record<string, any>,
	TOptions extends DataField.Options<T>
> extends DataField<T, TOptions> {
	override _cast: DataField<T, TOptions>['_cast']
	override initialize: DataField<T, TOptions>['initialize']
	override toObject: DataField<T, TOptions>['toObject']
	override _validateType: DataField<T, TOptions>['_validateType']
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
export declare class DocumentOwnershipField extends ObjectField<
	DocumentStats,
	DocumentOwnershipField.Options
> {}
export namespace DocumentOwnershipField {
	export interface Options extends ObjectField.Options<DocumentStats> {}
}

type SystemDocument<T extends SystemDocumentType = SystemDocumentType> =
	ConfiguredDocumentClassForName<T>

type SystemTypeData<
	T extends SystemDocument,
	U extends DocumentSubTypes<T['documentName']>
> = ConfiguredData<T['documentName']> & { type: U }

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a type-specific data object.
 */
export declare class TypeDataField<
	TDocType extends SystemDocument,
	TSubtypeData extends SystemTypeData<
		TDocType,
		DocumentSubTypes<TDocType['documentName']>
	>
> extends ObjectField<TSubtypeData, TypeDataField.Options<TSubtypeData>> {
	/**
	 * @param document - The base document class which belongs in this field
	 * @param options - Options which configure the behavior of the field
	 */
	constructor(document: TDocType, options?: TypeDataField.Options<TSubtypeData>)

	/**
	 * Return the package that provides the sub-type for the given model.
	 * @param {DataModel} model       The model instance created for this sub-type.
	 * @returns {System|Module|null}
	 */
	static getModelProvider<T extends TypeDataField<SystemDocument, any>>(
		model: T
	): foundry.packages.SystemData | foundry.packages.ModuleData

	document: InstanceType<TDocType>
	get documentName(): TDocType['documentName']

	/**
	 * Get the DataModel definition that should be used for this type of document.
	 * @param {string} type              The Document instance type
	 * @returns {typeof DataModel|null}  The DataModel class or null
	 */
	getModelForType(type: DocumentSubTypes<TDocType['documentName']>) // TODO: point it at configured model types
}
export namespace TypeDataField {
	export interface Options<T extends SystemTypeData<SystemDocument, any>>
		extends ObjectField.Options<T> {
		/** @default true */
		required: ObjectField.Options<T>['required']
	}
}

export {}

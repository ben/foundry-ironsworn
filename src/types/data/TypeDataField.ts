/* eslint-disable @typescript-eslint/no-namespace */
import { Document } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs'
import {
	ModuleData,
	SystemData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs'
import {
	ConfiguredDocumentClass,
	ConfiguredDocumentClassForName,
	DocumentConstructor,
	DocumentSubTypes,
	DocumentType
} from '../helperTypes'
import { DataField, ObjectField } from './fields'

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a type-specific data object.
 */
declare global {
	export class TypeDataField<
		TDocument extends ConfiguredDocumentClassForName<DocumentType>
	> extends ObjectField<DataField.Options<TDocument>> {
		/**
		 * @param document      The base document class which belongs in this field
		 * @param options      Options which configure the behavior of the field
		 */
		constructor(document: TDocument, options?: object)

		static getModelProvider(model): SystemData | ModuleData

		get documentName(): TDocument['documentName']

		getModelForType(type: DocumentSubTypes<TDocument>)
		// : CONFIG[this['documentName']['dataModels'][typeof type]]

		// migrateSource: InstanceType<TDocument>['migrateData']
	}
}

export {}

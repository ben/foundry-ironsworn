import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token'
import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import type { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import type {
	ConfiguredData,
	ConfiguredDocumentClassForName
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type {
	ConfiguredDocumentClass,
	DocumentConstructor,
	DocumentSubTypes
} from '../../types/helperTypes'
import { IronActiveEffect } from '../active-effect/active-effect'
import { CreateActorDialog } from '../applications/createActorDialog'
import type { IronswornItem } from '../item/item'
import type { ActorDataProperties } from './config'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'

let CREATE_DIALOG: CreateActorDialog

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 */
export class IronswornActor<
	T extends DocumentSubTypes<'Actor'> = any
> extends Actor {
	// Type hack for v10 compatibility updates
	declare system: Extract<ActorDataProperties, { type: T }>['system']
	// @ts-expect-error
	declare type: T

	override get itemTypes() {
		return super.itemTypes as Actor['itemTypes'] & {
			[K in DocumentSubTypes<'Item'>]: Array<IronswornItem<K>>
		}
	}

	moveSheet?: SFCharacterMoveSheet

	/**
	 * A helper function to toggle a status effect which includes an Active Effect template
	 * @param effectData The Active Effect data
	 * @param overlay Should the Active Effect icon be displayed as an overlay on the token?
	 * @param active Force a certain active state for the effect.
	 * @returns Whether the Active Effect is now on or off
	 */
	async toggleActiveEffect(
		effectData: StatusEffect,
		{ overlay = false, active }: { overlay?: boolean; active?: boolean } = {}
	): Promise<boolean> {
		if (effectData.id == null) return false

		// Remove existing single-status effects.
		const existing = this.effects.reduce((arr: string[], e) => {
			if (e.statuses.size === 1 && e.statuses.has(effectData.id))
				arr.push(e.id as string)
			return arr
		}, [])
		const state = active ?? existing.length === 0
		if (!state && existing.length > 0)
			await this.deleteEmbeddedDocuments('ActiveEffect', existing)
		// Add a new effect
		else if (state) {
			const cls = getDocumentClass('ActiveEffect')
			const createData = foundry.utils.deepClone(effectData)
			;(createData as any).statuses = [effectData.id]
			// @ts-expect-error
			delete createData.id
			;(cls as any).migrateDataSafe(createData)
			;(cls as any).cleanData(createData)
			createData.label = game.i18n.localize(createData.label as string)
			if (overlay) createData['flags.core.overlay'] = true
			await cls.create(createData, { parent: this })
		}
		return state
	}

	/**
	 * Typeguard: is the provided value an IronswornActor instance of the specified type?
	 */
	static assert<T extends ConfiguredData<'Actor'>['type']>(
		actor: unknown,
		subtype: T
	): actor is IronswornActor<T> {
		return actor instanceof IronswornActor && actor.type === subtype
	}

	/** Typeguard: is this an instance of the specified type? */
	assert<T extends ConfiguredData<'Actor'>['type']>(
		subtype: T
	): this is IronswornActor<T> {
		return IronswornActor.assert(this, subtype)
	}

	static async createDialog(data, _options = {}) {
		if (CREATE_DIALOG == null) CREATE_DIALOG = new CreateActorDialog()
		CREATE_DIALOG.options.folder = data?.folder
		CREATE_DIALOG.render(true)
		return undefined
	}

	get toolset(): 'ironsworn' | 'starforged' {
		// We can't use IronswornSettings helpers here, it breaks the import orders
		// First check if the toolbox is set to one or the other
		const toolbox = game.settings.get('foundry-ironsworn', 'toolbox') as string
		if (toolbox === 'ironsworn') return 'ironsworn'
		if (toolbox === 'starforged') return 'starforged'

		// Set to "match sheet", so check for a specific setting on this actor

		if (this.type === 'character') {
			return this.hasStarforgedSheet ? 'starforged' : 'ironsworn'
		}

		// Nope, now check the default character sheet class
		const sheetClasses = game.settings.get('core', 'sheetClasses') as any
		return sheetClasses.Actor?.character ===
			'ironsworn.StarforgedCharacterSheet'
			? 'starforged'
			: 'ironsworn'
	}

	protected override _onCreate(_data, _options, _userId): void {
		if (this.assert('character')) {
			// insert disabled placeholder effects for custom impacts, which are used to persist player-set labels
			const effectIDs = ['custom1', 'custom2']
			for (const id of effectIDs) {
				if (!this.effects.contents.some((fx: any) => fx.statuses.has(id)))
					void this.createEmbeddedDocuments(
						'ActiveEffect',
						[
							CONFIG.IRONSWORN.IronActiveEffect.createImpact({
								id,
								disabled: true
							}) as any
						],
						{ suppressLog: true } as any
					)
			}
		}

		if (this.assert('character') || this.assert('shared'))
			void this.createEmbeddedDocuments(
				'Item',
				[{ type: 'bondset', name: 'bonds' }],
				{
					suppressLog: true
				} as any
			)
	}
}
export interface IronswornActor<T extends DocumentSubTypes<'Actor'> = any>
	extends Actor {
	type: T
	statuses: Set<string>
	get effects(): EmbeddedCollection<
		ConfiguredDocumentClass<typeof foundry.documents.BaseActiveEffect> &
			DocumentConstructor,
		ActorData
	>
}

declare global {
	interface DocumentClassConfig {
		Actor: typeof IronswornActor
	}
}

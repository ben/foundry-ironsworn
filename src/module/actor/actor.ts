import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token'
import { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import { BaseUser } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
import { IronActiveEffect } from '../active-effect/active-effect'
import { CreateActorDialog } from '../applications/createActorDialog'
import type { IronswornItem } from '../item/item'
import type { ActorDataProperties, ActorDataSource } from './config'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'

let CREATE_DIALOG: CreateActorDialog

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 */
export class IronswornActor<
	T extends DocumentSubTypes<'Actor'> = DocumentSubTypes<'Actor'>
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

	protected override async _preCreate(
		data: ActorDataConstructorData,
		options: DocumentModificationOptions,
		user: BaseUser
	): Promise<void> {
		if (data.type === 'character') {
			// insert disabled placeholder effects for custom impacts, which are used to persist player-set labels
			const effectIDs = ['custom1', 'custom2']
			if (data.effects == null) data.effects = []
			for (const id of effectIDs) {
				const fxIdx = data.effects.findIndex((fx) => fx?._id === id)
				if (fxIdx === -1)
					data.effects.push(
						IronActiveEffect.createImpact({ id, disabled: true })
					)
			}
		}
		await super._preCreate(data, options, user)
	}

	/**
	 * A helper function to toggle a status effect which includes an Active Effect template
	 * @remarks Patterned after `Token#toggleActiveEffect`
	 * @param effectData The Active Effect data, including statusId
	 * @param options Options to configure application of the Active Effect
	 * @param options.overlay Should the Active Effect icon be displayed as an overlay on the token? (default: `true`)
	 * @param options.active Force a certain active state for the effect.
	 * @returns Whether the Active Effect is now on or off
	 */
	async toggleActiveEffect(
		effectData: StatusEffect,
		options: { overlay?: boolean; active?: boolean }
	): Promise<boolean> {
		// Remove an existing effect
		const existing = this.effects.find(
			(e) => e.getFlag('core', 'statusId') === effectData.id
		)
		const state = options.active ?? existing == null
		if (!state && existing != null) await existing.delete()
		// Add a new effect
		else if (state) {
			const createData = IronActiveEffect.statusToActiveEffectData(effectData)
			if (options.overlay != null) createData['flags.core.overlay'] = true
			const cls = getDocumentClass('ActiveEffect')
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
			return this.sheet?.constructor.name === 'StarforgedCharacterSheet'
				? 'starforged'
				: 'ironsworn'
		}

		// Nope, now check the default character sheet class
		const sheetClasses = game.settings.get('core', 'sheetClasses') as any
		return sheetClasses.Actor?.character ===
			'ironsworn.StarforgedCharacterSheet'
			? 'starforged'
			: 'ironsworn'
	}
}
export interface IronswornActor<
	T extends DocumentSubTypes<'Actor'> = DocumentSubTypes<'Actor'>
> extends Actor {
	type: T
}

declare global {
	interface DocumentClassConfig {
		Actor: typeof IronswornActor
	}
}

// TODO: would it make sense to do this with IronswornActor#_onCreate instead?
Hooks.on('createActor', async (actor: IronswornActor) => {
	if (!['character', 'shared'].includes(actor.type)) return
	await Item.createDocuments([{ type: 'bondset', name: 'bonds' }], {
		parent: actor,
		suppressLog: true
	} as any)
})

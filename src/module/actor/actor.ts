import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
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
	// declare system:
	declare system: Extract<ActorDataProperties, { type: T }>['system']

	get type() {
		return super.type as T
	}

	override get itemTypes() {
		return super.itemTypes as Actor['itemTypes'] & {
			[K in DocumentSubTypes<'Item'>]: Array<IronswornItem<K>>
		}
	}

	moveSheet?: SFCharacterMoveSheet

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

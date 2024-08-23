import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { DocumentSubTypes } from '../../types/helperTypes'
import { CreateActorDialog } from '../applications/createActorDialog'
import { IronswornSettings } from '../helpers/settings'
import { typedDeleteDialog } from '../helpers/util'
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
	// declare system:
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

	// TODO: retire this altogether
	get toolset(): 'ironsworn' | 'starforged' | 'sunderedisles' {
		// If set to "match sheet", check for this character's sheet
		const toolbox = IronswornSettings.get('toolbox')
		if (toolbox == 'sheet' && this.type === 'character') {
			if (this.sheet?.constructor.name === 'StarforgedCharacterSheet')
				return 'starforged'
			if (this.sheet?.constructor.name === 'IronswornCharacterSheetV2')
				return 'ironsworn'
			// TODO: sundered isles
		}

		// Fall back to the global default
		return IronswornSettings.defaultToolbox
	}

	override async deleteDialog(options?: Partial<DialogOptions>) {
		return await typedDeleteDialog(this, options)
	}
}
export interface IronswornActor<T extends DocumentSubTypes<'Actor'> = any>
	extends Actor {
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

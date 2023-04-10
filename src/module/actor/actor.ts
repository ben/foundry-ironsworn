import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import { CreateActorDialog } from '../applications/createActorDialog'
import type {
	CharacterDataPropertiesData,
	SiteDataPropertiesData
} from './actortypes'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'

let CREATE_DIALOG: CreateActorDialog

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
	// Type hack for v10 compatibility updates
	declare system: typeof this.data.data

	moveSheet?: SFCharacterMoveSheet

	protected override _onCreate(
		data: this['data']['_source'],
		options: DocumentModificationOptions,
		userId: string
	): void {
		super._onCreate(data, options, userId)
		switch (this.type) {
			case 'site':
				// initialize sourceId flags for denizens
				{
					const denizens = (this.system as SiteDataPropertiesData).denizens.map(
						(denizen) => {
							if (denizen.flags == null) denizen.flags = {}
							if (denizen.flags['foundry-ironsworn'] == null)
								denizen.flags['foundry-ironsworn'] = {}
							denizen.flags['foundry-ironsworn'].sourceId = this.id
							return denizen
						}
					)
					this.update({ system: { denizens } })
				}

				break
			default:
				break
		}
	}

	static async createDialog(data, _options = {}) {
		if (!CREATE_DIALOG) CREATE_DIALOG = new CreateActorDialog()
		CREATE_DIALOG.options.folder = data?.folder
		CREATE_DIALOG.render(true)
		return undefined
	}

	async burnMomentum() {
		if (this.type != 'character') return
		const { momentum, momentumReset } = this
			.system as CharacterDataPropertiesData
		console.log({ momentum, momentumReset })
		if (momentum > momentumReset) {
			this.update({
				system: { momentum: momentumReset }
			})
		}
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

declare global {
	interface DocumentClassConfig {
		Actor: typeof IronswornActor
	}
}

Hooks.on('createActor', async (actor: IronswornActor) => {
	if (!['character', 'shared'].includes(actor.type)) return
	await Item.createDocuments([{ type: 'bondset', name: 'bonds' }], {
		parent: actor,
		suppressLog: true
	} as any)
})

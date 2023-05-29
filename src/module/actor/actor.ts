import { CreateActorDialog } from '../applications/createActorDialog'
import type {
	CharacterDataPropertiesData,
	SiteDataPropertiesData
} from './actortypes'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'
import { OracleTable } from '../roll-table/oracle-table'
import { Oracles } from '../roll-table/oracles'

let CREATE_DIALOG: CreateActorDialog

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
	// Type hack for v10 compatibility updates
	declare system: typeof this.data.data

	moveSheet?: SFCharacterMoveSheet

	static async createDialog(data, _options = {}) {
		if (!CREATE_DIALOG) CREATE_DIALOG = new CreateActorDialog()
		CREATE_DIALOG.options.folder = data?.folder
		CREATE_DIALOG.render(true)
		return undefined
	}

	async burnMomentum() {
		if (this.type !== 'character') return
		const { momentum, momentumReset } = this
			.system as CharacterDataPropertiesData
		console.log({ momentum, momentumReset })
		if (momentum > momentumReset) {
			this.update({
				system: { momentum: momentumReset }
			})
		}
	}

	/** The delve site's theme. */
	get theme() {
		if (this.type !== 'site') return undefined
		return this.itemTypes['delve-theme'][0]
	}

	/** The delve site's domain. */
	get domain() {
		if (this.type !== 'site') return undefined
		return this.itemTypes['delve-domain'][0]
	}

	/** The delve site's computed Features table */
	get features() {
		// TODO: is there a good way to cache this?
		if (this.type !== 'site' || this.theme == null || this.domain == null)
			return undefined
		return new OracleTable({
			name: game.i18n.localize('IRONSWORN.DELVESITE.Features'),
			results: [
				// @ts-expect-error
				...this.theme.system.features,
				// @ts-expect-error
				...this.domain.system.features
			],
			formula: '1d100',
			flags: {
				'foundry-ironsworn': {
					sourceId: this.uuid,
					type: 'delve-site-features'
				}
			}
		})
	}

	/**
	 * The delve site's computed Dangers table.
	 * @remarks Ideally this would be a sync getter like its brothers, but currently it needs to grab results from a table by its Dataforged ID.
	 */
	async getDangers() {
		if (this.type !== 'site' || this.theme == null || this.domain == null)
			return undefined

		// TODO: is it worth trying to cache this?
		const oracle = await Oracles.find('Ironsworn/Oracles/Moves/Reveal_a_Danger')
		if (oracle == null) return

		return new OracleTable({
			name: game.i18n.localize('IRONSWORN.DELVESITE.Dangers'),
			results: [
				// @ts-expect-error
				...this.theme.system.dangers,
				// @ts-expect-error
				...this.domain.system.dangers,
				// Omits the first two rows
				...oracle.toObject().results.slice(2)
			],
			formula: '1d100',
			flags: {
				'foundry-ironsworn': {
					sourceId: this.uuid,
					type: 'delve-site-dangers'
				}
			}
		})
	}

	/** The delve site's computed Denizens table */
	get denizens() {
		if (this.type !== 'site') return
		return new OracleTable({
			name: game.i18n.localize('IRONSWORN.DELVESITE.Denizens'),
			formula: '1d100',
			results: (this.system as SiteDataPropertiesData).denizens,
			flags: {
				'foundry-ironsworn': {
					sourceId: this.uuid,
					type: 'delve-site-denizens'
				}
			}
		})
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

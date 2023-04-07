import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import { CreateActorDialog } from '../applications/createActorDialog'
import { getFoundryTableByDfId } from '../dataforged'
import type {
	CharacterDataPropertiesData,
	SiteDataPropertiesData
} from './actortypes'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'
import type {
	DelveThemeDataProperties,
	DelveDomainDataProperties
} from '../item/itemtypes'
import { OracleTable } from '../roll-table/oracle-table'
import {
	TableResultDataConstructorData,
	TableResultDataProperties
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'

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
				// initialize sourceUuid flags for denizens
				{
					const denizens = (this.system as SiteDataPropertiesData).denizens.map(
						(denizen) => {
							denizen.flags['foundry-ironsworn'].sourceUuid = this.id
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

	/** A computed subtitle used by this site in feature, danger, and denizen roll messages  */
	get subtitle() {
		if (this.type !== 'site') return undefined
		return `${this.name as string} – ${this.theme?.name as string} ${
			this.domain?.name as string
		}`
	}

	/** The delve site's computed Features table */
	getFeatures() {
		// TODO: is there a good way to cache this?
		if (this.type !== 'site' || this.theme == null || this.domain == null)
			return undefined
		const results = [
			// @ts-expect-error
			...this.theme.system.features,
			// @ts-expect-error
			...this.domain.system.features
		] as TableResultDataConstructorData[]

		const name = game.i18n.localize('IRONSWORN.DELVESITE.Features')

		return new OracleTable({
			name,
			results,
			flags: {
				'foundry-ironsworn': {
					subtitle: this.subtitle,
					sourceUuid: this.uuid,
					type: 'delve-site-features'
				}
			}
		})
	}

	/** The delve site's computed Dangers table */
	async getDangers() {
		// TODO: is it worth trying to cache this?
		if (this.type !== 'site' || this.theme == null || this.domain == null)
			return undefined

		const oracle = await getFoundryTableByDfId(
			'Ironsworn/Oracles/Moves/Reveal_a_Danger'
		)
		if (oracle == null) return
		const results = [
			// @ts-expect-error
			...this.theme.system.dangers,
			// @ts-expect-error
			...this.domain.system.dangers,
			// Omits the first two rows
			...oracle.results.contents.slice(2)
		] as TableResultDataConstructorData[]

		const name = game.i18n.localize('IRONSWORN.DELVESITE.Dangers')

		return new OracleTable({
			name,
			results,
			flags: {
				'foundry-ironsworn': {
					subtitle: this.subtitle,
					sourceUuid: this.uuid,
					type: 'delve-site-dangers'
				}
			}
		})
	}

	/** The delve site's computed Denizens table */
	getDenizens() {
		if (this.type !== 'site') return
		const name = game.i18n.localize('IRONSWORN.DELVESITE.Denizens')
		return new OracleTable({
			name,
			results: (this.system as SiteDataPropertiesData).denizens,
			flags: {
				'foundry-ironsworn': {
					subtitle: this.subtitle,
					sourceUuid: this.uuid,
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

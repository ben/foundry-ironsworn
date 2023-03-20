import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import { sample } from 'lodash-es'
import { IronswornActor } from '../actor/actor'
import { getFoundryTableByDfId } from '../dataforged'
import { IronswornSettings } from '../helpers/settings'

interface CreateActorDialogOptions extends FormApplicationOptions {
	folder: string
}

export class CreateActorDialog extends FormApplication<CreateActorDialogOptions> {
	constructor() {
		super({})
	}

	async _updateObject() {
		// No update necessary.
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			title: game.i18n.format('DOCUMENT.Create', {
				type: game.i18n.localize('DOCUMENT.Actor')
			}),
			template: 'systems/foundry-ironsworn/templates/actor/create.hbs',
			id: 'new-actor-dialog',
			resizable: false,
			classes: ['ironsworn', 'sheet', 'new-actor', IronswornSettings.colors],
			width: 650,
			height: 200
		} as FormApplicationOptions)
	}

	getData(_options?: Application.RenderOptions): any {
		return {
			sfenabled: IronswornSettings.starforgedToolsEnabled
		}
	}

	activateListeners(html: JQuery) {
		super.activateListeners(html)

		html.find('.ironsworn__character__create').on('click', async (ev) => {
			await this._characterCreate.call(this, ev)
		})
		html.find('.ironsworn__shared__create').on('click', async (ev) => {
			await this._sharedCreate.call(this, ev)
		})
		html.find('.ironsworn__site__create').on('click', async (ev) => {
			await this._siteCreate.call(this, ev)
		})
		html.find('.ironsworn__foe__create').on('click', async (ev) => {
			await this._foeCreate.call(this, ev)
		})
		html.find('.ironsworn__sfcharacter__create').on('click', async (ev) => {
			await this._sfcharacterCreate.call(this, ev)
		})
		html.find('.ironsworn__sfship__create').on('click', async (ev) => {
			await this._sfshipCreate.call(this, ev)
		})
		html.find('.ironsworn__sflocation__create').on('click', async (ev) => {
			await this._sfLocationCreate.call(this, ev)
		})
	}

	async _characterCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()

		// Roll an Ironlander name
		const tables = await this._ironlanderNameTables()
		const table = sample(tables)
		const drawResult = await table?.draw({ displayChat: false })

		this._createWithFolder(
			drawResult?.results[0]?.data.text ||
				game.i18n.localize(CONFIG.Actor.typeLabels.character),
			'character',
			ev.currentTarget.dataset.img || undefined
		)
	}

	async _sharedCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		this._createWithFolder(
			game.i18n.localize(CONFIG.Actor.typeLabels.shared),
			'shared',
			ev.currentTarget.dataset.img || undefined
		)
	}

	async _siteCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		this._createWithFolder(
			game.i18n.localize(CONFIG.Actor.typeLabels.site),
			'site',
			ev.currentTarget.dataset.img || undefined
		)
	}

	async _foeCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		this._createWithFolder(
			game.i18n.localize(CONFIG.Actor.typeLabels.foe),
			'foe',
			ev.currentTarget.dataset.img || undefined
		)
	}

	async _sfcharacterCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()

		const name = await this._randomStarforgedName()

		this._createWithFolder(
			name || game.i18n.localize(CONFIG.Actor.typeLabels.character),
			'character',
			ev.currentTarget.dataset.img || undefined,
			'ironsworn.StarforgedCharacterSheet'
		)
	}

	async _sfshipCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		this._createWithFolder(
			game.i18n.localize(CONFIG.Actor.typeLabels.starship),
			'starship',
			ev.currentTarget.dataset.img || undefined
		)
	}

	async _sfLocationCreate(ev: JQuery.ClickEvent) {
		ev.preventDefault()
		this._createWithFolder(
			game.i18n.localize(CONFIG.Actor.typeLabels.location),
			'location',
			ev.currentTarget.dataset.img || undefined
		)
	}

	async _createWithFolder(
		name: string,
		type: IronswornActor['type'],
		img: string,
		sheetClass?: string
	) {
		const data: ActorDataConstructorData & Record<string, any> = {
			name,
			img,
			type,
			token: { actorLink: true },
			folder: this.options.folder || undefined
		}
		if (sheetClass) {
			data.flags = { core: { sheetClass } }
		}
		await IronswornActor.create(data, { renderSheet: true })
		await this.close()
	}

	async _ironlanderNameTables(): Promise<RollTable[] | undefined> {
		const tableA = (await getFoundryTableByDfId(
			'Ironsworn/Oracles/Name/Ironlander/A'
		)) as any
		const tableB = (await getFoundryTableByDfId(
			'Ironsworn/Oracles/Name/Ironlander/B'
		)) as any
		if (tableA && tableB) return [tableA, tableB]
		return undefined
	}

	async _randomStarforgedName(): Promise<string | undefined> {
		const firstTable = (await getFoundryTableByDfId(
			'Starforged/Oracles/Characters/Name/Given_Name'
		)) as any
		const lastTable = (await getFoundryTableByDfId(
			'Starforged/Oracles/Characters/Name/Family_Name'
		)) as any
		if (!firstTable || !lastTable) return undefined

		const first = await firstTable.draw({ displayChat: false })
		const last = await lastTable.draw({ displayChat: false })
		return `${first?.results[0]?.text} ${last?.results[0]?.text}`
	}
}

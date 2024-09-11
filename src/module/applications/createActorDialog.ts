import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import { IronswornActor } from '../actor/actor'
import { DataswornRulesetKey, IronswornSettings } from '../helpers/settings'
import { OracleTable } from '../roll-table/oracle-table'

interface CreateActorDialogOptions extends FormApplicationOptions {
	folder: string
}

interface DialogButton {
	kind: string
	labelKey: string
	img: string
	ironsworn?: boolean
	starforged?: boolean
}

const DIALOG_BUTTONS: DialogButton[] = [
	{
		kind: 'shared',
		labelKey: 'IRONSWORN.ACTOR.TypeShared',
		img: 'icons/environment/settlement/wagon-black.webp',
		ironsworn: true,
		starforged: true
	},
	{
		kind: 'site',
		labelKey: 'IRONSWORN.ACTOR.TypeDelveSite',
		img: 'icons/environment/wilderness/cave-entrance-vulcano.webp',
		ironsworn: true
	},
	{
		kind: 'foe',
		labelKey: 'IRONSWORN.ACTOR.TypeFoe',
		img: 'icons/creatures/eyes/lizard-single-slit-pink.webp',
		ironsworn: true,
		starforged: true
	},
	{
		kind: 'sfship',
		labelKey: 'IRONSWORN.ACTOR.TypeStarship',
		img: 'icons/environment/settlement/wizard-castle.webp',
		starforged: true
	},
	{
		kind: 'sflocation',
		labelKey: 'IRONSWORN.ACTOR.TypeLocation',
		img: 'systems/foundry-ironsworn/assets/planets/Starforged-Planet-Token-Ocean-02.webp',
		starforged: true
	}
]

export class CreateActorDialog extends FormApplication<CreateActorDialogOptions> {
	constructor() {
		super({})
	}

	async _updateObject() {
		// No update necessary.
	}

	static get buttonsForEnabledContent() {
		return DIALOG_BUTTONS.filter(
			(x) =>
				(x.ironsworn &&
					IronswornSettings.enabledRulesets.includes('classic')) ||
				(x.starforged &&
					IronswornSettings.enabledRulesets.includes('starforged'))
		)
	}

	static get defaultOptions() {
		const buttons = this.buttonsForEnabledContent
		const rulesets = IronswornSettings.enabledRulesets
		const bothKinds =
			rulesets.includes('classic') && rulesets.includes('starforged')
		const height =
			45 + // Title bar
			50 * (buttons.length + 1) + // Button height
			(bothKinds ? 55 : 0) // Space for bigger box if both kinds are enabled
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.format('DOCUMENT.Create', {
				type: game.i18n.localize('DOCUMENT.Actor')
			}),
			template: 'systems/foundry-ironsworn/templates/actor/create.hbs',
			id: 'new-actor-dialog',
			resizable: false,
			classes: ['ironsworn', 'sheet', 'new-actor'],
			width: 350,
			height,
			left: window.innerWidth - 675,
			top: 40
		} as FormApplicationOptions)
	}

	getData(_options?: Application.RenderOptions): any {
		const rulesets = IronswornSettings.enabledRulesets
		const classic = rulesets.includes('classic')
		const starforged = rulesets.includes('starforged')

		return {
			buttons: CreateActorDialog.buttonsForEnabledContent,
			classic,
			starforged,
			both: classic && starforged
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
		const table = await OracleTable.getByDsId(
			'oracle_rollable:classic/name/ironlander'
		)
		const drawResult = await table?.draw({ displayChat: false })

		this._createWithFolder(
			drawResult?.results[0]?.text ||
				game.i18n.localize(CONFIG.Actor.typeLabels.character),
			'character',
			ev.currentTarget.dataset.img || undefined,
			'ironsworn.IronswornCharacterSheetV2'
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
			prototypeToken: { actorLink: true },
			folder: this.options.folder || undefined
		}
		if (sheetClass) {
			data.flags = { core: { sheetClass } }
		}
		await IronswornActor.create(data, { renderSheet: true })
		await this.close()
	}

	async _randomStarforgedName(): Promise<string | undefined> {
		const [givenName, familyName] = await OracleTable.ask(
			[
				'oracle_rollable:starforged/character/name/given_name',
				'oracle_rollable:starforged/character/name/family_name'
			],
			{ displayChat: false }
		)
		return `${givenName?.results[0]?.text} ${familyName?.results[0]?.text}`
	}
}

import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import { IronswornActor } from '../actor/actor'
import { DataswornRulesetKey, IronswornSettings } from '../helpers/settings'
import { OracleTable } from '../roll-table/oracle-table'

interface CreateActorDialogOptions extends FormApplicationOptions {
	folder: string
}

interface DialogButtonSet {
	ruleset: DataswornRulesetKey
	buttons: DialogButton[]
}

interface DialogButton {
	kind: string
	labelKey: string
	img: string
}

const DIALOG_BUTTONS: DialogButtonSet[] = [
	{
		ruleset: 'classic',
		buttons: [
			{
				kind: 'character',
				labelKey: 'IRONSWORN.ACTOR.TypeCharacter',
				img: 'icons/creatures/eyes/human-single-blue.webp'
			},
			{
				kind: 'shared',
				labelKey: 'IRONSWORN.ACTOR.TypeShared',
				img: 'icons/environment/settlement/wagon-black.webp'
			},
			{
				kind: 'site',
				labelKey: 'IRONSWORN.ACTOR.TypeDelveSite',
				img: 'icons/environment/wilderness/cave-entrance-vulcano.webp'
			},
			{
				kind: 'foe',
				labelKey: 'IRONSWORN.ACTOR.TypeFoe',
				img: 'icons/creatures/eyes/lizard-single-slit-pink.webp'
			}
		]
	},
	{ ruleset: 'delve', buttons: [] },
	{
		ruleset: 'starforged',
		buttons: [
			{
				kind: 'sfcharacter',
				labelKey: 'IRONSWORN.ACTOR.TypeCharacter',
				img: 'icons/creatures/eyes/human-single-blue.webp'
			},
			{
				kind: 'shared',
				labelKey: 'IRONSWORN.ACTOR.TypeShared',
				img: 'icons/environment/settlement/wagon-black.webp'
			},
			{
				kind: 'sfship',
				labelKey: 'IRONSWORN.ACTOR.TypeStarship',
				img: 'icons/environment/settlement/wizard-castle.webp'
			},
			{
				kind: 'sflocation',
				labelKey: 'IRONSWORN.ACTOR.TypeLocation',
				img: 'systems/foundry-ironsworn/assets/planets/Starforged-Planet-Token-Ocean-02.webp'
			},
			{
				kind: 'foe',
				labelKey: 'IRONSWORN.ACTOR.TypeFoe',
				img: 'icons/creatures/eyes/lizard-single-slit-pink.webp'
			}
		]
	},
	{ ruleset: 'sundered_isles', buttons: [] }
]

export class CreateActorDialog extends FormApplication<CreateActorDialogOptions> {
	constructor() {
		super({})
	}

	async _updateObject() {
		// No update necessary.
	}

	static get sectionsForEnabledContent() {
		return DIALOG_BUTTONS.filter(
			(x) =>
				IronswornSettings.enabledRulesets.includes(x.ruleset) &&
				x.buttons.length > 0
		)
	}

	static get defaultOptions() {
		const sections = this.sectionsForEnabledContent
		const buttonCount = sections.reduce(
			(sum, { buttons }) => sum + buttons.length,
			0
		)
		const height =
			40 + // Title bar
			66 * buttonCount + // Button height
			(sections.length > 1 ? 34 * sections.length : 0) // Space for headers
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
		const sections = CreateActorDialog.sectionsForEnabledContent
		return {
			buttonSections: sections,
			showSectionHeaders: sections.length > 1
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

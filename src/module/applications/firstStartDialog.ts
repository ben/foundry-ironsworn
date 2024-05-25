import { IronswornSettings } from '../helpers/settings'
import { SFSettingTruthsDialogVue } from './vueSfSettingTruthsDialog'
import { WorldTruthsDialog } from './worldTruthsDialog'

export class FirstStartDialog extends FormApplication<FormApplicationOptions> {
	constructor() {
		super({})
	}

	static get defaultOptions(): FormApplicationOptions {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.First Start.Welcome'),
			template: 'systems/foundry-ironsworn/templates/first-start.hbs',
			id: 'first-start-dialog',
			resizable: false,
			classes: ['ironsworn', 'sheet', 'first-start'],
			width: 600,
			height: 360
		} as FormApplicationOptions)
	}

	async _updateObject() {
		// Nothing to do
	}

	activateListeners(html: JQuery) {
		super.activateListeners(html)
		html.find('#select-ironsworn').on('click', async (ev) => {
			await this._selectIronsworn.call(this, ev)
		})
		html.find('#select-starforged').on('click', async (ev) => {
			await this._selectStarforged.call(this, ev)
		})
	}

	async _selectIronsworn(ev) {
		ev.preventDefault()

		// Character sheet
		const setting = game.settings.get('core', 'sheetClasses')
		foundry.utils.mergeObject(setting, {
			'Actor.character': 'ironsworn.IronswornCharacterSheetV2'
		})
		await game.settings.set('core', 'sheetClasses', setting)

		// Truths
		new WorldTruthsDialog().render(true)
		game.settings.set('foundry-ironsworn', 'prompt-world-truths', false)
		this.close()
	}

	async _selectStarforged(ev) {
		ev.preventDefault()

		// Character sheet
		const setting = game.settings.get('core', 'sheetClasses')
		foundry.utils.mergeObject(setting, {
			'Actor.character': 'ironsworn.StarforgedCharacterSheet'
		})
		await game.settings.set('core', 'sheetClasses', setting)

		// Truths
		new SFSettingTruthsDialogVue().render(true)
		game.settings.set('foundry-ironsworn', 'prompt-world-truths', false)
		this.close()
	}

	static async maybeShow() {
		if (!IronswornSettings.get('prompt-world-truths')) {
			return
		}

		new FirstStartDialog().render(true)
	}
}

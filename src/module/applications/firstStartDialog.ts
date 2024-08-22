import { IronswornSettings } from '../helpers/settings'
import { SFSettingTruthsDialogVue } from './vueSfSettingTruthsDialog'
import { WorldTruthsDialog } from './worldTruthsDialog'

export class FirstStartDialog extends FormApplication<FormApplicationOptions> {
	constructor() {
		super({})
	}

	static get defaultOptions(): FormApplicationOptions {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.First Start.Welcome'),
			template: 'systems/foundry-ironsworn/templates/first-start.hbs',
			id: 'first-start-dialog',
			resizable: false,
			classes: ['ironsworn', 'sheet', 'first-start'],
			width: 650,
			height: 560
		} as FormApplicationOptions)
	}

	async _updateObject() {
		// Nothing to do
	}

	activateListeners(html: JQuery) {
		super.activateListeners(html)
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		html.find('button.ironsworn__save').on('click', async (ev) => {
			console.log(html)

			// Update default character sheet
			const defaultSheet = html.find('input[name=sheet]:checked').val()
			const setting = game.settings.get('core', 'sheetClasses')
			foundry.utils.mergeObject(setting, {
				'Actor.character': `ironsworn.${defaultSheet}`
			})
			await game.settings.set('core', 'sheetClasses', setting)

			// Update rulesets
			const checkedRulesets: string[] = $.map(
				html.find('input.ruleset:checked'),
				(x) => x.value ?? ''
			)
			await IronswornSettings.enableOnlyRulesets(...checkedRulesets)
			return false
		})
	}

	async getData(_options?: unknown) {
		const rulesets = {}
		for (const r of ['classic', 'delve', 'starforged', 'sundered-isles']) {
			rulesets[r] = {
				id: r,
				name: game.i18n.localize(`IRONSWORN.RULESETS.${r}`),
				enabled: IronswornSettings.get(`ruleset-${r}`)
			}
		}
		return {
			...(await super.getData()),
			rulesets: rulesets,
			sheetIsIronsworn: this.currentDefaultSheet === 'ironsworn',
			sheetIsStarforged: this.currentDefaultSheet === 'starforged'
		}
	}

	get currentDefaultSheet(): 'ironsworn' | 'starforged' {
		const setting = game.settings.get('core', 'sheetClasses')
		if (setting.Actor?.character === 'ironsworn.StarforgedCharacterSheet') {
			return 'starforged'
		}
		return 'ironsworn'
	}

	static async maybeShow() {
		if (!IronswornSettings.get('prompt-world-truths')) {
			return
		}

		new FirstStartDialog().render(true)
	}
}

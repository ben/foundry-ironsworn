import { IronswornSettings } from '../helpers/settings'
import { IronswornJournalEntry } from '../journal/journal-entry'
import { IronswornJournalPage } from '../journal/journal-entry-page'

export class WorldTruthsDialog extends FormApplication<FormApplicationOptions> {
	constructor() {
		super({})
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.YourWorldTruths'),
			template: 'systems/foundry-ironsworn/templates/truths.hbs',
			id: 'world-truths-dialog',
			resizable: true,
			classes: ['ironsworn', 'sheet', 'world-truths'],
			width: 600,
			height: 700
		} as FormApplicationOptions)
	}

	async _updateObject() {
		// Nothing to do
	}

	async getData() {
		const truths = await fetch(
			'systems/foundry-ironsworn/assets/world-truths.json'
		).then(async (x) => await x.json())

		// Run truths text through I18n
		for (const category of truths.Categories) {
			for (let i = 0; i < category.Options.length; i++) {
				const option = category.Options[i]
				option.Truth = game.i18n.localize(
					`IRONSWORN.WorldTruths.${category.Name}.option${i + 1}`
				)
				option.Quest = game.i18n.localize(
					`IRONSWORN.WorldTruths.${category.Name}.quest${i + 1}`
				)
			}
			category.Name = game.i18n.localize(
				`IRONSWORN.WorldTruths.${category.Name}.name`
			)
		}

		return await foundry.utils.mergeObject(super.getData(), {
			truths
		})
	}

	activateListeners(html: JQuery) {
		super.activateListeners(html)

		html.find('.ironsworn__custom__truth').on('focus', (ev) => {
			this._customTruthFocus.call(this, ev)
		})
		html.find('.ironsworn__save__truths').on('click', async (ev) => {
			await this._save.call(this, ev)
		})
	}

	_customTruthFocus(ev: JQuery.FocusEvent) {
		$(ev.currentTarget).siblings('input').prop('checked', true)
	}

	async _save(ev: JQuery.ClickEvent) {
		ev.preventDefault()

		// Get elements that are checked
		const sections: string[] = []
		for (const radio of this.element.find(':checked')) {
			const { category } = radio.dataset
			const descriptionElement = $(radio).parent().find('.description')
			const description =
				descriptionElement.html() || `<p>${descriptionElement.val()}</p>`
			sections.push(`<h2>${category}</h2> ${description}`)
		}

		const title = game.i18n.localize('IRONSWORN.YourWorldTruths')
		const journal = await IronswornJournalEntry.create({
			name: title
		})
		await IronswornJournalPage.create(
			{
				name: title,
				text: { content: sections.join('\n') }
			},
			{ parent: journal }
		)
		journal?.sheet?.render(true)
		this.close()
	}
}

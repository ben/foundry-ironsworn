import type { Starforged } from 'dataforged'
import { starforged } from 'dataforged'
import { IronswornJournalEntry } from '../journal/journal-entry'
import sfTruthsVue from '../vue/sf-truths.vue'
import { VueAppMixin } from '../vue/vueapp.js'

export class SFSettingTruthsDialogVue extends VueAppMixin(FormApplication) {
	constructor() {
		super({})
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			title: game.i18n.localize('IRONSWORN.JOURNALENTRYPAGES.TypeTruth'),
			id: 'setting-truths-dialog',
			resizable: true,
			width: 700,
			height: 700,
			rootComponent: sfTruthsVue
		}) as any
	}

	protected async _updateObject(
		_event: Event,
		_formData?: object | undefined
	): Promise<void> {
		// Nothing to do
	}

	getData(
		options?: Partial<ApplicationOptions> | undefined
	): MaybePromise<object>
	getData(
		options?: Partial<FormApplicationOptions> | undefined
	): MaybePromise<object>
	async getData(options?: unknown) {
		const pack = game.packs.get('foundry-ironsworn.starforgedtruths')
		const documents = (await pack?.getDocuments()) as IronswornJournalEntry[]
		if (!documents) throw new Error("can't load truth JEs")

		// Avoid rollupjs's over-aggressive tree shaking
		const dfTruths = ((starforged as any).default as Starforged)[
			'Setting Truths'
		]
		const truths = dfTruths.map((df) => ({
			df,
			je: documents.find(
				(x) => x.getFlag('foundry-ironsworn', 'dfid') === df.$id
			)
		}))

		return {
			...(await super.getData()),
			truths: truths.map(({ df, je }) => ({
				df,
				je: () => je // Prevent vue from wrapping this in Reactive
			}))
		}
	}
}

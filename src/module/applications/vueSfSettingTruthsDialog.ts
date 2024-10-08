import { COMPENDIUM_KEY_MAP, DataswornTree } from '../datasworn2'
import { DataswornRulesetKey } from '../helpers/settings'
import { IronswornJournalEntry } from '../journal/journal-entry'
import sfTruthsVue from '../vue/sf-truths.vue'
import { VueAppMixin } from '../vue/vueapp.js'

export class SFSettingTruthsDialogVue extends VueAppMixin(FormApplication) {
	constructor(protected truthset: DataswornRulesetKey) {
		super({})
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
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
	async getData(_options?: unknown) {
		const pack = game.packs.get(COMPENDIUM_KEY_MAP.truth[this.truthset])
		const documents = (await pack?.getDocuments()) as IronswornJournalEntry[]
		if (!documents) throw new Error("can't load truth JEs")

		// Get the order from DS
		const dsTruths = DataswornTree.get(this.truthset)?.truths
		if (!dsTruths) throw new Error("can't find DS truths")

		const truths = Object.values(dsTruths).map((ds) => ({
			ds,
			je: documents.find(
				(x) => x.getFlag('foundry-ironsworn', 'dsid') === ds._id
			)
		}))

		return {
			...(await super.getData()),
			truths: truths.map(({ ds, je }) => ({
				ds,
				je: () => je // Prevent vue from wrapping this in Reactive
			}))
		}
	}
}

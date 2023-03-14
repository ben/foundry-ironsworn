export class TruthJournalPageSheet extends JournalPageSheet {
	// @ts-expect-error
	isEditable: boolean

	get template() {
		return `systems/foundry-ironsworn/templates/journal/page-truth-${
			this.isEditable ? 'edit' : 'view'
		}.hbs`
	}
}

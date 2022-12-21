// @ts-ignore
export class TruthJournalPageSheet extends JournalPageSheet {
  // @ts-ignore
  isEditable: boolean

  get template() {
    return `systems/foundry-ironsworn/templates/journal/page-truth-${
      this.isEditable ? 'edit' : 'view'
    }.hbs`
  }
}

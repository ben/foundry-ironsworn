import { VueApplication } from '../applications/vueapp'
import { IronswornSettings } from '../helpers/settings'

export class JournalEntrySidebar extends VueApplication {
  constructor(
    protected journalEntry: JournalEntry,
    options?: Partial<ApplicationOptions>
  ) {
    super(options)
  }

  async _updateObject() {
    console.log(this)
    // No update necessary.
  }

  static get defaultOptions(): FormApplicationOptions {
    return mergeObject(FormApplication.defaultOptions, {
      template: 'systems/foundry-ironsworn/templates/journalentry/sidebar.hbs',
      resizable: true,
      classes: [
        'ironsworn',
        'sheet',
        'journalentry',
        `theme-${IronswornSettings.theme}`,
      ],
      width: 250,
      height: 450,
      left: 755,
    })
  }

  getData(options?: Partial<FormApplicationOptions> | undefined) {
    const data = super.getData(options) as any

    data.je = this.journalEntry.toObject(false)

    return data
  }
}

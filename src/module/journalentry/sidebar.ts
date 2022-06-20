import { IronswornSettings } from '../helpers/settings'

export class JournalEntrySidebar extends FormApplication<
  FormApplicationOptions,
  any,
  JournalEntry
> {
  constructor(object, options?: any) {
    super(object, options)
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
      width: 200,
      height: 400,
      left: 755,
    })
  }

  getData(options?: Partial<FormApplicationOptions> | undefined) {
    const data = super.getData(options)
    console.log(data)

    data.isProgress = this.object.getFlag('foundry-ironsworn', 'isProgress')

    return data
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html)

    html.find('.ironsworn__is_progress').on('click', async (e) => {
      console.log(e)
      await this.object.setFlag(
        'foundry-ironsworn',
        'isProgress',
        $(e.currentTarget).prop('checked')
      )
    })
  }
}

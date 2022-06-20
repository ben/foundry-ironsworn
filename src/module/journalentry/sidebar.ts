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
      await this.setFlag('isProgress', $(e.currentTarget).prop('checked'))

      if (this.getFlag('progressType') === undefined) {
        await this._initFlags()
      }
    })
  }

  private async _initFlags() {
    await this.setFlag('progressType', 'progress')
    await this.setFlag('complete', false)
    await this.setFlag('hasTrack', true)
    await this.setFlag('trackRank', 1)
    await this.setFlag('trackTicks', 0)
    await this.setFlag('hasClock', true)
    await this.setFlag('clockTicks', 0)
    await this.setFlag('clockMax', 6)
  }

  private setFlag(name: string, value: any) {
    return this.object.setFlag('foundry-ironsworn', name, value)
  }

  private getFlag(name: string) {
    return this.object.getFlag('foundry-ironsworn', name)
  }
}

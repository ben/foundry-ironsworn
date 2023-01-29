import { IronswornSettings } from '../helpers/settings'

export class WorldTruthsDialog extends FormApplication<FormApplicationOptions> {
  constructor() {
    super({})
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.YourWorldTruths'),
      template: 'systems/foundry-ironsworn/templates/truths.hbs',
      id: 'world-truths-dialog',
      resizable: true,
      classes: [
        'ironsworn',
        'sheet',
        'world-truths',
        `theme-${IronswornSettings.get('theme')}`,
      ],
      width: 600,
      height: 700,
    } as FormApplicationOptions)
  }

  async _updateObject() {
    // Nothing to do
  }

  async getData() {
    const truths = await fetch(
      'systems/foundry-ironsworn/assets/world-truths.json'
    ).then((x) => x.json())

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

    return mergeObject(super.getData(), {
      truths,
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html
      .find('[data-on-focus="selectTruthOption"]')
      .on('focus', (ev) => this._selectTruthOption.call(this, ev))
    html
      .find('[data-on-click="saveTruths"]')
      .on('click', (ev) => this._saveTruths.call(this, ev))
  }

  _selectTruthOption(ev: JQuery.FocusEvent) {
    $(ev.currentTarget).siblings('input').prop('checked', true)
  }

  async _saveTruths(ev: JQuery.ClickEvent) {
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

    const journal = await JournalEntry.create({
      name: game.i18n.localize('IRONSWORN.YourWorldTruths'),
      content: sections.join('\n'),
    })
    journal?.sheet?.render(true)
    this.close()
  }
}

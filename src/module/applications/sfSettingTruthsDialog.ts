import { IronswornSettings } from '../helpers/settings'

export class SFSettingTruthsDialog extends FormApplication<FormApplicationOptions> {
  constructor() {
    super({})
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.SFSettingTruthsTitle'),
      template: 'systems/foundry-ironsworn/templates/sf-truths.hbs',
      id: 'setting-truths-dialog',
      resizable: true,
      classes: [
        'ironsworn',
        'sheet',
        'setting-truths',
        `theme-${IronswornSettings.theme}`,
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
      'systems/foundry-ironsworn/assets/sf-setting-truths.json'
    ).then((x) => x.json())

    // Run truths text through I18n
    for (const category of truths['Setting Truths']) {
      const i18nBaseKey = `IRONSWORN.SFSettingTruths.${category.Name}`
      category.Name = game.i18n.localize(`${i18nBaseKey}.name`)
      for (let i = 0; i < category.Table.length; i++) {
        const option = category.Table[i]
        const i18nOptionBaseKey = `${i18nBaseKey}.option${i + 1}`
        option.Description = game.i18n.localize(
          `${i18nOptionBaseKey}.Description`
        )
        option.Details = game.i18n.localize(`${i18nOptionBaseKey}.Details`)
        option.Quest = game.i18n.localize(`${i18nOptionBaseKey}.Quest`)
        for (let j = 0; j < (option.Table || []).length; j++) {
          option.Table[j].Description = game.i18n.localize(
            `${i18nOptionBaseKey}.suboption${j + 1}`
          )
        }
      }
    }

    return mergeObject(super.getData(), {
      truths,
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html
      .find('.ironsworn__custom__truth')
      .on('focus', (ev) => this._customTruthFocus.call(this, ev))
    html
      .find('.ironsworn__save__truths')
      .on('click', (ev) => this._save.call(this, ev))
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
    console.log(sections)

    // const journal = await JournalEntry.create({
    //   name: game.i18n.localize('IRONSWORN.TRUTHS.JOURNAL.STARFORGED.Title'),
    //   content: sections.join('\n'),
    // })
    // journal?.sheet?.render(true)
    this.close()
  }
}

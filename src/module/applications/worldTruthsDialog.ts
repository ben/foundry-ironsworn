import { IronswornSettings } from '../helpers/settings'

export class WorldTruthsDialog extends FormApplication<FormApplication.Options> {
  constructor() {
    super({})
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize('IRONSWORN.YourWorldTruths'),
      template: 'systems/foundry-ironsworn/templates/truths.hbs',
      id: 'world-truths-dialog',
      resizable: true,
      classes: ['ironsworn', 'sheet', 'world-truths', `theme-${IronswornSettings.theme}`],
      width: 600,
      height: 700,
    } as FormApplication.Options)
  }

  async _updateObject() {
    // Nothing to do
  }

  async getData() {
    const truths = await fetch('/systems/foundry-ironsworn/assets/world-truths.json').then((x) => x.json())
    // TODO: run truths text through I18n

    return mergeObject(super.getData(), {
      truths,
    })
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)

    html.find('.ironsworn__custom__truth').on('focus', (ev) => this._customTruthFocus.call(this, ev))
    html.find('.ironsworn__save__truths').on('click', (ev) => this._save.call(this, ev))
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
      const description = descriptionElement.html() || `<p>${descriptionElement.val()}</p>`
      sections.push(`<h2>${category}</h2> ${description}`)
    }

    const journal = await JournalEntry.create({
      name: "Your World", // TODO: i18n
      content: sections.join('\n')
    })
    journal?.sheet?.render(true)
    this.close()
  }

  static async maybeShow() {
    // Show this dialog if appropriate
    if (!game.settings.get('foundry-ironsworn', 'prompt-world-truths')) {
      return
    }

    const d = new Dialog({
      title: game.i18n.localize('IRONSWORN.YourWorldTruths'),
      content: '<p>Would you like to generate your world truths?</p>',
      buttons: {
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Yes',
          callback: () => new WorldTruthsDialog().render(true),
        },
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Not this time',
        },
        goaway: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Never',
          callback: () => {
            game.settings.set('foundry-ironsworn', 'prompt-world-truths', false)
          },
        },
      },
      default: 'two',
      render: (_html) => console.log('Register interactivity in the rendered dialog'),
      close: (_html) => console.log('This always is logged no matter which option is chosen'),
    })
    d.render(true)
  }
}

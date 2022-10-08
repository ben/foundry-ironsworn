export class JournalProgressPageSheet extends JournalPageSheet {
  static get defaultOptions() {
    const options = super.defaultOptions
    options.classes.push('progress')
    return options
  }

  get template() {
    return 'systems/foundry-ironsworn/templates/journal/progress.hbs'
  }

  async _renderInner(...args) {
    console.log(args)
    return super._renderInner(...args)
  }
}

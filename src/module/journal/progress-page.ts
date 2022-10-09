declare global {
  class JournalPageSheet extends DocumentSheet {}
}

export class JournalProgressPageSheet extends JournalPageSheet {
  static get defaultOptions() {
    const options = super.defaultOptions
    options.classes.push('progress')
    return options
  }

  get template() {
    return `systems/foundry-ironsworn/templates/journal/progress-page-${
      this.isEditable ? 'edit' : 'view'
    }.hbs`
  }
}

Hooks.on('renderJournalProgressPageSheet', (...args) =>
  console.log('render', ...args)
)
Hooks.on('closeJournalProgressPageSheet', (...args) =>
  console.log('close', ...args)
)

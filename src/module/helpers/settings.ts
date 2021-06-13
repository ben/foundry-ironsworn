export class IronswornSettings {
  static registerSettings() {
    game.settings.register('foundry-ironsworn', 'theme', {
      name: 'IRONSWORN.Settings.Theme.Name',
      hint: 'IRONSWORN.Settings.Theme.Hint',
      scope: 'world',
      config: true,
      type: String,
      choices: {
        ironsworn: 'IRONSWORN.Settings.Theme.Ironsworn',
        starforged: 'IRONSWORN.Settings.Theme.Starforged',
      },
      default: 'ironsworn',
      onChange: (_value) => {
        window.location.reload()
      },
    })
  }

  static get theme(): string {
    return game.settings.get('foundry-ironsworn', 'theme') as string
  }
}

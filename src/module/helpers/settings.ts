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
        // TODO: starforged
      },
      default: 'ironsworn',
      onChange: (value) => {
        // TODO: re-render all open sheets
        console.log({ value })
      },
    })
  }

  static get theme(): string {
    return game.settings.get('foundry-ironsworn', 'theme') as string
  }
}

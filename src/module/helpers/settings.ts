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

    game.settings.register('foundry-ironsworn', 'shared-supply', {
      name: 'IRONSWORN.Settings.SharedSupply.Name',
      hint: 'IRONSWORN.Settings.SharedSupply.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register('foundry-ironsworn', 'data-version', {
      scope: 'world',
      config: false,
      type: Number,
      default: 1,
    })
  }

  static get theme(): string {
    return game.settings.get('foundry-ironsworn', 'theme') as string
  }

  static get dataVersion(): number {
    return game.settings.get('foundry-ironsworn', 'data-version') as number
  }

  static async maybeSetGlobalSupply(value: number) {
    if (!game.settings.get('foundry-ironsworn', 'shared-supply')) return

    // TODO: use game.actors.contents instead when types update
    const actorsToUpdate = game.actors?.entities?.filter((x) => ['character', 'shared'].includes(x.data.type)) || []
    for (const actor of actorsToUpdate) {
      await actor.update({ data: { supply: value } })
    }
  }
}

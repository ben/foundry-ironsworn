import { FirstStartDialog } from '../applications/firstStartDialog'

function reload() {
  window.location.reload()
}

export class IronswornSettings {
  static registerSettings() {
    game.settings.registerMenu('foundry-ironsworn', 'first-start-dialog', {
      name: 'IRONSWORN.SETTINGS.ConfigurationDialog.Name',
      label: 'IRONSWORN.SETTINGS.ConfigurationDialog.Label',
      icon: 'fas fa-cog',
      hint: 'IRONSWORN.SETTINGS.ConfigurationDialog.Hint',
      type: FirstStartDialog,
      restricted: true,
    })

    game.settings.register('foundry-ironsworn', 'prompt-world-truths', {
      name: 'IRONSWORN.SETTINGS.PromptTruths.Name',
      hint: 'IRONSWORN.SETTINGS.PromptTruths.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register<'foundry-ironsworn', 'theme', string>(
      'foundry-ironsworn',
      'theme',
      {
        name: 'IRONSWORN.SETTINGS.Theme.Name',
        hint: 'IRONSWORN.SETTINGS.Theme.Hint',
        scope: 'world',
        config: true,
        type: String,
        choices: {
          ironsworn: 'IRONSWORN.SETTINGS.Theme.Ironsworn',
          starforged: 'IRONSWORN.SETTINGS.Theme.Starforged',
        },
        default: 'ironsworn',
        onChange: reload,
      }
    )

    game.settings.register<'foundry-ironsworn', 'toolbox', string>(
      'foundry-ironsworn',
      'toolbox',
      {
        name: 'IRONSWORN.SETTINGS.Tools.Name',
        hint: 'IRONSWORN.SETTINGS.Tools.Hint',
        scope: 'world',
        config: true,
        type: String,
        choices: {
          sheet: 'IRONSWORN.SETTINGS.Tools.Sheet',
          ironsworn: 'IRONSWORN.GAME.IronswornClassic',
          starforged: 'IRONSWORN.GAME.IronswornStarforged',
        },
        default: 'sheet',
        onChange: reload,
      }
    )

    game.settings.register('foundry-ironsworn', 'shared-supply', {
      name: 'IRONSWORN.SETTINGS.SharedSupply.Name',
      hint: 'IRONSWORN.SETTINGS.SharedSupply.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register('foundry-ironsworn', 'log-changes', {
      name: 'IRONSWORN.SETTINGS.LogChanges.Name',
      hint: 'IRONSWORN.SETTINGS.LogChanges.Hint',
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

  static get toolbox(): string {
    return game.settings.get('foundry-ironsworn', 'toolbox') as string
  }

  static get starforgedToolsEnabled(): boolean {
    if (this.toolbox === 'ironsworn') return false
    if (this.toolbox === 'starforged') return true

    // Set to "match sheet, so check the sheet"
    const sheetClasses = game.settings.get('core', 'sheetClasses') as any
    return (
      sheetClasses.Actor?.character === 'ironsworn.StarforgedCharacterSheet'
    )
  }

  static get logCharacterChanges(): boolean {
    return !!game.settings.get('foundry-ironsworn', 'log-changes')
  }

  static async maybeSetGlobalSupply(value: number) {
    if (!game.settings.get('foundry-ironsworn', 'shared-supply')) return

    const actorsToUpdate =
      game.actors?.contents.filter((x) =>
        ['character', 'shared'].includes(x.data.type)
      ) || []
    for (const actor of actorsToUpdate) {
      await actor.update({ data: { supply: value } }, {
        suppressLog: true,
      } as any)
    }
  }

  static async maybeSetGlobalCondition(name: string, value: boolean) {
    const actorsToUpdate =
      game.actors?.contents.filter((x) =>
        ['character', 'starship'].includes(x.data.type)
      ) || []
    console.log(actorsToUpdate)
    for (const actor of actorsToUpdate) {
      await actor.update({ data: { debility: { [name]: value } } }, {
        suppressLog: true,
      } as any)
    }
  }
}

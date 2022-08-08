import { FirstStartDialog } from '../applications/firstStartDialog'

function reload() {
  window.location.reload()
}

export class IronswornSettings {
  static registerSettings() {
    game.settings.registerMenu('foundry-ironsworn', 'first-start-dialog', {
      name: 'IRONSWORN.Settings.ConfigurationDialog.Name',
      label: 'IRONSWORN.Settings.ConfigurationDialog.Label',
      icon: 'fas fa-cog',
      hint: 'IRONSWORN.Settings.ConfigurationDialog.Hint',
      type: FirstStartDialog,
      restricted: true,
    })

    game.settings.register('foundry-ironsworn', 'prompt-world-truths', {
      name: 'IRONSWORN.Settings.PromptTruths.Name',
      hint: 'IRONSWORN.Settings.PromptTruths.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register<'foundry-ironsworn', 'theme', string>(
      'foundry-ironsworn',
      'theme',
      {
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
        onChange: reload,
      }
    )

    game.settings.register<'foundry-ironsworn', 'toolbox', string>(
      'foundry-ironsworn',
      'toolbox',
      {
        name: 'IRONSWORN.Settings.Tools.Name',
        hint: 'IRONSWORN.Settings.Tools.Hint',
        scope: 'world',
        config: true,
        type: String,
        choices: {
          sheet: 'IRONSWORN.Settings.Tools.Sheet',
          ironsworn: 'IRONSWORN.Ironsworn',
          starforged: 'IRONSWORN.Starforged',
        },
        default: 'sheet',
      }
    )

    game.settings.register('foundry-ironsworn', 'shared-supply', {
      name: 'IRONSWORN.Settings.SharedSupply.Name',
      hint: 'IRONSWORN.Settings.SharedSupply.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register('foundry-ironsworn', 'log-changes', {
      name: 'IRONSWORN.Settings.LogChanges.Name',
      hint: 'IRONSWORN.Settings.LogChanges.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register('foundry-ironsworn', 'df-is-moves-oracles', {
      name: 'IRONSWORN.Settings.DataforgedIronswornMoves.Name',
      hint: 'IRONSWORN.Settings.DataforgedIronswornMoves.Hint',
      scope: 'client',
      config: true,
      type: Boolean,
      default: false,
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

  static get dataforgedIronswornMoves(): boolean {
    return !!game.settings.get('foundry-ironsworn', 'df-is-moves-oracles')
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

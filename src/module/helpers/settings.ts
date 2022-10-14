import { IronswornActor } from '../actor/actor.js'
import { FirstStartDialog } from '../applications/firstStartDialog'

function reload() {
  window.location.reload()
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ClientSettings {
    interface Values {
      // Settings added here will be automatically typed throughout the game system.
      'foundry-ironsworn.prompt-world-truths': boolean
      'foundry-ironsworn.theme': 'ironsworn' | 'starforged'
      'foundry-ironsworn.toolbox': 'ironsworn' | 'starforged' | 'sheet'
      'foundry-ironsworn.shared-supply': boolean
      'foundry-ironsworn.log-changes': boolean
      'foundry-ironsworn.progress-mark-animation': boolean
      'foundry-ironsworn.data-version': number
    }
  }
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
      onChange: reload,
    })

    game.settings.register('foundry-ironsworn', 'toolbox', {
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
      onChange: reload,
    })

    game.settings.register('foundry-ironsworn', 'shared-supply', {
      name: 'IRONSWORN.Settings.SharedSupply.Name',
      hint: 'IRONSWORN.Settings.SharedSupply.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
      onChange: reload,
    })

    game.settings.register('foundry-ironsworn', 'log-changes', {
      name: 'IRONSWORN.Settings.LogChanges.Name',
      hint: 'IRONSWORN.Settings.LogChanges.Hint',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    })

    game.settings.register('foundry-ironsworn', 'progress-mark-animation', {
      name: 'IRONSWORN.Settings.ProgressMarkAnimation.Name',
      hint: 'IRONSWORN.Settings.ProgressMarkAnimation.Hint',
      scope: 'client',
      type: Boolean,
      default: true,
      config: true,
      onChange: reload,
    })

    game.settings.register('foundry-ironsworn', 'data-version', {
      scope: 'world',
      config: false,
      type: Number,
      default: 1,
    })
  }
  /**
   * Wraps {@link game.settings.get} (within the `foundry-ironsworn` scope) to ensure that Vue always gets the updated value.
   * @param key The key of the setting within the `foundry-ironsworn` scope.
   */
  static get<K extends string>(
    key: K
  ): ClientSettings.Values[`foundry-ironsworn.${K}`] {
    return game.settings.get('foundry-ironsworn', key)
  }

  static get starforgedToolsEnabled(): boolean {
    if (this.get('toolbox') === 'ironsworn') return false
    if (this.get('toolbox') === 'starforged') return true

    // Set to "match sheet, so check the sheet"
    const sheetClasses = game.settings.get('core', 'sheetClasses') as any
    return (
      sheetClasses.Actor?.character === 'ironsworn.StarforgedCharacterSheet'
    )
  }

  /**
   * Upddate all actors of the provided types with a single data object.
   * @param data The data to pass to each actor's `update()` method.
   * @param actorTypes The subtypes of actor to apply the change to.
   */
  static async updateGlobalAttribute(
    data: Record<string, unknown>,
    actorTypes: IronswornActor['type'][] = ['character', 'shared']
  ) {
    const actorsToUpdate =
      game.actors?.contents.filter((x) => actorTypes.includes(x.data.type)) ||
      []
    // FIXME: Document.updateDocuments might make more sense here?
    for (const actor of actorsToUpdate) {
      await actor.update(data, {
        suppressLog: true,
      } as any)
    }
  }
}

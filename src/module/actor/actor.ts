import { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IronswornActor extends Actor {
  moveSheet?: SFCharacterMoveSheet

  static async createDialog(data, _options = {}) {
    if (CONFIG.IRONSWORN.applications.createActorDialog) {
      CONFIG.IRONSWORN.applications.createActorDialog.options.folder =
        data?.folder
      CONFIG.IRONSWORN.applications.createActorDialog.render(true)
    }
    return undefined
  }

  async burnMomentum() {
    if (this.data.type != 'character') return
    const { momentum, momentumReset } = this.data.data
    console.log({ momentum, momentumReset })
    if (momentum > momentumReset) {
      this.update({
        data: { momentum: momentumReset },
      })
    }
  }

  get toolset(): 'ironsworn' | 'starforged' {
    // We can't use IronswornSettings helpers here, it breaks the import orders
    // First check if the toolbox is set to one or the other
    const toolbox = game.settings.get('foundry-ironsworn', 'toolbox') as string
    if (toolbox === 'ironsworn') return 'ironsworn'
    if (toolbox === 'starforged') return 'starforged'

    // Set to "match sheet", so check for a specific setting on this actor
    if (this.type === 'character') {
      return this.sheet?.constructor.name === 'StarforgedCharacterSheet'
        ? 'starforged'
        : 'ironsworn'
    }

    // Nope, now check the default character sheet class
    const sheetClasses = game.settings.get('core', 'sheetClasses') as any
    return sheetClasses.Actor?.character ===
      'ironsworn.StarforgedCharacterSheet'
      ? 'starforged'
      : 'ironsworn'
  }
}

declare global {
  interface DocumentClassConfig {
    Actor: typeof IronswornActor
  }
}

Hooks.on('createActor', async (actor: IronswornActor) => {
  if (!['character', 'shared'].includes(actor.type)) return
  await Item.createDocuments([{ type: 'bondset', name: 'bonds' }], {
    parent: actor,
    suppressLog: true,
  } as any)
})

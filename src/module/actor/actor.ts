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
    if (this.type === 'character') {
      return this.sheet?.constructor.name === 'StarforgedCharacterSheet'
        ? 'starforged'
        : 'ironsworn'
    }

    return 'ironsworn'
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

import { RANK_INCREMENTS } from '../constants'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornPrerollDialog } from '../rolls'
import {
  BondsetDataPropertiesData,
  ProgressDataPropertiesData,
  SFMoveDataPropertiesData,
} from './itemtypes'

/**
 * Extend the base Item entity
 * @extends {Item}
 */
export class IronswornItem extends Item {
  // Type hacks for v10 compatibility updates
  declare system: typeof this.data.data
  declare sort: typeof this.data.sort

  /**
   * Progress methods
   */
  markProgress(numMarks = 1) {
    if (this.type !== 'vow' && this.type !== 'progress') return
    const system = this.system as ProgressDataPropertiesData

    const increment = RANK_INCREMENTS[system.rank] * numMarks
    let newValue = system.current + increment
    newValue = Math.min(newValue, 40)
    newValue = Math.max(newValue, 0)
    return this.update({ 'system.current': newValue })
  }

  clearProgress() {
    if (this.data.type !== 'vow' && this.data.type !== 'progress') return
    return this.update({ 'system.current': 0 })
  }

  fulfill() {
    if (this.data.type !== 'progress') return
    const system = this.system as ProgressDataPropertiesData

    let moveDfId: string | undefined
    if (system.subtype === 'vow') {
      const toolset = this.actor?.toolset ?? 'starforged'
      moveDfId =
        toolset === 'starforged'
          ? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
          : 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
    }

    const progress = Math.floor(system.current / 4)
    return IronswornPrerollDialog.showForProgress(
      this.name || '(progress)',
      progress,
      this.actor || undefined,
      moveDfId
    )
  }

  /**
   * Bondset methods
   */

  async writeEpilogue() {
    if (this.type !== 'bondset') return
    const system = this.system as BondsetDataPropertiesData

    const move = await getFoundryMoveByDfId(
      'Ironsworn/Moves/Relationship/Write_Your_Epilogue'
    )
    if (!move) throw new Error('Problem loading write-epilogue move')

    const progress = Math.floor(Object.values(system.bonds).length / 4)
    IronswornPrerollDialog.showForProgress(
      game.i18n.localize('IRONSWORN.Bonds'),
      progress,
      this.actor || undefined,
      'Ironsworn/Moves/Relationship/Write_Your_Epilogue'
    )
  }

  /**
   * Move methods
   */
  isProgressMove(): boolean | undefined {
    if (this.data.type !== 'sfmove') return

    const sfMoveSystem = this.system as SFMoveDataPropertiesData
    return sfMoveSystem.Trigger.Options?.some(
      (option) => option['Roll type'] === 'Progress roll'
    )
  }
}

declare global {
  interface DocumentClassConfig {
    Item: typeof IronswornItem
  }
}

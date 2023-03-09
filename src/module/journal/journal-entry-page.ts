import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { BaseUser } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import { clamp } from 'lodash'
import { NumericRank, RANK_INCREMENTS } from '../constants'
import type { ProgressTrackDataPropertiesData } from './journal-entry-page-types'

/**
 * Extends the base {@link JournalEntryPage} document class.
 */
export class IronswornJournalPage<
  T extends DataConfig['JournalEntryPage'] = DataConfig['JournalEntryPage']
> extends JournalEntryPage {
  system!: T['system']
  type!: T['type']
  protected override _preCreate(
    data: JournalEntryPageData.ConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    // FIXME: JEPs aren't initialized with proper defaults, so we DIY it.
    // https://github.com/foundryvtt/foundryvtt/issues/8628
    const defaults = game.system.template.JournalEntryPage?.[
      // @ts-ignore
      data.type
    ] as JournalEntryPageDataSource
    if (defaults) {
      const alreadySet = data.system
      const newSourceData = mergeObject(defaults, alreadySet ?? {}, {
        recursive: true,
      })
      // @ts-ignore
      this.updateSource({ system: newSourceData })
    }
    return super._preCreate(data, options, user)
  }
  // PROGRESS METHODS
  /**
   * Mark progress on a progress track.
   * @param progressUnits The number of times that progress is to be marked.
   */
  markProgress(progressUnits = 1) {
    if (this.type !== 'progress') return
    const system = this.system as ProgressTrackDataPropertiesData
    const legacyRank = NumericRank[system.rank]
    const oldTicks = system.ticks ?? 0
    const minTicks = 0
    const maxTicks = 40
    const increment = RANK_INCREMENTS[legacyRank] * progressUnits
    const newValue = clamp(oldTicks + increment, minTicks, maxTicks)
    return this.update({ 'system.ticks': newValue })
  }
}

declare global {
  interface DocumentClassConfig {
    JournalEntryPage: typeof IronswornJournalPage
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Game {
    interface SystemData<T> extends PackageData<T> {
      model: {
        JournalEntryPage: Record<string, Record<string, unknown>>
      }
      template: {
        JournalEntryPage?: {
          types: string[]
          templates?: Record<string, unknown>
        } & Record<string, unknown>
      }
    }
  }
}

import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { ProgressTrackSource } from '../../model/ProgressTrack'
import { ProgressTrack } from '../../model/ProgressTrack'
import type { ClockSource } from '../../model/Clock'
import { Clock } from '../../model/Clock'
import type { IronswornActor } from '../../actor/actor'

/** TypeDataModel for the `progress` {@link IronswornItem} subtype. A general purpose tracker that embeds a ProgressTrack and a Clock */
export class ProgressModel extends foundry.abstract.TypeDataModel<
	ProgressDataSourceData,
	ProgressDataPropertiesData,
	IronswornItem<'progress'>
> {
	/**
	 * Mark the progress track. Use negative `times` to erase progress.
	 * @param times The number of units of progress to be marked (default: `1`).
	 */
	async markProgress(times = 1) {
		return await this.parent.update({
			system: { track: this.track.getMarkData(times) }
		})
	}

	/** Make a progress roll against the progress track's progress score. */
	async rollProgress({
		actor = this.parent.actor ?? undefined,
		moveDfid
	}: {
		actor?: IronswornActor
		moveDfid?: string
	} = {}) {
		return await this.track.roll({
			actor,
			objective: this.parent.name ?? undefined,
			moveDfid
		})
	}

	static override migrateData(source) {
		const migrate = foundry.abstract.Document._addDataFieldMigration
		if (source.hasClock === true) {
			migrate(source, 'hasClock', 'clock.enabled')
			migrate(source, 'clockTicks', 'clock.value')
			migrate(source, 'clockMax', 'clock.max')
		}

		migrate(source, 'subtype', 'track.subtype')
		migrate(source, 'starred', 'flags.foundry-ironsworn.starred')
		migrate(source, 'hasTrack', 'track.enabled')
		migrate(source, 'rank', 'track.rank')
		migrate(source, 'current', 'track.ticks')

		return source
	}

	static override defineSchema(): DataSchema<
		ProgressDataSourceData,
		ProgressDataPropertiesData
	> {
		const fields = foundry.data.fields
		return {
			track: new fields.EmbeddedDataField(ProgressTrack, {
				initial: { enabled: true } as any
			}),
			clock: new fields.EmbeddedDataField(Clock),
			completed: new fields.BooleanField({ required: false }),
			description: new fields.HTMLField()
		}
	}
}
export interface ProgressModel extends ProgressDataPropertiesData {}

export interface ProgressDataSourceData {
	description: string
	track: ProgressTrackSource
	completed?: boolean
	clock?: ClockSource
}
export interface ProgressDataPropertiesData extends ProgressDataSourceData {
	track: ProgressTrack
	clock?: Clock
}

export interface ProgressDataSource {
	type: 'progress'
	data: ProgressDataSourceData
	system: ProgressDataSourceData
}
export interface ProgressDataProperties {
	type: 'progress'
	data: ProgressModel
	system: ProgressModel
}

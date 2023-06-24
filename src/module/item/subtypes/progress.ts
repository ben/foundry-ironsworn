import type { DataSchema } from '../../fields/utils'
import type { IronswornItem } from '../item'
import type { ProgressTrackSource } from '../../model/progress-track'
import { ProgressTrack } from '../../model/progress-track'
import type { ClockSource } from '../../model/clock'
import { Clock } from '../../model/clock'

export class ProgressData extends foundry.abstract.TypeDataModel<
	ProgressDataSourceData,
	ProgressDataPropertiesData,
	IronswornItem<'progress'>
> {
	async markProgress(times = 1) {
		return await this.parent.update({
			system: { track: this.track.getMarkData(times) }
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

	static override defineSchema(): DataSchema<ProgressDataPropertiesData> {
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
export interface ProgressData extends ProgressDataPropertiesData {}

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
	data: ProgressData
	system: ProgressData
}

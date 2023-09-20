import type { IronswornActor } from '../../actor/actor'
import type { ProgressTrackSource } from '../../model/ProgressTrack'
import { ProgressTrack } from '../../model/ProgressTrack'
import type { IronswornJournalPage } from '../journal-entry-page'

/** Model for journal entry pages of the `progress` subtype. Represents a single progress track. */
export class ProgressTrackModel extends ProgressTrack<
	IronswornJournalPage<'progressTrack'> &
		foundry.abstract.Document<any, any, any>
> {
	/**
	 * Mark progress on this track, incrementing `ticks` according to the track's challenge rank.
	 * @param times The number of times that progress is to be marked. Negative values may be used to erase progress. (default: `1`)
	 */
	async mark(times = 1) {
		return await this.parent.update({
			system: this.getMarkData(times)
		})
	}

	override async roll({
		actor,
		moveDfid
	}: {
		actor?: IronswornActor
		moveDfid?: string
	} = {}) {
		return await super.roll({
			actor,
			moveDfid,
			objective: this.parent.name as string
		})
	}
}
export interface ProgressTrackModel
	extends ProgressTrack<
		IronswornJournalPage<'progressTrack'> &
			foundry.abstract.Document<any, any, any>
	> {}

export interface ProgressTrackDataProperties {
	type: 'progressTrack'
	system: ProgressTrackModel
}
export interface ProgressTrackDataSource {
	type: 'progressTrack'
	system: ProgressTrackSource
}

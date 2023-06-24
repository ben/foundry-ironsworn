import type { IronswornActor } from '../../actor/actor'
import { ProgressTrack } from '../../model/ProgressTrack'
import type { IronswornJournalPage } from '../journal-entry-page'

export class ProgressTrackModel extends ProgressTrack<
	IronswornJournalPage<'progress'> & foundry.abstract.Document<any, any, any>
> {
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
		IronswornJournalPage<'progress'> & foundry.abstract.Document<any, any, any>
	> {}

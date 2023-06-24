import { ProgressTrack } from '../../model/progress-track'
import { IronswornJournalPage } from '../journal-entry-page'

export class ProgressTrackModel extends ProgressTrack<
	IronswornJournalPage<'progress'> & foundry.abstract.Document<any, any, any>
> {
	async markProgress(times = 1) {
		return await this.parent.update({
			system: this.getMarkData(times)
		})
	}
}
export interface ProgressTrackModel
	extends ProgressTrack<
		IronswornJournalPage<'progress'> & foundry.abstract.Document<any, any, any>
	> {}

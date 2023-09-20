import { typedDeleteDialog } from '../helpers/util'

/**
 * Extends the base {@link JournalEntryPage} document class.
 */
export class IronswornJournalPage<
	T extends JournalEntryPageType = JournalEntryPageType
> extends JournalEntryPage<T> {
	override async deleteDialog(options: Partial<DialogOptions> = {}) {
		return await typedDeleteDialog(this, options)
	}

	static override migrateData(data: any) {
		if (data.type === 'progress') data.type = 'progressTrack'
		return super.migrateData(data)
	}
}

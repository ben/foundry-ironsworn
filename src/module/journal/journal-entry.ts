import type { IronswornJournalPage } from './journal-entry-page'

export class IronswornJournalEntry extends JournalEntry {
	/**
	 * Provide an object which organizes all embedded JournalEntryPage instances by their type
	 */
	get pageTypes() {
		const types = Object.fromEntries(
			(game as any).documentTypes.JournalEntryPage.map((t) => [
				t,
				[] as Array<IronswornJournalPage<typeof t>>
			])
		)
		for (const item of this.pages.values()) {
			types[item.type].push(item)
		}
		return types as {
			[T in JournalEntryPageType]: Array<IronswornJournalPage<T>>
		}
	}
}

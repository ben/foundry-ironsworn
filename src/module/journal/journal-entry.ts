import type { IronswornJournalPage } from './journal-entry-page'

export class IronswornJournalEntry extends JournalEntry {
	// get truthTable() {}

	/**
	 * Provide an object which organizes all embedded JournalEntryPage instances by their type
	 */
	get pageTypes() {
		const types = Object.fromEntries(
			game.documentTypes.JournalEntryPage.map((t) => [t, []])
		) as { [T in JournalEntryPageType]: IronswornJournalPage<T> }
		for (const item of this.pages.values()) {
			types[item.type].push(item)
		}
		return types
	}
}

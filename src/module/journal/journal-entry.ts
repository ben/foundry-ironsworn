import { OracleTable } from '../roll-table/roll-table'
import type { IronswornJournalPage } from './journal-entry-page'

export class IronswornJournalEntry extends JournalEntry {
	get truthTable() {
		if (this.pageTypes.truth.length === 0) return undefined
		const results = this.pageTypes.truth.map((truth) =>
			truth.toTruthTableResultData()
		)
		return new OracleTable({
			name: this.name ?? '',
			results,
			flags: {
				'foundry-ironsworn': {
					sourceId: this.uuid,
					type: 'truth-options',
					subtitle: game.i18n.localize('IRONSWORN.First Start.SettingTruths')
				}
			}
		})
	}

	/**
	 * Provide an object which organizes all embedded JournalEntryPage instances by their type
	 */
	get pageTypes() {
		const types = Object.fromEntries(
			game.documentTypes.JournalEntryPage.map((t) => [
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

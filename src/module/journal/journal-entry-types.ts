import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'

import type { IronswornJournalEntry } from './journal-entry'

declare global {
	interface JournalEntry
		extends Omit<
			foundry.data.JournalEntryData,
			| 'update'
			| 'toObject'
			| 'toJSON'
			| 'permission'
			| 'name'
			| 'folder'
			| '_initializeSource'
		> {
		/**
		 * The pages contained within this JournalEntry document
		 */
		pages: EmbeddedCollection<
			DocumentClassConfig['JournalEntryPage'],
			// @ts-expect-error
			DocumentClassConfig['JournalEntry']
		>
	}

	interface JournalEntryPageData<
		T extends JournalEntryPageType = JournalEntryPageType
	> extends foundry.abstract.DocumentData<
			JournalEntryPageDataSchema,
			JournalEntryPageDataProperties,
			JournalEntryPageDataSource,
			JournalEntryPageData.ConstructorData,
			foundry.documents.BaseJournalEntryPage
		> {
		type: T
		system: JournalEntryPageSystem<T>
	}

	interface JournalEntryPage<
		T extends JournalEntryPageType = JournalEntryPageType
	> extends Omit<JournalEntryPageData<T>, 'toObject' | 'toJSON' | 'update'> {}
}

/** "Fake" JournalEntry types, set in the document flags at `foundry-ironsworn.type` */
export type JournalEntryType = 'truth-category'

declare global {
	interface DocumentClassConfig {
		JournalEntry: typeof IronswornJournalEntry
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

	interface FlagConfig {
		JournalEntry: {
			'foundry-ironsworn'?: {
				dfid?: string
				type?: JournalEntryType
			}
		}
	}
}

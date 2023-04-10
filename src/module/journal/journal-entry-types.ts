import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'

// Type augments for base JournalEntry class

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
}

declare global {
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
			}
		}
	}
}

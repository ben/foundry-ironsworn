import type { IronswornJournalPage } from './journal-entry-page'
import type {
	ProgressTrackDataProperties,
	ProgressTrackDataSource
} from './subtypes/progress'
import type {
	TruthOptionDataProperties,
	TruthOptionDataSource
} from './subtypes/truth'

/// DATA MODEL TYPING

export type JournalEntryPageDataSource =
	| { type: ValueOf<CONFIG['JournalEntryPage']['coreTypes']>; system: object }
	| ProgressTrackDataSource
	| TruthOptionDataSource
export type JournalEntryPageDataProperties =
	| { type: ValueOf<CONFIG['JournalEntryPage']['coreTypes']>; system: object }
	| ProgressTrackDataProperties
	| TruthOptionDataProperties

declare global {
	/// Type configuration
	type JournalEntryPageType = JournalEntryPageDataSource['type']
	type JournalEntryPageSystem<
		T extends JournalEntryPageType = JournalEntryPageType
	> = (JournalEntryPageDataProperties & { type: T })['system']

	interface SourceConfig {
		JournalEntryPage: JournalEntryPageDataSource
	}
	interface DataConfig {
		JournalEntryPage: JournalEntryPageDataProperties
	}
	interface DocumentClassConfig {
		JournalEntryPage: typeof IronswornJournalPage
	}
	interface FlagConfig {
		JournalEntryPage: {
			'foundry-ironsworn'?: {
				assets?: string[]
			}
		}
	}

	/// Type augmentations
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

	interface JournalEntryPageData<
		T extends JournalEntryPageType = JournalEntryPageType
	> {
		type: T
		system: Extract<JournalEntryPageDataSource, { type: T }>['system']
	}

	interface JournalEntryPage<
		T extends JournalEntryPageType = JournalEntryPageType
	> extends Omit<
			JournalEntryPageData<T>,
			'toObject' | 'toJSON' | 'update' | 'system'
		> {
		type: T
		system: Extract<JournalEntryPageDataProperties, { type: T }>['system']
	}
}

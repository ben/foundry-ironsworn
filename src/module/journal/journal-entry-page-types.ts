import type { ChallengeRank } from '../constants'

interface CounterBase {
	max: number
	value: number
}

interface Threat extends CounterBase {
	name: string
	enabled: boolean
}

interface Countdown extends CounterBase {
	name: string
	enabled: boolean
}

/// //////// PROGRESS

interface ProgressTrack {
	ticks: number
	rank: ChallengeRank
	/**
	 * For Threat/Menace from Ironsworn: Delve.
	 */
	threat?: Threat
	/**
	 * For classic Ironsworn scene challenges.
	 */
	countdown?: Countdown
}

export interface ProgressTrackDataSourceData extends ProgressTrack {}

export interface ProgressTrackDataSource {
	// distinguish progress types with different sheets?
	type: 'progress'
	system: ProgressTrackDataSourceData
}

export interface ProgressTrackDataPropertiesData
	extends ProgressTrackDataSourceData {}

export interface ProgressTrackDataProperties {
	type: 'progress'
	system: ProgressTrackDataPropertiesData
}

/// //////// CLOCKS

export interface ClockDataSourceData extends CounterBase {
	clockType: 'tension' | 'campaign'
}

export interface ClockDataPropertiesData extends ClockDataSourceData {}

export interface ClockDataSource {
	type: 'clock'
	system: ClockDataSourceData
}
export interface ClockDataProperties {
	type: 'clock'
	system: ClockDataPropertiesData
}

export type JournalEntryPageDataSource =
	| { type: ValueOf<typeof CONFIG.JournalEntryPage.coreTypes>; system: object }
	| ProgressTrackDataSource
	| ClockDataSource
export type JournalEntryPageDataProperties =
	| { type: ValueOf<typeof CONFIG.JournalEntryPage.coreTypes>; system: object }
	| ProgressTrackDataProperties
	| ClockDataProperties

declare global {
	interface SourceConfig {
		JournalEntryPage: JournalEntryPageDataSource
	}
	interface DataConfig {
		JournalEntryPage: JournalEntryPageDataProperties
	}

	type JournalEntryPageType = JournalEntryPageDataSource['type']

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

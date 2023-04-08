import { ISettingTruthOption } from 'dataforged'
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

/// ///////// SETTING TRUTH OPTION
export interface TruthOptionDataSourceData extends ISettingTruthOption {
	dfid: string
	Quest: string
}
export interface TruthOptionDataPropertiesData
	extends TruthOptionDataSourceData {}
export interface TruthOptionDataSource {
	system: TruthOptionDataSourceData
	type: 'truth'
}
export interface TruthOptionDataProperties {
	system: TruthOptionDataPropertiesData
	type: 'truth'
}

/// DATA MODEL TYPING

export type JournalEntryPageDataSource =
	| ProgressTrackDataSource
	| ClockDataSource
	| TruthOptionDataSource
export type JournalEntryPageDataProperties =
	| ProgressTrackDataProperties
	| ClockDataProperties
	| TruthOptionDataProperties

declare global {
	interface SourceConfig {
		JournalEntryPage: JournalEntryPageDataSource
	}
	interface DataConfig {
		JournalEntryPage: JournalEntryPageDataProperties
	}
}

import type { ComputedTableType } from '../roll-table/roll-table-types'
import type { IronswornChatCard } from './cards'

// Ironsworn-specific augmentations
declare global {
	interface ChatMessage {
		ironswornCard?: IronswornChatCard
	}
	interface FlagConfig {
		ChatMessage: {
			core?: {
				/** @remarks We don't use this; FVTT sets it so it's here to maintain parity */
				RollTable?: RollTable['id']
			}
			'foundry-ironsworn'?: {
				/** The dice totals of rerolls that have been executed on an oracle roll message. The last value is the most recent. */
				rerolls?: number[]
				rollTableType?: ComputedTableType
				sourceId?:
					| RollTable['uuid']
					| Item['uuid']
					| Actor['uuid']
					| JournalEntry['uuid']
			}
		}
	}
}

declare global {
	interface ChatMessage {
		/** v10+. Technically, ChatMessage#roll is deprecated, and it just gets ChatMessage#roll[0]. */
		rolls?: Roll[] | null | undefined
	}
}

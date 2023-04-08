import type { IronswornChatCard } from './cards'

// Ironsworn-specific augmentations
declare global {
	interface ChatMessage {
		ironswornCard?: IronswornChatCard
	}
}

declare global {
	interface ChatMessage {
		/** v10+. Technically, ChatMessage#roll is deprecated, and it just gets ChatMessage#roll[0]. */
		rolls?: Roll[] | null | undefined
	}
}

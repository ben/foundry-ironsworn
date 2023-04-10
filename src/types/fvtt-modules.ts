import type { ChatSpeakerData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatSpeakerData'

declare global {
	interface Game {
		// MODULE: Dice So Nice
		dice3d?: {
			/**
			 * Show the 3D Dice animation for the Roll made by the User.
			 *
			 * @param roll - an instance of Roll class to show 3D dice animation.
			 * @param user - the user who made the roll (game.user by default).
			 * @param synchronize - if the animation needs to be shown to other players. Default: false
			 * @param whisper - list of users or userId who can see the roll, set it to null if everyone can see. Default: null
			 * @param blind - if the roll is blind for the current user. Default: false
			 * @param chatMessageID  -A chatMessage ID to reveal when the roll ends. Default: null
			 * @param speaker - An object using the same data schema than ChatSpeakerData. Needed to hide NPCs roll when the GM enables this setting.
			 * @returns {Promise<boolean>} when resolved true if the animation was displayed, false if not.
			 */
			showForRoll: (
				roll: Roll,
				user?: User | null,
				synchronize?: boolean,
				whisper?: Array<string | User>,
				blind?: boolean,
				chatMessageID?: string | null,
				speaker?: ChatSpeakerData
			) => Promise<boolean>
		}
	}
}

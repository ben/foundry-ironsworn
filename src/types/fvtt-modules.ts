/* eslint-disable @typescript-eslint/no-namespace */
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
			 * @param chatMessageID - A chatMessage ID to reveal when the roll ends. Default: null
			 * @param speaker - An object using the same data schema than ChatSpeakerData. Needed to hide NPCs roll when the GM enables this setting.
			 * @returns when resolved true if the animation was displayed, false if not.
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
	namespace ClientSettings {
		const enum GlobalAnimationSpeed {
			PlayerSpeed = '0',
			NormalSpeed = '1',
			'2xSpeed' = '2',
			'3xSpeed' = '3'
		}
		// GM/World-level settings for Dice So Nice
		interface Values {
			/**
			 * @minimum 20
			 * @maximum 100
			 * @default 20
			 */
			'dice-so-nice.maxDiceNumber': number

			/**
			 * @default GlobalAnimationSpeed.PlayerSpeed
			 */
			'dice-so-nice.globalAnimationSpeed': GlobalAnimationSpeed
			/**
			 * @default true
			 */
			'dice-so-nice.enabledSimultaneousRolls': boolean
			/**
			 * @default true
			 */
			'dice-so-nice.enabledSimultaneousRollForMessage': boolean
			/**
			 * @default true
			 */
			'dice-so-nice.diceCanBeFlipped': boolean
			/**
			 * Not configurable; used internally by DiceSoNice.
			 * @remarks We're probably not supposed to touch this.
			 */
			readonly 'dice-so-nice.formatVersion': string
			/**
			 * @default false
			 */
			'dice-so-nice.disabledDuringCombat': boolean
			/**
			 * @default false
			 */
			'dice-so-nice.disabledForInitiative': boolean
			/**
			 * @default false
			 */
			'dice-so-nice.immediatelyDisplayChatMessages': boolean
			/**
			 * @default false
			 */
			'dice-so-nice.animateRollTable': boolean
			/**
			 * @default true
			 */
			'dice-so-nice.animateInlineRoll': boolean
			/**
			 * @default false
			 */
			'dice-so-nice.hideNpcRolls': boolean
			/**
			 * @default true
			 */
			'dice-so-nice.allowInteractivity': boolean
			/**
			 * @default false
			 */
			'dice-so-nice.showGhostDice': boolean
		}
	}
}

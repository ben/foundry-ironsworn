import ChallengeResolutionDialogVue from '../vue/challenge-resolution-dialog.vue'
import { VueAppMixin } from '../vue/vueapp.js'

export class ChallengeResolutionDialog extends VueAppMixin(Application) {
	private constructor(
		protected messageId: string,
		options?: Partial<ApplicationOptions>
	) {
		super(options)
	}

	static openDialogs = {} as Record<string, ChallengeResolutionDialog>

	static async showForMessage(messageId: string) {
		// Prevent duplicates
		if (this.openDialogs[messageId]) {
			return await this.openDialogs[messageId].render(true)
		}

		const el = $(`.chat-message[data-message-id="${messageId}"`)
		if (el.length < 1) return

		this.openDialogs[messageId] = new ChallengeResolutionDialog(messageId, {
			left: window.innerWidth - 620,
			top: Math.min(el[0].offsetTop - 50, window.innerHeight - 300)
		})
		this.openDialogs[messageId].render(true)

		return this.openDialogs[messageId]
	}

	async close(options?: Application.CloseOptions): Promise<void> {
		delete ChallengeResolutionDialog.openDialogs[this.messageId]
		await super.close(options)
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: 'IRONSWORN.ResolveChallenge',
			width: 300,
			height: 280,
			rootComponent: ChallengeResolutionDialogVue
		}) as any
	}

	getData(
		options?: Partial<ApplicationOptions> | undefined
	): MaybePromise<object> {
		return {
			...super.getData(options),
			messageId: this.messageId
		}
	}
}

import { ChallengeRank } from '../../fields/ChallengeRank'
import type { ProgressTrackSource } from '../../model/ProgressTrack'
import type { IronswornJournalPage } from '../journal-entry-page'

export class JournalProgressPageSheet extends JournalPageSheet {
	declare object: IronswornJournalPage<'progressTrack'>

	static get defaultOptions() {
		const options = super.defaultOptions
		options.height = 300
		options.classes.push('progress', 'ironsworn')
		console.log({ options })
		return options
	}

	get template() {
		return `systems/foundry-ironsworn/templates/journal/progress-page-${
			this.isEditable ? 'edit' : 'view'
		}.hbs`
	}

	protected async _renderInner(data) {
		await (loadTemplates as any)({
			progressButtons:
				'systems/foundry-ironsworn/templates/journal/progress-buttons.hbs',
			progressBoxes:
				'systems/foundry-ironsworn/templates/journal/progress-boxes.hbs',
			rankPips:
				'systems/foundry-ironsworn/templates/journal/progress-rank-pips.hbs'
		})
		return await super._renderInner(data)
	}

	getData(options?: Partial<DocumentSheetOptions> | undefined): any {
		const data = super.getData(options) as any as JournalPageSheet.Data & {
			document: IronswornJournalPage<'progressTrack'>
			data: { system: ProgressTrackSource }
			currentRank: string
			rankButtons: Array<{ rank: number; i18nRank: string; selected: boolean }>
			filledBoxes: number
			boxes: Array<{
				ticks: number
				lineTransforms: string[]
			}>
		}

		data.filledBoxes = data.document.system.filledBoxes

		data.currentRank = data.document.system.localizeRank()

		data.rankButtons = Object.values(ChallengeRank.RANK).map((rank) => ({
			rank,
			i18nRank: ChallengeRank.localizeValue(rank),
			selected: data.data.system.rank === rank
		}))

		// SVG line transforms for each tick
		const transforms = [
			'rotate(-45, 50, 50)', // tick 1
			'rotate(45, 50, 50)', // tick 2
			'rotate(-90, 50, 50)', // tick 3
			'' // tick 4
		]

		data.boxes = data.document.system.boxValues.map((ticks) => ({
			ticks,
			lineTransforms: transforms.slice(0, ticks)
		}))
		return data
	}

	activateListeners(html: JQuery<HTMLElement>): void {
		html.find('.rank-pip').on('click', async (ev) => {
			await this.object.update({
				// @ts-expect-error
				system: { rank: parseInt(ev.currentTarget.dataset.rank ?? '0') }
			})
			this.render()
		})
		html.find('.ironsworn__progress__mark').on('click', async () => {
			await this.object.system.mark(1)
			this.render()
		})
		html.find('.ironsworn__progress__unmark').on('click', async () => {
			await this.object.system.mark(-1)
			this.render()
		})
		html
			.find('.ironsworn__progress__roll')
			.on('click', async () => this.object.system.roll())
	}
}

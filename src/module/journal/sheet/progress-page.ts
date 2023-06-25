import { fill, range } from 'lodash-es'
import { RANK_INCREMENTS } from '../../constants'
import { ChallengeRank } from '../../fields/ChallengeRank'
import { IronswornPrerollDialog } from '../../rolls'

export class JournalProgressPageSheet extends JournalPageSheet {
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
		const data = super.getData(options) as any

		data.currentRank = ChallengeRank.localizeValue(
			data.data.system.rank ?? ChallengeRank.RANK.Troublesome
		)
		data.rankButtons = Object.values(ChallengeRank.RANK).map((rank) => ({
			rank,
			i18nRank: ChallengeRank.localizeValue(rank),
			selected: data.data.system.rank === rank
		}))

		// Compute some progress numbers
		const boxes = range(10).map((_) => ({
			ticks: 0,
			lineTransforms: [] as string[]
		}))
		const ticksRemainder = data.data.system.ticks % 4
		data.filledBoxes = Math.floor(data.data.system.ticks / 4)

		fill(boxes, { ticks: 4, lineTransforms: [] }, 0, data.filledBoxes)
		boxes[data.filledBoxes] = { ticks: ticksRemainder, lineTransforms: [] }

		// List of line transforms
		const transforms = [
			'rotate(-45, 50, 50)',
			'rotate(45, 50, 50)',
			'rotate(-90, 50, 50)',
			''
		]
		for (let i = 0; i < boxes.length; i++) {
			const box = boxes[i]

			if (box.ticks > 0) box.lineTransforms.push(transforms[0])
			if (box.ticks > 1) box.lineTransforms.push(transforms[1])
			if (box.ticks > 2) box.lineTransforms.push(transforms[2])
			if (box.ticks > 3) box.lineTransforms.push(transforms[3])
		}
		data.boxes = boxes

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
			await increment(this.object, 1)
			this.render()
		})
		html.find('.ironsworn__progress__unmark').on('click', async () => {
			await increment(this.object, -1)
			this.render()
		})
		html.find('.ironsworn__progress__roll').on('click', async () => {
			const { filledBoxes } = await this.getData()
			IronswornPrerollDialog.showForProgress(
				this.object.name ?? '(progress)',
				filledBoxes
			)
		})
	}
}

function increment(object: any, direction: 1 | -1) {
	const rank: ChallengeRank.Value =
		object.system.rank ?? ChallengeRank.RANK.Troublesome
	const increment = RANK_INCREMENTS[rank]
	const currentValue = object.system.ticks || 0
	const newValue = currentValue + increment * direction
	return object.update({
		system: { ticks: Math.min(Math.max(newValue, 0), 40) }
	})
}

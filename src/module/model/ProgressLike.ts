import { fill } from 'lodash-es'
import type { IronswornActor } from '../actor/actor'
import { IronswornPrerollDialog } from '../rolls'

/** Constants and behavior common to progress tracks, Starforged legacy tracks, and the classic Bonds track. */
export abstract class ProgressLike<
	SourceData extends ProgressLikeSource,
	ConcreteData extends ProgressLikeProperties,
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<SourceData, ConcreteData, Parent> {
	/** The minimum score when making a progress roll. */
	static readonly SCORE_MIN = 0 as const
	/** The maximum score when making a progress roll. */
	static readonly SCORE_MAX = 10 as const
	/** The number of ticks in one box of progress. */
	static readonly TICKS_PER_BOX = 4 as const
	/** The number of boxes in a progress track. */
	static readonly BOXES = this.SCORE_MAX
	/** The minimum number of ticks in a progress track. */
	static readonly TICKS_MIN = 0 as const
	/** The maximum number of ticks in a progress track. */
	static readonly TICKS_MAX = this.TICKS_PER_BOX * this.BOXES

	abstract getMarkData(value?: number): { ticks: number }

	// getAlertText(changes: Partial<SourceData>) {
	// 	if (changes.ticks != null) {
	// 		const advanced = changes.ticks > this.ticks

	// 		return game.i18n.localize(
	// 			`IRONSWORN.ChatAlert.Progress${advanced ? 'Advanced' : 'Reduced'}`
	// 		)
	// 	}
	// 	return undefined
	// }

	/** Make a progress roll against this track. */
	async roll({
		actor,
		objective,
		moveDfid
	}: {
		actor?: IronswornActor
		objective?: string
		moveDfid?: string
	}) {
		if (moveDfid != null)
			return await IronswornPrerollDialog.showForOfficialMove(moveDfid, {
				actor,
				progress: {
					source: objective ?? '',
					value: this.score
				}
			})
		// no progress move available -- fall back to generic progress dialog
		return await IronswornPrerollDialog.showForProgress(
			objective ?? '(progress)',
			this.score,
			actor ?? undefined,
			moveDfid
		)
	}

	/** The derived progress score, an integer from 0 to 10. Capped at SCORE_MAX. */
	get score() {
		return ProgressLike.getScore(this.ticks)
	}

	/** The derived progress score, with remainder ticks represented as a decimal value (`0.25` per tick). Capped at SCORE_MAX. */
	get decimalValue() {
		return ProgressLike.getScore(this.ticks, true)
	}

	/** The number of filled progress boxes. Unlike `score`, this is *not* capped by SCORE_MAX. */
	get filledBoxes() {
		return ProgressLike.getFilledBoxes(this.ticks)
	}

	/** Computes the visible ticks in each box of this progress track.
	 * @return An array of numbers. Each value in the array represents the number of ticks in a progress box.
	 * */
	get boxValues() {
		return ProgressLike.getBoxValues(this.ticks)
	}

	/**
	 * Compute the progress score for the given number of ticks. This is capped at SCORE_MAX.
	 * @param ticks - The number of progress ticks to compute for.
	 * @param asDecimal - Should remainder ticks be represented as a decimal value? (default: `false`)
	 */
	static getScore(ticks: number, asDecimal = false) {
		return Math.clamped(
			this.getFilledBoxes(ticks, asDecimal),
			this.SCORE_MIN,
			this.SCORE_MAX
		)
	}

	/**
	 * Compute the number of filled progress boxes. Unlike `getScore`, this is *not* capped by SCORE_MAX.
	 * @param ticks - The number of progress ticks to compute for.
	 * @param asDecimal - Should remainder ticks be represented as a decimal value? (default: `false`)
	 */
	static getFilledBoxes(ticks: number, asDecimal = false) {
		if (asDecimal) return ticks / this.TICKS_PER_BOX
		return Math.floor(ticks / this.TICKS_PER_BOX)
	}

	/** Computes the ticks in each box of a progress track.
	 * @param ticks - The number of ticks on the progress track.
	 * @param ignoreScoreMax - Can the result have more than 10 progress boxes? If `false`, only the *last* 10 boxes will be returned. (default: `false`)
	 * @return An array of numbers. Each value in the array represents the number of ticks in a progress box.
	 */
	static getBoxValues(ticks: number, ignoreScoreMax = false) {
		const tracksFilled = Math.floor(this.getFilledBoxes(ticks) / this.BOXES)
		const boxValues = Array<number>(this.BOXES * (1 + tracksFilled))
		const filledBoxes = this.getFilledBoxes(ticks)
		const ticksRemainder = ticks % this.TICKS_PER_BOX

		fill(boxValues, this.TICKS_PER_BOX, 0, filledBoxes)
		if (ticksRemainder > 0) boxValues[filledBoxes] = ticksRemainder

		if (ignoreScoreMax) return boxValues

		return boxValues.slice(-this.BOXES)
	}
}
export interface ProgressLike<
	SourceData extends ProgressLikeSource,
	ConcreteData extends ProgressLikeProperties,
	Parent extends foundry.abstract.DataModel.AnyOrDoc = foundry.abstract.DataModel.AnyOrDoc
> extends foundry.abstract.DataModel<SourceData, ConcreteData, Parent>,
		ProgressLikeProperties {}

export interface ProgressLikeProperties extends ProgressLikeSource {}
export interface ProgressLikeSource {
	ticks: number
}

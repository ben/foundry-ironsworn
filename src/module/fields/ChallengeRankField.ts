import { ChallengeRank } from '../constants'
import { localizeRank } from '../helpers/util'
import { enumEntries } from '../fields/utils'

export class ChallengeRankField extends foundry.data.fields
	.NumberField<ChallengeRank> {
	/**
	 *
	 */
	constructor(
		options?: Partial<
			Omit<
				foundry.data.fields.NumberField.Options<ChallengeRank>,
				'choices' | 'step' | 'integer' | 'max' | 'min' | 'positive'
			>
		>
	) {
		super({
			label: 'IRONSWORN.ChallengeRank',
			// @ts-expect-error
			choices: Object.fromEntries(
				enumEntries(ChallengeRank).map(([k, v]) => [v, localizeRank(v)])
			),
			initial: ChallengeRank.Troublesome,
			step: 1,
			integer: true,
			max: ChallengeRank.Epic,
			min: ChallengeRank.Troublesome,
			...options
		})
	}
}

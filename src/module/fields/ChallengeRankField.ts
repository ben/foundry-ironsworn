export class ChallengeRankField extends foundry.data.fields.NumberField {
	/**
	 * Enumerates challenge ranks.
	 * @enum
	 */
	static readonly RANK = {
		Troublesome: 1,
		Dangerous: 2,
		Formidable: 3,
		Extreme: 4,
		Epic: 5
	} as const

	constructor(
		options?: Partial<
			Omit<
				foundry.data.fields.NumberField.Options,
				'choices' | 'step' | 'integer' | 'max' | 'min' | 'positive'
			>
		>
	) {
		super({
			label: 'IRONSWORN.ChallengeRank',
			choices: Object.fromEntries(
				Object.entries(ChallengeRankField.RANK).map(([key, numericValue]) => [
					numericValue,
					`IRONSWORN.CHALLENGERANK.${key}`
				])
			) as {
				[R in keyof typeof ChallengeRankField.RANK as (typeof ChallengeRankField)['RANK'][R]]: string
			},
			initial: ChallengeRankField.RANK.Troublesome as number,
			integer: true,
			min: ChallengeRankField.RANK.Troublesome,
			max: ChallengeRankField.RANK.Epic,
			...options
		})
	}

	override _cast(value: unknown) {
		switch (true) {
			case value === 'formidible':
				return ChallengeRankField.RANK.Formidable
			case typeof value === 'string':
				return ChallengeRankField.RANK[
					(value as string).capitalize() as keyof typeof ChallengeRankField.RANK
				]
			default: {
				return super._cast(value)
			}
		}
	}
}
export interface ChallengeRankField extends foundry.data.fields.NumberField {}

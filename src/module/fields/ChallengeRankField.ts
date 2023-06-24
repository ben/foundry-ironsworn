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

	static readonly i18nKeys = Object.fromEntries(
		Object.entries(ChallengeRankField.RANK).map(([key, numericValue]) => [
			numericValue,
			`IRONSWORN.CHALLENGERANK.${key}`
		])
	) as Record<ChallengeRankField.Rank, string>

	static readonly RANK_MIN = this.RANK.Troublesome
	static readonly RANK_MAX = this.RANK.Epic

	static localizeValue(rank: ChallengeRankField.Rank) {
		return game.i18n.localize(ChallengeRankField.i18nKeys[rank])
	}

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
			choices: ChallengeRankField.i18nKeys,
			initial: ChallengeRankField.RANK_MIN as number,
			integer: true,
			min: ChallengeRankField.RANK_MIN,
			max: ChallengeRankField.RANK_MAX,
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
export interface ChallengeRankField extends foundry.data.fields.NumberField {
	choices: {
		[R in ChallengeRankField.Rank]: string
	}
}

export namespace ChallengeRankField {
	export type Rank = ValueOf<(typeof ChallengeRankField)['RANK']>
}

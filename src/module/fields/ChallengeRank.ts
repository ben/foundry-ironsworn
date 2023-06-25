/** Represents a challenge rank, usually for a progress track. */
export class ChallengeRank extends foundry.data.fields.NumberField {
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

	static readonly MIN = this.RANK.Troublesome
	static readonly MAX = this.RANK.Epic

	static readonly i18nKeys = Object.fromEntries(
		Object.entries(ChallengeRank.RANK).map(([key, numericValue]) => [
			numericValue,
			`IRONSWORN.CHALLENGERANK.${key}`
		])
	) as Record<ChallengeRank.Value, string>

	static localizeValue(rank: ChallengeRank.Value) {
		return game.i18n.localize(ChallengeRank.i18nKeys[rank])
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
			choices: ChallengeRank.i18nKeys,
			initial: ChallengeRank.MIN as number,
			integer: true,
			min: ChallengeRank.MIN,
			max: ChallengeRank.MAX,
			...options
		})
	}

	override _cast(value: unknown) {
		switch (true) {
			case value === 'formidible':
				return ChallengeRank.RANK.Formidable
			case typeof value === 'string':
				return ChallengeRank.RANK[
					(value as string).capitalize() as keyof typeof ChallengeRank.RANK
				]
			default: {
				return super._cast(value)
			}
		}
	}
}
export interface ChallengeRank extends foundry.data.fields.NumberField {
	choices: {
		[R in ChallengeRank.Value]: string
	}
}

export namespace ChallengeRank {
	/** A numeric challenge rank value. */
	export type Value = ValueOf<(typeof ChallengeRank)['RANK']>
}

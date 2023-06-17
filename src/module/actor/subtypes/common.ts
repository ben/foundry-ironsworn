/** Standardizes some properties across the various actor models. */
export interface IronActorModel {
	/** Canonical status effects that are permitted on this character. */
	isValidImpact(statusEffect: StatusEffectV11): boolean
}

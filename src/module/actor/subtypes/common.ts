/** Standardizes some properties across the various actor models. */
export interface IronActorModel {
	/** Is an impact valid for use on this actor subtype? */
	isValidImpact(statusEffect: StatusEffectV11): boolean
}

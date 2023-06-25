export class ImpactField extends foundry.data.fields.BooleanField {
	/**
	 *
	 */
	constructor(
		options?: Omit<
			Partial<foundry.data.fields.BooleanField.Options>,
			'initial' | 'required'
		>
	) {
		super({
			initial: false,
			required: true,
			...options
		})
	}
}

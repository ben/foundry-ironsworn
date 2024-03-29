export class ProgressTicksField extends foundry.data.fields.NumberField {
	constructor(
		options?: Omit<
			Partial<foundry.data.fields.NumberField>,
			'choices' | 'step' | 'integer' | 'min' | 'positive'
		>
	) {
		super({
			min: 0,
			initial: 0,
			max: 40,
			integer: true,
			...(options as any)
		})
	}
}
export interface ProgressTicksField extends foundry.data.fields.NumberField {}

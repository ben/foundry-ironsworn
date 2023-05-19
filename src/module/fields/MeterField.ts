export class MeterField extends foundry.data.fields.NumberField {
	constructor({
		label,
		max = 5,
		min = 0,
		initial = max as any
	}: Pick<foundry.data.fields.NumberField, 'label'> &
		Partial<Pick<foundry.data.fields.NumberField, 'max' | 'min' | 'initial'>>) {
		super({
			label,
			integer: true,
			required: true,
			step: 1,
			min,
			max,
			initial
		})
	}
}

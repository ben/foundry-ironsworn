export class StatField extends foundry.data.fields.NumberField {
	constructor({ label }: Pick<foundry.data.fields.NumberField, 'label'>) {
		super({
			label,
			integer: true,
			required: true,
			step: 1,
			min: 0,
			max: 4,
			initial: 1
		})
	}
}

export class StatField extends foundry.data.fields.NumberField {
	constructor({ label }: { label: string }) {
		super({
			label,
			integer: true,
			required: true,
			min: -5,
			max: 10,
			initial: 1
		})
	}
}

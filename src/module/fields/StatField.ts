export class StatField extends foundry.data.fields.NumberField {
	constructor({ label }: { label: string }) {
		super({
			label,
			integer: true,
			required: true,
			min: 0,
			max: 4,
			initial: 1
		})
	}
}

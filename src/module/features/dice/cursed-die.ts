export class DieCursed extends Die {
	constructor(termData) {
		termData.faces = 10
		super(termData)
	}

	/* -------------------------------------------- */

	/** @override */
	static DENOMINATION = 's'

	/** @override */
	get total() {
		return this.results.filter((r) => r.result === 10).length
	}

	/* -------------------------------------------- */

	/** @override */
	getResultLabel(result) {
		return {
			'1': '&nbsp;',
			'2': '&nbsp;',
			'3': '&nbsp;',
			'4': '&nbsp;',
			'5': '&nbsp;',
			'6': '&nbsp;',
			'7': '&nbsp;',
			'8': '&nbsp;',
			'9': '&nbsp;',
			'10': '💀'
		}[result.result]
	}
}

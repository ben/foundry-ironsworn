import type { OracleTable } from '../roll-table/oracle-table'

export function registerCompendiumCategoryHook() {
	Hooks.on('renderCompendium', async (_app, html: JQuery, opts) => {
		if (opts.documentCls !== 'rolltable') return

		const collection = opts.collection
		for (const el of html.find('.directory-item')) {
			const table = (await collection.getDocument(
				el.dataset.documentId
			)) as OracleTable
			const catFlag = table.getFlag('foundry-ironsworn', 'category')
			if (catFlag != null) {
				const cat = catFlag
					.replace(/(Starforged|Ironsworn)\/Oracles\//, '')
					.replace(/_/g, ' ')
				$(el).append(
					`<small style="flex-grow: 0; white-space: nowrap">${cat}</small>`
				)
			}
		}
	})
}

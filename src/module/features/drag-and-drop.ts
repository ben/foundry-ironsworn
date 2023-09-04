import type { SystemSubtype } from '../../config'

function getIndexEntry(el: HTMLElement) {
	const { documentId } = el.dataset
	const packId = $(el).parents('.compendium').data('pack')
	const pack = game.packs.get(packId)
	return pack?.index.get(documentId || '')
}

export function registerDragAndDropHooks() {
	Hooks.on('renderCompendium', (_app, html) => {
		html
			.find('.directory-item')
			.on(
				'dragstart',
				(ev: JQuery.DragStartEvent<unknown, unknown, unknown, HTMLElement>) => {
					// Set data attribute on potential targets
					const indexEntry = getIndexEntry(ev.target) as ReturnType<
						typeof getIndexEntry
					> & { type: string }

					CONFIG.IRONSWORN.emitter.emit(
						'dragStart',
						indexEntry?.type as SystemSubtype
					)
				}
			)
			.on(
				'dragend',
				(ev: JQuery.DragEndEvent<unknown, unknown, unknown, HTMLElement>) => {
					const indexEntry = getIndexEntry(ev.target) as ReturnType<
						typeof getIndexEntry
					> & { type: string }

					CONFIG.IRONSWORN.emitter.emit(
						'dragEnd',
						indexEntry?.type as SystemSubtype
					)
				}
			)
	})
}

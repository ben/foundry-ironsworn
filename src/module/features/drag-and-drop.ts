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
          $(document)
            .find(`[data-ironsworn-drop-type="${indexEntry?.type}"]`)
            .attr('data-ironsworn-drop-active', 'true')
        }
      )
      .on(
        'dragend',
        (ev: JQuery.DragEndEvent<unknown, unknown, unknown, HTMLElement>) => {
          const indexEntry = getIndexEntry(ev.target) as ReturnType<
            typeof getIndexEntry
          > & { type: string }

          $(document)
            .find(`[data-ironsworn-drop-type="${indexEntry?.type}"]`)
            .attr('data-ironsworn-drop-active', 'false')
        }
      )
  })
}

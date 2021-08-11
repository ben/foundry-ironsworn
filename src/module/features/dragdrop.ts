function getIndexEntry(el: HTMLElement): Pick<any, "type"> | undefined {
  const { documentId } = el.dataset
  const packId = $(el).parents('.compendium').data('pack')
  const pack = game.packs.get(packId)
  return pack?.index.get(documentId || '')
}

export function activateDragDropListeners() {
  Hooks.on('renderCompendium', (_app, html) => {
    html
      .find('.directory-item')
      .on('dragstart', (ev: JQuery.DragStartEvent) => {
        // Add a class to the potential targets
        const indexEntry = getIndexEntry(ev.target)
        $(document).find(`.ironsworn__drop__target[data-drop-type="${indexEntry?.type}"]`).addClass('drag-highlight')
      })
      .on('dragend', (ev: JQuery.DragEndEvent) => {
        const indexEntry = getIndexEntry(ev.target)
        $(document).find(`.ironsworn__drop__target[data-drop-type="${indexEntry?.type}"]`).removeClass('drag-highlight')
      })
  })
}

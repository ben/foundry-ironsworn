import { JournalEntrySidebar } from '../journalentry/sidebar'

export function registerJournalHooks() {
  Hooks.on('getJournalSheetHeaderButtons', (sheet, buttons) => {
    buttons.unshift({
      class: 'ironsworn-sidebar',
      label: 'Tools',
      icon: 'fas fa-toolbox',
      onclick: (_e) => {
        const anySheet = sheet as any
        anySheet.sidebar ||= new JournalEntrySidebar(sheet.object, {
          left: (sheet.options.left ?? 0) + (sheet.options.width ?? 0),
        })
        anySheet.sidebar.render(true, { focus: true })
      },
    })
  })

  Hooks.on('renderJournalSheet', (sheet: JournalSheet, el: JQuery, _data) => {
    // If this is a progress JE, just open the sheet
    const anySheet = sheet as any
    if (
      anySheet._state <= Application.RENDER_STATES.RENDERING &&
      sheet.document.getFlag('foundry-ironsworn', 'isProgress')
    ) {
      anySheet.sidebar ||= new JournalEntrySidebar(sheet.object, {
        left: el.position().left + (el.width() ?? 100) + 5,
        top: el.position().top,
      })
      anySheet.sidebar.render(true)
    }
  })

  Hooks.on('closeJournalSheet', (sheet) => {
    sheet.sidebar?.close()
  })
}

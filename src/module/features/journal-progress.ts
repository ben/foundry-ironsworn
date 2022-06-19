export function registerJournalHooks() {
  Hooks.on('getJournalSheetHeaderButtons', (sheet, buttons) => {
    console.log(sheet, buttons)
    buttons.unshift({
      class: 'ironsworn-sidebar',
      label: 'Progress',
      icon: 'fas fa-spinner',
      onclick: (e) => console.log(e),
    })
  })

  Hooks.on('renderJournalSheet', (sheet, el, data) => {
    console.log(sheet, el, data)
  })
}

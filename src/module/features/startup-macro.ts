export function runStartupMacro() {
  const macro = game.macros?.getName('Ironsworn Startup')
  macro?.execute()
}

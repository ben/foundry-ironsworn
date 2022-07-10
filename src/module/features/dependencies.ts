export async function maybePromptForDependencies() {
  const libwrapper = game.modules.get('lib-wrapper')

  const gm = game.user?.isGM
  const prompt = true // TODO: game.settings.get('archmage', 'dependencyPrompt')

  // If the modules don't exist, warn the user.
  if (!libwrapper) {
    if (gm) {
      ui.notifications?.error(
        'This system requires the libwrapper module to be installed.'
      )
    }
  } else {
    // If the modules exist but aren't enabled, prompt the user.
    if (!libwrapper.active) {
      if (prompt && gm) {
        Dialog.confirm({
          title: 'Enable dependencies?', // TODO: game.i18n.format('ARCHMAGE.UI.enableDependencies'),
          content:
            'This system requires the libwrapper module to be enabled. Would you like to enable it now?', // TODO: game.i18n.format('ARCHMAGE.UI.dependencyContent'),
          yes: async () => {
            const moduleSettings = game.settings.get(
              'core',
              'moduleConfiguration'
            ) as any
            moduleSettings['lib-wrapper'] = true
            await game.settings.set(
              'core',
              'moduleConfiguration',
              moduleSettings
            )
            window.location.reload()
          },
        })
      }
    }
  }
}

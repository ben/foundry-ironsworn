export async function maybePromptForDependencies() {
  const dlopen = game.modules.get('dlopen')
  const vueport = game.modules.get('vueport')

  const gm = game.user?.isGM
  const prompt = true // TODO: game.settings.get('archmage', 'dependencyPrompt')

  // If the modules don't exist, warn the user.
  if (!dlopen || !vueport) {
    if (gm) {
      ui.notifications?.error('This system requires the dlopen and vueport modules to be installed.')
    }
  } else {
    // If the modules exist but aren't enabled, prompt the user.
    if ((dlopen && !dlopen.active) || (vueport && !vueport.active)) {
      if (prompt && gm) {
        Dialog.confirm({
          title: 'Enable dependencies?', // TODO: game.i18n.format('ARCHMAGE.UI.enableDependencies'),
          content: 'This system requires the VuePort and dlopen modules to be enabled. Would you like to enable them now?', // TODO: game.i18n.format('ARCHMAGE.UI.dependencyContent'),
          yes: async () => {
            const moduleSettings = game.settings.get('core', 'moduleConfiguration') as any
            moduleSettings['dlopen'] = true
            moduleSettings['vueport'] = true
            await game.settings.set('core', 'moduleConfiguration', moduleSettings)
            window.location.reload()
          },
        })
        // Prevent repeated prompts on subsequent loads.
        // TODO: game.settings.set('archmage', 'dependencyPrompt', false)
      }
    } else {
      // If Dlopen is present, load the dependencies.
      if (typeof Dlopen !== 'undefined') {
        const loadDependencies = async function () {
          // Preload Vue dependencies via Dlopen.
          try {
            Dlopen.register('vuecomponents', {
              scripts: 'systems/foundry-ironsworn/vuecomponents.js',
            })

            await Dlopen.loadDependencies(['vue', 'vuecomponents'])
            require('./patchvue')
          } catch (error) {
            console.log('Dlopen was unable to load Vue. Now trying to load locally instead...')
          }
        }
        loadDependencies()
      }
    }
  }
}

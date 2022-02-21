import { IronswornSettings } from '../helpers/settings'

export function activateSceneButtonListeners() {
  if (!IronswornSettings.starforgedBeta) return

  CONFIG.Canvas.layers['ironsworn'] = { layerClass: IronswornCanvasLayer, group: 'primary' }

  Hooks.on('getSceneControlButtons', (controls) => {
    console.log({ controls })
    if (!game.user?.isGM) {
      return controls
    }

    const sfControl: SceneControl = {
      name: 'Starforged',
      title: game.i18n.localize('IRONSWORN.StarforgedTools'),
      icon: 'fas fa-space-shuttle',
      layer: 'ironsworn',
      visible: true,
      activeTool: 'select',
      tools: [
        { name: 'star', icon: 'fas fa-globe', title: game.i18n.localize('IRONSWORN.NewSector') },
        { name: 'star', icon: 'fas fa-star', title: game.i18n.localize('IRONSWORN.NewStar') },
        { name: 'planet', icon: 'fas fa-globe-europe', title: game.i18n.localize('IRONSWORN.NewPlanet') },
        { name: 'settlement', icon: 'fas fa-city', title: game.i18n.localize('IRONSWORN.NewSettlement') },
      ],
    }

    controls.push(sfControl)
    return controls
  })
}

class IronswornCanvasLayer extends CanvasLayer {
  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      zIndex: 180,
      name: 'ironsworn',
    })
  }
}

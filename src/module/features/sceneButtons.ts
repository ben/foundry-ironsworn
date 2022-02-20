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
      title: 'Starforged Tools', // TODO: i18n
      icon: 'fas fa-space-shuttle',
      layer: 'ironsworn',
      visible: true,
      activeTool: 'select',
      tools: [
        { name: 'star', icon: 'fas fa-star', title: 'Create Star' },
        { name: 'planet', icon: 'fas fa-globe-europe', title: 'Create Planet' },
        { name: 'settlement', icon: 'fas fa-city', title: 'Create Settlement' },
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

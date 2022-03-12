import { EditSectorDialog } from '../applications/sf/editSectorApp'
import { IronswornSettings } from '../helpers/settings'

function warn() {
  ui.notifications?.warn('Soon™')
}

function editSector() {
  const sceneId = game.user?.viewedScene
  if (sceneId) {
    new EditSectorDialog(sceneId).render(true)
  }
}

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
        { name: 'edit', icon: 'fas fa-edit', title: game.i18n.localize('IRONSWORN.Edit'), onClick: editSector },
        { name: 'sector', icon: 'fas fa-globe', title: game.i18n.localize('IRONSWORN.NewSector'), onClick: warn },
        { name: 'star', icon: 'fas fa-star', title: game.i18n.localize('IRONSWORN.NewStar'), onClick: warn },
        { name: 'planet', icon: 'fas fa-globe-europe', title: game.i18n.localize('IRONSWORN.NewPlanet'), onClick: warn },
        { name: 'settlement', icon: 'fas fa-city', title: game.i18n.localize('IRONSWORN.NewSettlement'), onClick: warn },
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

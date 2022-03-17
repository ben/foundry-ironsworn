import { IronswornActor } from '../actor/actor'
import { EditSectorDialog } from '../applications/sf/editSectorApp'
import { IronswornSettings } from '../helpers/settings'

function warn() {
  ui.notifications?.warn('Soon™')
}

// Make sure a folder exists, e.g. ['Locations', 'Sector 05']
async function ensureFolder(...path: string[]): Promise<Folder | undefined> {
  let parentFolder: Folder | undefined
  let directory: Folder[] | undefined = game.folders?.contents

  for (const name of path) {
    if (directory === undefined) {
      console.log('!!!')
      ui.notifications?.warn('Actor folders not found???')
      return
    }
    const existing = directory.find(x => x.name === name)
    if (existing) {
      parentFolder = existing
      directory = (existing as any).children
      continue
    }
    parentFolder = await Folder.create({ type: 'Actor', name, parent: parentFolder?.id })
    directory = (parentFolder as any).children
  }
  return parentFolder
}

function editSector() {
  const sceneId = game.user?.viewedScene
  if (sceneId) {
    new EditSectorDialog(sceneId).render(true)
  }
}

async function newLocation(subtype: string, name: string) {
  const parentFolder = await ensureFolder('Locations', game.scenes?.current?.name ?? '???')
  const loc = await IronswornActor.create({
    type: 'location',
    name,
    data: { subtype },
    token: {
      displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
      disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
      actorLink: true,
    },
    folder: parentFolder?.id,
  })
  // TODO: place it on the map
  loc?.sheet?.render(true)
}

function newPlanet() {
  newLocation('planet', 'New Planet')
}

function newStar() {
  newLocation('star', 'New Stellar Object')
}

function newSettlement() {
  newLocation('settlement', 'New Settlement')
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
        { name: 'star', icon: 'fas fa-star', title: game.i18n.localize('IRONSWORN.NewStar'), onClick: newStar },
        { name: 'planet', icon: 'fas fa-globe-europe', title: game.i18n.localize('IRONSWORN.NewPlanet'), onClick: newPlanet },
        { name: 'settlement', icon: 'fas fa-city', title: game.i18n.localize('IRONSWORN.NewSettlement'), onClick: newSettlement },
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

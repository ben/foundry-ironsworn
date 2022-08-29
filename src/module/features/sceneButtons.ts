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
      ui.notifications?.warn('Actor folders not found???')
      return
    }
    const existing = directory.find((x) => x.name === name)
    if (existing) {
      parentFolder = existing
      directory = (existing as any).children
      continue
    }
    parentFolder = await Folder.create({
      type: game.i18n.localize('Actor'),
      name,
      parent: parentFolder?.id,
    })
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

async function dropToken(location: IronswornActor) {
  if (!canvas?.scene || !canvas.stage || !canvas.grid) return

  // Calculate coordinates in the center of the viewport
  const { clientWidth, clientHeight } = document.documentElement
  const [cx, cy] = [clientWidth / 2, clientHeight / 2] // Center of viewport
  const t = canvas.stage.worldTransform
  const scale = canvas.stage.scale
  const [x, y] = [(cx - t.tx) / scale.x, (cy - t.ty) / scale.y]

  // Snap to viewport
  const td = await location.getTokenData({ x, y })
  const hw = canvas.grid.w / 2
  const hh = canvas.grid.h / 2
  const pos = canvas.grid.getSnappedPosition(
    td.x - td.width * hw,
    td.y - td.height * hh
  )
  td.update(pos)

  // TODO: avoid dropping this on top of another token

  // Create the token
  const cls = getDocumentClass('Token')
  await cls.create(td, { parent: canvas.scene })

  // Move the user back to the token layer
  canvas.tokens?.activate()
}

async function newLocation(subtype: string, name: string, scale = 1) {
  const parentFolder = await ensureFolder(
    'Locations',
    game.scenes?.current?.name ?? '???'
  )
  const loc = await IronswornActor.create({
    type: 'location',
    name,
    data: { subtype },
    token: {
      displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
      disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
      actorLink: true,
      scale,
    },
    folder: parentFolder?.id,
  })
  if (!loc) return

  await dropToken(loc)
  loc?.sheet?.render(true)
}

function newPlanet() {
  newLocation(
    'planet',
    game.i18n.format('DOCUMENT.Create', {
      type: game.i18n.localize(game.i18n.localize('IRONSWORN.DOCUMENT.Planet')),
    })
  )
}

function newStar() {
  newLocation(
    'star',
    game.i18n.format('DOCUMENT.Create', {
      type: game.i18n.localize('IRONSWORN.DOCUMENT.StellarObject'),
    })
  )
}

function newSettlement() {
  newLocation(
    'settlement',
    game.i18n.format('DOCUMENT.Create', {
      type: game.i18n.localize('IRONSWORN.DOCUMENT.Settlement'),
    }),
    2
  )
}

function newDerelict() {
  newLocation(
    'derelict',
    game.i18n.format('DOCUMENT.Create', {
      type: game.i18n.localize('IRONSWORN.DOCUMENT.Derelict'),
    }),
    2
  )
}

function newVault() {
  newLocation(
    'vault',
    game.i18n.format('DOCUMENT.Create', {
      type: game.i18n.localize(game.i18n.localize('IRONSWORN.DOCUMENT.Vault')),
    }),
    2
  )
}

export function activateSceneButtonListeners() {
  CONFIG.Canvas.layers['ironsworn'] = {
    layerClass: IronswornCanvasLayer,
    group: 'primary',
  }

  Hooks.on('getSceneControlButtons', (controls) => {
    if (!IronswornSettings.starforgedToolsEnabled) return
    console.log({ controls })
    if (!game.user?.isGM) {
      return controls
    }

    const sfControl: SceneControl = {
      name: 'Starforged',
      title: game.i18n.localize('IRONSWORN.TOOLS.STARFORGED.Label'),
      icon: 'isicon-logo-starforged-dk',
      layer: 'ironsworn',
      visible: true,
      activeTool: 'select',
      tools: [
        {
          name: 'edit',
          icon: 'isicon-region-sf',
          // TODO: more informative string - 'set region'?
          title: game.i18n.localize('Edit'),
          onClick: editSector,
        },
        {
          name: 'sector',
          icon: 'isicon-sector',
          title: game.i18n.format('DOCUMENT.Create', {
            type: game.i18n.localize('IRONSWORN.DOCUMENT.Sector'),
          }),
          onClick: warn,
        },
        {
          name: 'star',
          icon: 'isicon-stellar-object',
          title: game.i18n.format('DOCUMENT.Create', {
            type: game.i18n.localize('IRONSWORN.DOCUMENT.StellarObject'),
          }),
          onClick: newStar,
        },
        {
          name: 'planet',
          icon: 'isicon-world',
          title: game.i18n.format('DOCUMENT.Create', {
            type: game.i18n.localize('IRONSWORN.DOCUMENT.Planet'),
          }),
          onClick: newPlanet,
        },
        {
          name: 'settlement',
          icon: 'isicon-settlement-sf',
          title: game.i18n.format('DOCUMENT.Create', {
            type: game.i18n.localize('IRONSWORN.DOCUMENT.Settlement'),
          }),
          onClick: newSettlement,
        },
        {
          name: 'derelict',
          icon: 'isicon-derelict',
          title: game.i18n.format('DOCUMENT.Create', {
            type: game.i18n.localize('IRONSWORN.DOCUMENT.Derelict'),
          }),
          onClick: newDerelict,
        },
        {
          name: 'vault',
          icon: 'isicon-precursor-vault',
          title: game.i18n.format('DOCUMENT.Create', {
            type: game.i18n.localize('IRONSWORN.DOCUMENT.Vault'),
          }),
          onClick: newVault,
        },
      ],
    }

    controls.push(sfControl)
    return controls
  })
}

// In v9 we can inherit directly from CanvasLayer and it's fine
// In v10 we have to use InteractionLayer

let baseKlass = CanvasLayer
if (typeof InteractionLayer !== 'undefined') {
  baseKlass = InteractionLayer
}

class IronswornCanvasLayer extends baseKlass {
  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      zIndex: 180,
      name: 'ironsworn',
    })
  }
}

import { IronswornActor } from '../actor/actor'
import { OracleWindow } from '../applications/oracle-window'
import { EditSectorDialog } from '../applications/sf/editSectorApp'
import { IronswornSettings } from '../helpers/settings'

function warn() {
	ui.notifications?.warn('Soon™')
}

// Make sure a folder exists, e.g. ['Locations', 'Sector 05']
async function ensureFolder(...path: string[]): Promise<Folder | undefined> {
	let parentFolder: Folder | undefined
	let directory: Folder[] | undefined = game.folders?.filter(
		(x) => x.type === 'Actor'
	)

	for (const name of path) {
		if (directory === undefined) {
			ui.notifications?.warn('Actor folders not found???')
			return
		}
		const existing = directory.find((x) => x.name === name)
		if (existing != null) {
			parentFolder = existing
			directory = (existing as any).children.map((child) => {
				return child.folder /* v10 */ || child /* v9 */
			})
			continue
		}
		parentFolder = await Folder.create({
			type: 'Actor',
			name,
			parent: parentFolder?.id
		})
		directory = (parentFolder as any).children
	}
	return parentFolder
}

function editSector() {
	const sceneId = game.user?.viewedScene
	if (sceneId) {
		void new EditSectorDialog(sceneId).render(true)
	}
}

async function dropToken(location: IronswornActor) {
	if (canvas?.scene == null || canvas.stage == null || canvas.grid == null)
		return

	// Calculate coordinates in the center of the viewport
	const { clientWidth, clientHeight } = document.documentElement
	const [cx, cy] = [clientWidth / 2, clientHeight / 2] // Center of viewport
	const t = canvas.stage.worldTransform
	const scale = canvas.stage.scale
	const [x, y] = [(cx - t.tx) / scale.x, (cy - t.ty) / scale.y]

	// Snap to viewport
	// @ts-expect-error - missing type for v11-v12 method
	const td = await location.getTokenDocument({ x, y })
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

async function newLocation(subtype: string, i18nKey: string, scale = 1) {
	const name = game.i18n.format('DOCUMENT.New', {
		type: game.i18n.localize(`IRONSWORN.${i18nKey}`)
	})
	const parentFolder = await ensureFolder(
		'Locations',
		game.scenes?.current?.name ?? '???'
	)
	const loc = await IronswornActor.create({
		type: 'location',
		name,
		system: { subtype },
		prototypeToken: {
			displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
			disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
			actorLink: true,
			scale
		},
		folder: parentFolder?.id
	})
	if (loc == null) return

	await dropToken(loc)
	loc?.sheet?.render(true)
}

function newPlanet() {
	newLocation('planet', 'ACTOR.SubtypePlanet')
}

function newStar() {
	newLocation('star', 'ACTOR.SubtypeStar')
}

function newSettlement() {
	newLocation('settlement', 'ACTOR.SubtypeSettlement', 2)
}

function newDerelict() {
	newLocation('derelict', 'ACTOR.SubtypeDerelict', 2)
}

function newVault() {
	newLocation('vault', 'ACTOR.SubtypeVault', 2)
}

let ORACLE_WINDOW: OracleWindow | undefined
function theOracleWindow() {
	if (ORACLE_WINDOW == null) ORACLE_WINDOW = new OracleWindow()
	return ORACLE_WINDOW
}

export function activateSceneButtonListeners() {
	CONFIG.Canvas.layers.ironsworn = {
		layerClass: IronswornCanvasLayer,
		group: 'primary'
	}

	Hooks.on('getSceneControlButtons', (controls) => {
		const oracleButton: SceneControlTool = {
			name: 'Oracles',
			title: game.i18n.localize('IRONSWORN.ROLLTABLES.TypeOracle'),
			icon: 'isicon-oracle',
			visible: true,
			button: true,
			onClick: async () => await theOracleWindow().render(true, { focus: true })
		}
		controls[0].tools.push(oracleButton)

		if (IronswornSettings.starforgedToolsEnabled) {
			const sfControl: SceneControl = {
				name: 'Starforged',
				title: game.i18n.localize('IRONSWORN.StarforgedTools'),
				icon: 'isicon-logo-starforged-dk',
				layer: 'ironsworn',
				visible: true,
				activeTool: 'select',
				tools: [oracleButton]
			}

			if (game.user?.isGM) {
				sfControl.tools.push(
					{
						name: 'edit',
						icon: 'isicon-region-sf',
						title: game.i18n.format('DOCUMENT.Update', {
							type: game.i18n.localize('IRONSWORN.SCENE.TypeSector')
						}),
						onClick: editSector
					},
					// { // TODO: maybe reenable this when we have a good way of doing it
					//   name: 'sector',
					//   icon: 'isicon-sector',
					//   title: game.i18n.format('DOCUMENT.Create',{type: ('IRONSWORN.SCENE.TypeSector')}),
					//   onClick: warn,
					// },
					{
						name: 'star',
						icon: 'isicon-stellar-object',
						title: game.i18n.format('DOCUMENT.Create', {
							type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeStar')
						}),
						onClick: newStar
					},
					{
						name: 'planet',
						icon: 'isicon-world',
						title: game.i18n.format('DOCUMENT.Create', {
							type: game.i18n.localize('IRONSWORN.ACTOR.SubtypePlanet')
						}),
						onClick: newPlanet
					},
					{
						name: 'settlement',
						icon: 'isicon-settlement-sf',
						title: game.i18n.format('DOCUMENT.Create', {
							type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeSettlement')
						}),
						onClick: newSettlement
					},
					{
						name: 'derelict',
						icon: 'isicon-derelict',
						title: game.i18n.format('DOCUMENT.Create', {
							type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeDerelict')
						}),
						onClick: newDerelict
					},
					{
						name: 'vault',
						icon: 'isicon-precursor-vault',
						title: game.i18n.format('DOCUMENT.Create', {
							type: game.i18n.localize('IRONSWORN.ACTOR.SubtypeVault')
						}),
						onClick: newVault
					}
				)
			}

			controls.push(sfControl)
		} else {
			const isControl: SceneControl = {
				name: 'Ironsworn',
				title: game.i18n.localize('IRONSWORN.IronswornTools'),
				icon: 'isicon-logo-ironsworn-dk',
				layer: 'ironsworn',
				visible: true,
				activeTool: 'select',
				tools: [oracleButton]
			}

			controls.push(isControl)
		}

		return controls
	})
}

// In v9 we can inherit directly from CanvasLayer and it's fine
// In v10 we have to use InteractionLayer

let baseKlass: any = CanvasLayer
// @ts-expect-error
if (typeof InteractionLayer !== 'undefined') {
	// @ts-expect-error
	baseKlass = InteractionLayer
}

class IronswornCanvasLayer extends baseKlass {
	static get layerOptions() {
		return foundry.utils.mergeObject(super.layerOptions, {
			zIndex: 180,
			name: 'ironsworn'
		})
	}
}

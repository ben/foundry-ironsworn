import { OracleTable } from '../../roll-table/oracle-table'
import { IronswornTour } from './ironsworn_tour'

export class MoveSheetTour extends IronswornTour {
	constructor(sheet: Application) {
		const sheetSel = `.app[data-appid="${sheet?.appId}"]`

		const moveCategories = [
			'move_category:starforged/adventure',
			'move_category:ironsworn/adventure'
		]
		const moveCategorySelector = moveCategories
			.map((id) => `${sheetSel} [data-tourid="move-category-${id}"]`)
			.join(',')
		const moveLinkSelector = moveCategories
			.map(
				(id) => `${sheetSel} [data-tourid="move-category-${id}"] .content-link`
			)
			.join(',')

		const isMoveUuid =
			'Compendium.foundry-ironsworn.ironswornmoves.Item.c8bacc17f73d3103'
		const sfMoveUuid =
			'Compendium.foundry-ironsworn.starforgedmoves.Item.e6ed148eff82c171'
		const moveButtonsSelector = [sfMoveUuid, isMoveUuid]
			.map(
				(u) =>
					`${sheetSel} [data-move-uuid="${u}"] [data-tourid="move-buttons"]`
			)
			.join(',')

		const oracleCategorySelector = [
			'oracle_collection:starforged/core',
			'oracle_collection:classic/action_and_theme'
		]
			.map((dsid) => `${sheetSel} [data-tourid="oracle-${dsid}"]`)
			.join(',')

		const oracleRowSelector = [
			'oracle_rollable:starforged/core/action',
			'oracle_rollable:classic/action_and_theme/action'
		]
			.map((dsid) => `${sheetSel} [data-tourid="oracle-${dsid}"]`)
			.join(',')

		const scrollIntoView = async (selector) => {
			document.querySelector(selector)?.scrollIntoView()
			await new Promise((r) => setTimeout(r, 400))
		}

		super({
			title: 'IRONSWORN.Tours.MoveSheet.Title',
			description: 'IRONSWORN.Tours.MoveSheet.Description',
			canBeResumed: false,
			steps: [
				{
					id: 'sheet',
					title: 'IRONSWORN.Tours.MoveSheet.SheetTitle',
					content: 'IRONSWORN.Tours.MoveSheet.SheetContent',
					tooltipDirection: 'LEFT',
					hook: () => {
						sheet.activateTab('moves')
					},
					selector: `${sheetSel} [data-tourid="sheet"]`
				},
				{
					id: 'move-category',
					title: 'IRONSWORN.Tours.MoveSheet.MoveCategoryTitle',
					content: 'IRONSWORN.Tours.MoveSheet.MoveCategoryContent',
					tooltipDirection: 'LEFT',
					selector: moveCategorySelector,
					async hook() {
						CONFIG.IRONSWORN.emitter.emit('highlightMove', isMoveUuid)
						CONFIG.IRONSWORN.emitter.emit('highlightMove', sfMoveUuid)
						await new Promise((r) => setTimeout(r, 300))
						await scrollIntoView(moveCategorySelector)
					}
				},
				{
					id: 'move-buttons',
					title: 'IRONSWORN.Tours.MoveSheet.MoveButtonsTitle',
					content: 'IRONSWORN.Tours.MoveSheet.MoveButtonsContent',
					tooltipDirection: 'LEFT',
					selector: moveButtonsSelector,
					hook: async () => {
						await scrollIntoView(moveButtonsSelector)
					}
				},
				{
					id: 'move-link',
					title: 'IRONSWORN.Tours.MoveSheet.MoveLinkTitle',
					content: 'IRONSWORN.Tours.MoveSheet.MoveLinkContent',
					tooltipDirection: 'LEFT',
					selector: moveLinkSelector,
					hook: async () => {
						await scrollIntoView(moveLinkSelector)
					}
				},
				{
					id: 'oracles-tab',
					title: 'IRONSWORN.Tours.MoveSheet.OraclesTabTitle',
					content: 'IRONSWORN.Tours.MoveSheet.OraclesTabContent',
					tooltipDirection: 'LEFT',
					async hook() {
						sheet.activateTab('oracles')
					},
					selector: `${sheetSel} [data-tourid="sheet"]`
				},
				{
					id: 'oracle-category',
					title: 'IRONSWORN.Tours.MoveSheet.OracleCategoryTitle',
					content: 'IRONSWORN.Tours.MoveSheet.OracleCategoryContent',
					tooltipDirection: 'LEFT',
					selector: oracleCategorySelector,
					async hook() {
						CONFIG.IRONSWORN.emitter.emit(
							'highlightOracle',
							'oracle_rollable:classic/action_and_theme'
						)
						CONFIG.IRONSWORN.emitter.emit(
							'highlightOracle',
							'oracle_rollable:starforged/core'
						)
						await scrollIntoView(oracleCategorySelector)
					}
				},
				{
					id: 'oracle-row',
					title: 'IRONSWORN.Tours.MoveSheet.OracleRowTitle',
					content: 'IRONSWORN.Tours.MoveSheet.OracleRowContent',
					tooltipDirection: 'LEFT',
					selector: oracleRowSelector
				},
				{
					id: 'oracle-chat-message',
					title: 'IRONSWORN.Tours.MoveSheet.OracleChatMessageTitle',
					content: 'IRONSWORN.Tours.MoveSheet.OracleChatMessageContent',
					sidebarTab: 'chat',
					selector: `#chat .chat-message:last-of-type`,
					tooltipDirection: 'LEFT',
					async hook() {
						await sheet.minimize()
						await OracleTable.ask('oracle_rollable:starforged/core/action')
						await new Promise((r) => setTimeout(r, 300))
					}
				},
				{
					id: 'fin',
					title: 'IRONSWORN.Tours.MoveSheet.EndTitle',
					content: 'IRONSWORN.Tours.MoveSheet.EndContent',
					tooltipDirection: 'LEFT',
					async hook() {
						await sheet.maximize()
						await new Promise((r) => setTimeout(r, 100))
						sheet.activateTab('moves')
					},
					selector: `${sheetSel} [data-tourid="sheet"]`
				}
			]
		})
	}
}

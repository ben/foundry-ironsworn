import { IronswornSettings } from '../../helpers/settings'
import { OracleTable } from '../../roll-table/oracle-table'
import { IronswornTour } from './ironsworn_tour'

export class MoveSheetTour extends IronswornTour {
	constructor(sheet: Application) {
		const sheetSel = `.app[data-appid="${sheet?.appId}"]`

		// If multiple rulesets are enabled, prioritize Ironsworn because those items will be nearer the top
		const preferIronsworn =
			IronswornSettings.enabledRulesets.includes('classic')

		const moveCategory = preferIronsworn
			? 'move_category:classic/adventure'
			: 'move_category:starforged/adventure'
		const moveCategorySelector = `${sheetSel} [data-tourid="move-category-${moveCategory}"]`
		const moveLinkSelector = `${sheetSel} [data-tourid="move-category-${moveCategory}"] .content-link`

		const moveUuid = preferIronsworn
			? 'Compendium.foundry-ironsworn.ironswornmoves.Item.c8bacc17f73d3103'
			: 'Compendium.foundry-ironsworn.starforgedmoves.Item.e6ed148eff82c171'
		const moveButtonsSelector = `${sheetSel} [data-move-uuid="${moveUuid}"] [data-tourid="move-buttons"]`

		const oracleCategory = preferIronsworn
			? 'oracle_collection:classic/action_and_theme'
			: 'oracle_collection:starforged/core'
		const oracleCategorySelector = `${sheetSel} [data-tourid="oracle-${oracleCategory}"]`

		const oracleRow = preferIronsworn
			? 'oracle_rollable:classic/action_and_theme/action'
			: 'oracle_rollable:starforged/core/action'
		const oracleRowSelector = `${sheetSel} [data-tourid="oracle-${oracleRow}"]`

		const scrollIntoView = async (selector) => {
			const el = document.querySelector(selector)
			console.log(`Scrolling to ${selector}`, el)
			el?.scrollIntoView()
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
						CONFIG.IRONSWORN.emitter.emit('highlightMove', moveUuid)
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
							preferIronsworn
								? 'oracle_rollable:classic/action_and_theme'
								: 'oracle_rollable:starforged/core'
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
						await OracleTable.ask(
							preferIronsworn
								? 'oracle_rollable:classic/core/action'
								: 'oracle_rollable:starforged/core/action'
						)
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

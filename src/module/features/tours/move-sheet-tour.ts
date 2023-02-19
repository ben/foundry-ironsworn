import { IronswornTour } from './ironsworn_tour'

export class MoveSheetTour extends IronswornTour {
  constructor(sheet: Application) {
    const sheetSel = `.app[data-appid="${sheet?.appId}"]`

    const moveCategories = [
      'Starforged/Moves/Adventure',
      'Ironsworn/Moves/Adventure',
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
      'Compendium.foundry-ironsworn.ironswornmoves.c8bacc17f73d3103'
    const sfMoveUuid =
      'Compendium.foundry-ironsworn.starforgedmoves.e6ed148eff82c171'
    const moveButtonsSelector = [sfMoveUuid, isMoveUuid]
      .map(
        (u) =>
          `${sheetSel} [data-move-uuid="${u}"] [data-tourid="move-buttons"]`
      )
      .join(',')

    const oracleCategorySelector = [
      'Starforged/Oracles/Core',
      'Ironsworn/Oracles/Action_and_Theme',
    ]
      .map((dfid) => `${sheetSel} [data-tourid="oracle-${dfid}"]`)
      .join(',')

    const oracleRowSelector = [
      'Starforged/Oracles/Core/Action',
      'Ironsworn/Oracles/Action_and_Theme/Action',
    ]
      .map((dfid) => `${sheetSel} [data-tourid="oracle-${dfid}"]`)
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
          hook: () => sheet.activateTab('moves'),
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'move-category',
          title: 'IRONSWORN.Tours.MoveSheet.MoveCategoryTitle',
          content: 'IRONSWORN.Tours.MoveSheet.MoveCategoryContent',
          selector: moveCategorySelector,
          async hook() {
            CONFIG.IRONSWORN.emitter.emit('highlightMove', isMoveUuid)
            CONFIG.IRONSWORN.emitter.emit('highlightMove', sfMoveUuid)
            await new Promise((r) => setTimeout(r, 300))
            await scrollIntoView(moveCategorySelector)
          },
        },
        {
          id: 'move-buttons',
          title: 'IRONSWORN.Tours.MoveSheet.MoveButtonsTitle',
          content: 'IRONSWORN.Tours.MoveSheet.MoveButtonsContent',
          tooltipDirection: 'LEFT',
          selector: moveButtonsSelector,
          hook: () => scrollIntoView(moveButtonsSelector),
        },
        {
          id: 'move-link',
          title: 'IRONSWORN.Tours.MoveSheet.MoveLinkTitle',
          content: 'IRONSWORN.Tours.MoveSheet.MoveLinkContent',
          selector: moveLinkSelector,
          hook: () => scrollIntoView(moveLinkSelector),
        },
        {
          id: 'oracles-tab',
          title: 'IRONSWORN.Tours.MoveSheet.OraclesTabTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OraclesTabContent',
          async hook() {
            sheet.activateTab('oracles')
          },
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'oracle-category',
          title: 'IRONSWORN.Tours.MoveSheet.OracleCategoryTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OracleCategoryContent',
          selector: oracleCategorySelector,
          async hook() {
            CONFIG.IRONSWORN.emitter.emit(
              'highlightOracle',
              'Ironsworn/Oracles/Action_and_Theme'
            )
            CONFIG.IRONSWORN.emitter.emit(
              'highlightOracle',
              'Starforged/Oracles/Core'
            )
            await scrollIntoView(oracleCategorySelector)
          },
        },
        {
          id: 'oracle-row',
          title: 'IRONSWORN.Tours.MoveSheet.OracleRowTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OracleRowContent',
          selector: oracleRowSelector,
          hook: () => scrollIntoView(oracleRowSelector),
        },
        {
          id: 'oracle-chat-message',
          title: 'IRONSWORN.Tours.MoveSheet.OracleChatMessageTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OracleChatMessageContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
          async hook() {
            // TODO: create ORM for this oracle
            // TODO: selector for the message
          },
        },
        {
          id: 'fin',
          title: 'IRONSWORN.Tours.MoveSheet.EndTitle',
          content: 'IRONSWORN.Tours.MoveSheet.EndContent',
          async hook() {
            sheet.activateTab('moves')
          },
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
      ],
    })
  }
}

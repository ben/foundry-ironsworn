import { IronswornTour } from './ironsworn_tour'

export class MoveSheetTour extends IronswornTour {
  constructor(sheet: Application) {
    const sheetSel = `.app[data-appid="${sheet?.appId}"]`

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
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'move-buttons',
          title: 'IRONSWORN.Tours.MoveSheet.MoveButtonsTitle',
          content: 'IRONSWORN.Tours.MoveSheet.MoveButtonsContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'move-link',
          title: 'IRONSWORN.Tours.MoveSheet.MoveLinkTitle',
          content: 'IRONSWORN.Tours.MoveSheet.MoveLinkContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'oracles-tab',
          title: 'IRONSWORN.Tours.MoveSheet.OraclesTabTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OraclesTabContent',
          hook: () => sheet.activateTab('oracles'),
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'oracle-category',
          title: 'IRONSWORN.Tours.MoveSheet.OracleCategoryTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OracleCategoryContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'oracle-row',
          title: 'IRONSWORN.Tours.MoveSheet.OracleRowTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OracleRowContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'oracle-chat-message',
          title: 'IRONSWORN.Tours.MoveSheet.OracleChatMessageTitle',
          content: 'IRONSWORN.Tours.MoveSheet.OracleChatMessageContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'fin',
          title: 'IRONSWORN.Tours.MoveSheet.EndTitle',
          content: 'IRONSWORN.Tours.MoveSheet.EndContent',
          hook: () => sheet.activateTab('moves'),
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
      ],
    })
  }
}

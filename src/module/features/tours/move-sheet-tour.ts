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
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
      ],
    })
  }
}

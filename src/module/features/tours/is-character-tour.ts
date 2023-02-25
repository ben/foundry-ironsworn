import { IronswornActor } from '../../actor/actor'
import { StarforgedCharacterSheet } from '../../actor/sheets/sf-charactersheet'
import { IronswornTour } from './ironsworn_tour'

export class ISCharacterTour extends IronswornTour {
  constructor(actor: IronswornActor) {
    const sheet = actor.sheet as StarforgedCharacterSheet
    const sheetSel = `.app[data-appid="${sheet?.appId}"]`

    super({
      title: 'IRONSWORN.Tours.SFCharacter.Title',
      description: 'IRONSWORN.Tours.SFCharacter.Description',
      canBeResumed: false,
      steps: [
        {
          id: 'sheet',
          title: 'IRONSWORN.Tours.SFCharacter.SheetTitle',
          content: 'IRONSWORN.Tours.SFCharacter.SheetContent',
          selector: `${sheetSel} [data-tourid="sheet"]`,
        },
        {
          id: 'edit-button',
          title: 'IRONSWORN.Tours.SFCharacter.EditButtonTitle',
          content: 'IRONSWORN.Tours.SFCharacter.EditButtonContent',
          selector: `${sheetSel} .ironsworn-toggle-edit-mode`,
        },
        {
          id: 'stats',
          title: 'IRONSWORN.Tours.SFCharacter.StatsTitle',
          content: 'IRONSWORN.Tours.SFCharacter.StatsContent',
          selector: `${sheetSel} [data-tourid="stats"]`,
        },
        {
          id: 'resources',
          title: 'IRONSWORN.Tours.SFCharacter.ResourcesTitle',
          content: 'IRONSWORN.Tours.SFCharacter.ResourcesContent',
          selector: `${sheetSel} [data-tourid="resources"]`,
        },
        {
          id: 'momentum',
          title: 'IRONSWORN.Tours.SFCharacter.MomentumTitle',
          content: 'IRONSWORN.Tours.SFCharacter.MomentumContent',
          selector: `${sheetSel} [data-tourid="momentum"]`,
        },
        {
          id: 'conditions',
          title: 'IRONSWORN.Tours.SFCharacter.ConditionsTitle',
          content: 'IRONSWORN.Tours.SFCharacter.ConditionsContent',
          selector: `${sheetSel} [data-tourid="conditions"]`,
        },
        {
          id: 'charactertab',
          title: 'IRONSWORN.Tours.SFCharacter.CharacterTabTitle',
          content: 'IRONSWORN.Tours.SFCharacter.CharacterTabContent',
          hook: () => sheet.activateTab('character'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          id: 'bonds',
          title: 'IRONSWORN.Tours.SFCharacter.BondsTitle',
          content: 'IRONSWORN.Tours.SFCharacter.BondsContent',
          selector: `${sheetSel} [data-tourid="bonds"]`,
        },
        {
          id: 'assets',
          title: 'IRONSWORN.Tours.SFCharacter.AssetsTitle',
          content: 'IRONSWORN.Tours.SFCharacter.AssetsContent',
          selector: `${sheetSel} [data-tourid="assets"]`,
        },
        {
          id: 'progress',
          title: 'IRONSWORN.Tours.SFCharacter.ProgressTabTitle',
          content: 'IRONSWORN.Tours.SFCharacter.ProgressTabContent',
          selector: `${sheetSel} [data-tourid="progress"]`,
        },
        {
          id: 'notes',
          title: 'IRONSWORN.Tours.SFCharacter.NotesTabTitle',
          content: 'IRONSWORN.Tours.SFCharacter.NotesTabContent',
          hook: () => sheet.activateTab('notes'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          id: 'fin',
          title: 'IRONSWORN.Tours.SFCharacter.EndTitle',
          content: 'IRONSWORN.Tours.SFCharacter.EndContent',
          selector: sheetSel,
        },
      ],
    })
  }
}

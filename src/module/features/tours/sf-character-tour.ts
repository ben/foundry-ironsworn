import { nextTick } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { IronswornTour } from './ironsworn_tour'

export class SFCharacterTour extends IronswornTour {
  constructor(actor: IronswornActor) {
    const sheet = actor.sheet
    const sheetSel = `.app[data-appid="${sheet?.appId}"]`

    const pickTab = (tabKey: string) => async () => {
      sheet?.element?.find(`[data-tab-key="${tabKey}"]`)?.trigger('click')
      await nextTick()
    }

    super({
      title: 'IRONSWORN.Tours.SFCharacter.Title',
      description: 'IRONSWORN.Tours.SFCharacter.Description',
      canBeResumed: false,
      steps: [
        {
          id: 'sheet',
          title: 'IRONSWORN.Tours.SFCharacterTour.SheetTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.SheetContent',
          selector: sheetSel,
        },
        {
          id: 'edit-button',
          title: 'IRONSWORN.Tours.SFCharacterTour.EditButtonTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.EditButtonContent',
          selector: `${sheetSel} .ironsworn-toggle-edit-mode`,
        },
        {
          id: 'stats',
          title: 'IRONSWORN.Tours.SFCharacterTour.StatsTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.StatsContent',
          selector: `${sheetSel} [data-tourid="stats"]`,
        },
        {
          id: 'resources',
          title: 'IRONSWORN.Tours.SFCharacterTour.ResourcesTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.ResourcesContent',
          selector: `${sheetSel} [data-tourid="resources"]`,
        },
        {
          id: 'momentum',
          title: 'IRONSWORN.Tours.SFCharacterTour.MomentumTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.MomentumContent',
          selector: `${sheetSel} [data-tourid="momentum"]`,
        },
        {
          id: 'impacts',
          title: 'IRONSWORN.Tours.SFCharacterTour.ImpactsTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.ImpactsContent',
          selector: `${sheetSel} [data-tourid="impacts"]`,
        },
        {
          id: 'legacies',
          title: 'IRONSWORN.Tours.SFCharacterTour.LegaciesTabTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.LegaciesTabContent',
          hook: pickTab('legacies'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          id: 'assets',
          title: 'IRONSWORN.Tours.SFCharacterTour.AssetsTabTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.AssetsTabContent',
          hook: pickTab('assets'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          // TODO: asset browser
          id: 'asset-browser',
          title: 'IRONSWORN.Tours.SFCharacterTour.AssetBrowserTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.AssetBrowserContent',
          selector: `???`,
        },
        {
          id: 'progress',
          title: 'IRONSWORN.Tours.SFCharacterTour.ProgressTabTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.ProgressTabContent',
          hook: pickTab('progress'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          id: 'connections',
          title: 'IRONSWORN.Tours.SFCharacterTour.ConnectionsTabTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.ConnectionsTabContent',
          hook: pickTab('connections'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          id: 'notes',
          title: 'IRONSWORN.Tours.SFCharacterTour.NotesTabTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.NotesTabContent',
          hook: pickTab('notes'),
          selector: `${sheetSel} [data-tourid="tabs"]`,
        },
        {
          id: 'fin',
          title: 'IRONSWORN.Tours.SFCharacterTour.EndTitle',
          content: 'IRONSWORN.Tours.SFCharacterTour.EndContent',
          selector: sheetSel,
        },
      ],
    })
  }
}

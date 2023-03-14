import type { IronswornActor } from '../../actor/actor'
import type { StarforgedCharacterSheet } from '../../actor/sheets/sf-charactersheet'
import { IronswornTour } from './ironsworn_tour'

export class SFCharacterTour extends IronswornTour {
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
					selector: `${sheetSel} [data-tourid="sheet"]`
				},
				{
					id: 'edit-button',
					title: 'IRONSWORN.Tours.SFCharacter.EditButtonTitle',
					content: 'IRONSWORN.Tours.SFCharacter.EditButtonContent',
					selector: `${sheetSel} .ironsworn-toggle-edit-mode`
				},
				{
					id: 'stats',
					title: 'IRONSWORN.Tours.SFCharacter.StatsTitle',
					content: 'IRONSWORN.Tours.SFCharacter.StatsContent',
					selector: `${sheetSel} [data-tourid="stats"]`
				},
				{
					id: 'resources',
					title: 'IRONSWORN.Tours.SFCharacter.ResourcesTitle',
					content: 'IRONSWORN.Tours.SFCharacter.ResourcesContent',
					selector: `${sheetSel} [data-tourid="resources"]`
				},
				{
					id: 'momentum',
					title: 'IRONSWORN.Tours.SFCharacter.MomentumTitle',
					content: 'IRONSWORN.Tours.SFCharacter.MomentumContent',
					selector: `${sheetSel} [data-tourid="momentum"]`
				},
				{
					id: 'impacts',
					title: 'IRONSWORN.Tours.SFCharacter.ImpactsTitle',
					content: 'IRONSWORN.Tours.SFCharacter.ImpactsContent',
					selector: `${sheetSel} [data-tourid="impacts"]`
				},
				{
					id: 'legacies',
					title: 'IRONSWORN.Tours.SFCharacter.LegaciesTabTitle',
					content: 'IRONSWORN.Tours.SFCharacter.LegaciesTabContent',
					hook: () => {
						sheet.activateTab('legacies')
					},
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'assets',
					title: 'IRONSWORN.Tours.SFCharacter.AssetsTabTitle',
					content: 'IRONSWORN.Tours.SFCharacter.AssetsTabContent',
					hook: () => {
						sheet.activateTab('assets')
					},
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'progress',
					title: 'IRONSWORN.Tours.SFCharacter.ProgressTabTitle',
					content: 'IRONSWORN.Tours.SFCharacter.ProgressTabContent',
					hook: () => {
						sheet.activateTab('progress')
					},
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'connections',
					title: 'IRONSWORN.Tours.SFCharacter.ConnectionsTabTitle',
					content: 'IRONSWORN.Tours.SFCharacter.ConnectionsTabContent',
					hook: () => {
						sheet.activateTab('connections')
					},
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'notes',
					title: 'IRONSWORN.Tours.SFCharacter.NotesTabTitle',
					content: 'IRONSWORN.Tours.SFCharacter.NotesTabContent',
					hook: () => {
						sheet.activateTab('notes')
					},
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'fin',
					title: 'IRONSWORN.Tours.SFCharacter.EndTitle',
					content: 'IRONSWORN.Tours.SFCharacter.EndContent',
					selector: sheetSel
				}
			]
		})
	}
}

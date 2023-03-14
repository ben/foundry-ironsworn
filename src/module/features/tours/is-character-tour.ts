import type { IronswornActor } from '../../actor/actor'
import type { StarforgedCharacterSheet } from '../../actor/sheets/sf-charactersheet'
import { IronswornTour } from './ironsworn_tour'

export class ISCharacterTour extends IronswornTour {
	constructor(actor: IronswornActor) {
		const sheet = actor.sheet as StarforgedCharacterSheet
		const sheetSel = `.app[data-appid="${sheet?.appId}"]`

		super({
			title: 'IRONSWORN.Tours.ISCharacter.Title',
			description: 'IRONSWORN.Tours.ISCharacter.Description',
			canBeResumed: false,
			steps: [
				{
					id: 'sheet',
					title: 'IRONSWORN.Tours.ISCharacter.SheetTitle',
					content: 'IRONSWORN.Tours.ISCharacter.SheetContent',
					selector: `${sheetSel} [data-tourid="sheet"]`
				},
				{
					id: 'edit-button',
					title: 'IRONSWORN.Tours.ISCharacter.EditButtonTitle',
					content: 'IRONSWORN.Tours.ISCharacter.EditButtonContent',
					selector: `${sheetSel} .ironsworn-toggle-edit-mode`
				},
				{
					id: 'stats',
					title: 'IRONSWORN.Tours.ISCharacter.StatsTitle',
					content: 'IRONSWORN.Tours.ISCharacter.StatsContent',
					selector: `${sheetSel} [data-tourid="stats"]`,
					tooltipDirection: 'DOWN'
				},
				{
					id: 'resources',
					title: 'IRONSWORN.Tours.ISCharacter.ResourcesTitle',
					content: 'IRONSWORN.Tours.ISCharacter.ResourcesContent',
					selector: `${sheetSel} [data-tourid="resources"]`,
					tooltipDirection: 'LEFT'
				},
				{
					id: 'momentum',
					title: 'IRONSWORN.Tours.ISCharacter.MomentumTitle',
					content: 'IRONSWORN.Tours.ISCharacter.MomentumContent',
					selector: `${sheetSel} [data-tourid="momentum"]`,
					tooltipDirection: 'RIGHT'
				},
				{
					id: 'conditions',
					title: 'IRONSWORN.Tours.ISCharacter.ConditionsTitle',
					content: 'IRONSWORN.Tours.ISCharacter.ConditionsContent',
					selector: `${sheetSel} [data-tourid="conditions"]`,
					tooltipDirection: 'UP'
				},
				{
					id: 'charactertab',
					title: 'IRONSWORN.Tours.ISCharacter.CharacterTabTitle',
					content: 'IRONSWORN.Tours.ISCharacter.CharacterTabContent',
					hook: () => { sheet.activateTab('character'); },
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'bonds',
					title: 'IRONSWORN.Tours.ISCharacter.BondsTitle',
					content: 'IRONSWORN.Tours.ISCharacter.BondsContent',
					selector: `${sheetSel} [data-tourid="bonds"]`
				},
				{
					id: 'assets',
					title: 'IRONSWORN.Tours.ISCharacter.AssetsTitle',
					content: 'IRONSWORN.Tours.ISCharacter.AssetsContent',
					selector: `${sheetSel} [data-tourid="assets"]`,
					tooltipDirection: 'RIGHT'
				},
				{
					id: 'progress',
					title: 'IRONSWORN.Tours.ISCharacter.ProgressTitle',
					content: 'IRONSWORN.Tours.ISCharacter.ProgressContent',
					selector: `${sheetSel} [data-tourid="progress"]`,
					tooltipDirection: 'LEFT'
				},
				{
					id: 'notes',
					title: 'IRONSWORN.Tours.ISCharacter.NotesTabTitle',
					content: 'IRONSWORN.Tours.ISCharacter.NotesTabContent',
					hook: () => { sheet.activateTab('notes'); },
					selector: `${sheetSel} [data-tourid="tabs"]`
				},
				{
					id: 'fin',
					title: 'IRONSWORN.Tours.ISCharacter.EndTitle',
					content: 'IRONSWORN.Tours.ISCharacter.EndContent',
					selector: sheetSel
				}
			]
		})
	}
}

import { compact } from 'lodash-es'
import { CreateActorDialog } from '../../applications/createActorDialog'
import { IronswornTour } from './ironsworn_tour'

export class WelcomeTour extends IronswornTour {
	createActorDialog: CreateActorDialog | undefined

	constructor() {
		super({
			title: 'IRONSWORN.Tours.Welcome.Title',
			description: 'IRONSWORN.Tours.Welcome.Description',
			canBeResumed: false,
			display: true,
			steps: []
		})
	}

	get steps(): TourStep[] {
		return compact([
			{
				id: 'welcome',
				title: 'IRONSWORN.Tours.Welcome.WelcomeTitle',
				content: 'IRONSWORN.Tours.Welcome.WelcomeContent'
			},
			{
				id: 'character-tab',
				title: 'IRONSWORN.Tours.Welcome.ActorTabTitle',
				content: 'IRONSWORN.Tours.Welcome.ActorTabContent',
				sidebarTab: 'actors',
				selector: '#actors .create-document'
			},
			{
				id: 'character-create',
				title: 'IRONSWORN.Tours.Welcome.CharacterCreateTitle',
				content: 'IRONSWORN.Tours.Welcome.CharacterCreateContent',
				hook: async () => {
					this.createActorDialog = new CreateActorDialog()
					await this.createActorDialog.render(true)
					await new Promise((r) => setTimeout(r, 100))
				},
				selector: '#new-actor-dialog #new-character'
			},
			{
				id: 'compendia',
				title: 'IRONSWORN.Tours.Welcome.CompendiumTitle',
				content: 'IRONSWORN.Tours.Welcome.CompendiumContent',
				hook: async () => await this.createActorDialog?.close(),
				sidebarTab: 'compendium',
				selector: 'li[data-pack="foundry-ironsworn.ironswornscenes"]'
			},
			game.user?.viewedScene && {
				id: 'oracletool',
				title: 'IRONSWORN.Tours.Welcome.OracleToolTitle',
				content: 'IRONSWORN.Tours.Welcome.OracleToolContent',
				layer: 'tokens',
				selector: '[data-tool="Oracles"]'
			},
			{
				id: 'tours',
				title: 'IRONSWORN.Tours.Welcome.ToursTitle',
				content: 'IRONSWORN.Tours.Welcome.ToursContent',
				sidebarTab: 'settings',
				selector: 'button[data-action="tours"]'
			}
		])
	}
}

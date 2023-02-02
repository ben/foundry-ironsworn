import { IronswornTour } from './ironsworn_tour'

export class WelcomeTour extends IronswornTour {
  constructor() {
    super({
      title: 'IRONSWORN.Tours.Welcome.Title',
      description: 'IRONSWORN.Tours.Welcome.Description',
      canBeResumed: false,
      display: true,
      steps: [
        {
          id: 'welcome',
          title: 'IRONSWORN.Tours.Welcome.WelcomeTitle',
          content: 'IRONSWORN.Tours.Welcome.WelcomeContent',
        },
        {
          id: 'character-tab',
          title: 'IRONSWORN.Tours.Welcome.ActorTabTitle',
          content: 'IRONSWORN.Tours.Welcome.ActorTabContent',
          sidebarTab: 'actors',
          selector: '#actors .create-document',
        },
      ],
    })
  }
}

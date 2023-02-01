export class WelcomeTour extends Tour {
  constructor() {
    super({
      title: 'IRONSWORN.Tours.Welcome.Title',
      description: 'IRONSWORN.Tours.Welcome.Description',
      canBeResumed: false,
      display: true,
      steps: [
        {
          id: 'welcome',
          selector: '',
          title: 'IRONSWORN.Tours.Welcome.WelcomeTitle',
          content: 'IRONSWORN.Tours.Welcome.WelcomeContent',
        },
      ],
    })
  }
}

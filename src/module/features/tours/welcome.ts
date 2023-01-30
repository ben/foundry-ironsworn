export class WelcomeTour extends Tour {
  constructor() {
    super({
      title: 'Welcome to Ironsworn',
      description: 'Overview of Ironsworn & Starforged system',
      canBeResumed: false,
      display: true,
      steps: [],
    })
  }
}

// Make Typescript happy with tour extensions
declare global {
  interface TourStep {
    sidebarTab?: string
  }
}

export class IronswornTour extends Tour {
  /** @override */
  protected async _preStep(): Promise<void> {
    await super._preStep()

    if (this.currentStep?.sidebarTab) {
      ui.sidebar?.activateTab(this.currentStep.sidebarTab)
    }
  }
}

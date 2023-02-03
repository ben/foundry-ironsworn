// Make Typescript happy with tour extensions
declare global {
  interface TourStep {
    sidebarTab?: string
    layer?: string
    tool?: string
    hook?: () => Promise<unknown>
  }
}

export class IronswornTour extends Tour {
  /** @override */
  protected async _preStep(): Promise<void> {
    await super._preStep()

    if (this.currentStep?.sidebarTab) {
      await ui.sidebar?.activateTab(this.currentStep.sidebarTab)
    }

    if (this.currentStep?.layer) {
      const layer = canvas?.[this.currentStep.layer]
      if (layer.active && this.currentStep.tool)
        ui.controls?.initialize({ tool: this.currentStep.tool })
      else layer.activate({ tool: this.currentStep.tool })
    }

    if (this.currentStep?.hook) {
      await this.currentStep.hook()
    }
  }
}

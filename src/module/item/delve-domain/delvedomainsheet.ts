import { IronswornItemSheet } from "../item-sheet";
import { DelveDomainDataSource } from "../itemtypes";

export class DelveDomainSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
    })
  }

  get themeData(): DelveDomainDataSource {
    return this.item.data as DelveDomainDataSource
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)
    // TODO
  }
}

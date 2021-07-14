import { IronswornItemSheet } from "../item-sheet";
import { DelveThemeDataSource } from "../itemtypes";

export class DelveThemeSheet extends IronswornItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      height: 650,
    })
  }

  get themeData(): DelveThemeDataSource {
    return this.item.data as DelveThemeDataSource
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html)
    // TODO
  }
}

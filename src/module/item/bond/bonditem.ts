import { IronswornCharacterSheet } from "../../actor/sheets/charactersheet";
import { BaseItem } from "../baseitem";

export class BondItem extends BaseItem {
  static entityName = 'bond'

  static activateActorSheetListeners(html: JQuery, sheet: IronswornCharacterSheet) {
    super.activateActorSheetListeners(html, sheet)
  }
}

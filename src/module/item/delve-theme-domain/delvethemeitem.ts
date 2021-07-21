import { IronswornCharacterSheet } from '../../actor/sheets/charactersheet'
import { BaseItem } from '../baseitem'

export class DelveThemeItem extends BaseItem {
  static entityName = 'delve-theme'

  static activateActorSheetListeners(html: JQuery, sheet: IronswornCharacterSheet) {
    super.activateActorSheetListeners(html, sheet)

    // TODO?
  }
}

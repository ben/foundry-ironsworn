import { IronswornCharacterSheet } from '../../actor/sheets/charactersheet'
import { BaseItem } from '../baseitem'

export class DelveDomainItem extends BaseItem {
  static entityName = 'delve-domain'

  static activateActorSheetListeners(
    html: JQuery,
    sheet: IronswornCharacterSheet
  ) {
    super.activateActorSheetListeners(html, sheet)

    // TODO?
  }
}

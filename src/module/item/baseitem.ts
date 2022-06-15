import { capitalize } from '../helpers/util'

export abstract class BaseItem {
  static entityName = ''

  /**
   * Allows each item to prepare its data before its rendered.
   * This can be used to add additional information right before rendering.
   */
  static prepareItemData(itemData, _itemEntity) {
    return itemData
  }

  /**
   * Allows every item to register its own listeners for rendered actor sheets.
   * Implements base listeners for adding, configuring and deleting embedded items.
   */
  static activateActorSheetListeners(html, sheet) {
    if (!this.entityName) {
      throw new Error(
        'A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.'
      )
    }

    // Default listeners for adding, configuring and deleting embedded items
    html
      .find(`.ironsworn__${this.entityName}__add`)
      .click((e) => this._onItemAdd.call(this, e, sheet))
    html
      .find(`.ironsworn__${this.entityName}__settings`)
      .click((e) => this._onItemSettings.call(this, e, sheet))
    html
      .find(`.ironsworn__${this.entityName}__delete`)
      .click((e) => this._onItemDelete.call(this, e, sheet))
  }

  /**
   * Allows each item to add data to its own sheet.
   */
  static getSheetData(sheetData, _item) {
    return sheetData
  }

  /**
   * Allows each item to add data to its owners actorsheet.
   */
  static getActorSheetData(sheetData, _actor) {
    return sheetData
  }

  /**
   * Allows each item to add listeners to its sheet
   */
  static activateListeners(_html, _item) {
    // Do nothing by default
  }

  /*************************
   * EVENT HANDLER
   *************************/

  /**
   * Itemtype agnostic handler for creating new items via event.
   */
  static async _onItemAdd(e, sheet) {
    e.preventDefault()
    e.stopPropagation()

    if (!this.entityName) {
      throw new Error(
        'A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.'
      )
    }

    const itemData = {
      name: this.defaultName,
      type: this.entityName,
      sort: 9000000,
    }

    await this.createNewItem(itemData, sheet)
  }

  /**
   * Itemtype agnostic handler for sorting all items in sheet
   */
  static async _onItemSortRank(sheet) {
    const skills = sheet.actor.items.filter((item) => item.type == 'skill')
    skills.sort((a, b) => a.data.data.rank - b.data.data.rank).reverse()

    let i = 0

    const updates = skills.map((skill) => ({
      _id: skill._id,
      sort: 10000 + i++,
    }))

    sheet.actor.updateOwnedItem(updates)
  }

  /**
   * Itemtype agnostic handler for opening an items sheet via event.
   */
  static _onItemSettings(e, sheet) {
    e.preventDefault()
    e.stopPropagation()

    const data = e.currentTarget.dataset
    const item = sheet.actor.items.get(data.item)

    if (item) {
      item.sheet.render(true)
    }
  }

  /**
   * Itemtype agnostic handler for deleting an item via event.
   */
  static _onItemDelete(e, sheet: ActorSheet) {
    e.preventDefault()
    e.stopPropagation()

    const data = e.currentTarget.dataset
    const item = sheet.actor.items.get(data.item)
    const titleKey = `IRONSWORN.Delete${capitalize(item?.type || '')}`

    Dialog.confirm({
      title: game.i18n.localize(titleKey),
      content: `<p><strong>${game.i18n.localize(
        'IRONSWORN.ConfirmDelete'
      )}</strong></p>`,
      yes: () => item?.delete(),
      defaultYes: false,
    })
  }

  /*************************
   * HELPER FUNCTIONS
   *************************/

  /**
   * Helper function to create a new item.
   * Render parameter determines if the items sheet should be rendered.
   */
  static async createNewItem(itemData, sheet, render = true) {
    // Create item and render sheet afterwards
    const newItems = await Item.createDocuments([itemData], {
      parent: sheet.actor,
    })
    const newItem = newItems[0]

    // Tokens don't return the new item
    if (!render || sheet.actor.isToken) return

    // We have to reload the item for it to have a sheet
    // Todo: Fix to use renderSheet option on creation
    const createdItem = sheet.actor.items.get(newItem.id)
    createdItem.sheet.render(true)
  }

  /**
   * Helper function to determine a new items name.
   * Defaults to the entityName with the first letter capitalized.
   */
  static get defaultName() {
    return this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1)
  }

  protected static isEditMode(e): boolean {
    const element = jQuery(e.currentTarget)

    return !!element.closest('.ironsworn__helper--enable-editmode').length
  }
}

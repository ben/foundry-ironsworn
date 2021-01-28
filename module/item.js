import { RANKS, RANK_INCREMENTS } from './ironsworn.js'

/**
 * Extend the base Iteem entity
 * @extends {Item}
 */
export class IronswornItem extends Item {
  /**
   * Progress methods
   */
  markProgress () {
    if (this.data.data.rank === undefined) return

    const increment = RANK_INCREMENTS[this.data.data.rank]
    const newValue = Math.min(this.data.data.current + increment, 40)
    return this.update({ 'data.current': newValue })
  }

  clearProgress () {
    if (this.data.data.rank === undefined) return
    return this.update({ 'data.current': 0 })
  }

  fulfill () {
    if (this.data.data.rank === undefined) return
    const progress = Math.floor(this.data.data.current / 4)
    const r = new Roll(`{${progress},d10,d10}`).roll()
    r.toMessage({
      flavor: `<div class="move-title">${game.i18n.localize('IRONSWORN.FulfillVow')}: ${this.name}</div>`
    })
  }

  /**
   * Asset methods
   */
  createField () {
    const fields = this.data.data.fields
    fields.push({ name: '', value: '' })
    return this.update({ 'data.fields': fields })
  }
  deleteField (name) {
    const fields = this.data.data.fields
    return this.update({ 'data.fields': fields.filter(x => x.name !== name) })
  }
  createAbility () {
    const abilitiese = this.data.data.abilities
    abilities.push({
      enabled: false,
      description: ''
    })
    return this.update({ 'data.abilities': abilities })
  }
  deleteAbility (name) {
    const abilities = this.data.data.abilities
    return this.update({
      'data.abilities': abilities.filter(x => x.name !== name)
    })
  }

  async renderEmbed (data) {
    const template =
      'systems/foundry-ironsworn/templates/item/asset_embedded.hbs'
    const rendered = await renderTemplate(template, data)
    await this.update({ 'data.rendered': rendered })
  }

  // Bondset methods
  get count() {
    return Object.values(this.data.data.bonds).length
  }
}

Hooks.on('createItem', async item => {
  if (item.data.type === 'asset') {
    await item.renderEmbed(item.data)
  }
})
Hooks.on('createOwnedItem', async (owner, itemData) => {
  if (itemData.type === 'asset') {
    const item = owner.items.get(itemData._id)
    await item.renderEmbed(itemData)
  }
})

Hooks.on('updateItem', async (item, diff) => {
  if (!diff.data.rendered) {
    await item.renderEmbed(item.data)
  }
})
Hooks.on('updateOwnedItem', async (owner, itemData, diff) => {
  if (!diff.data.rendered) {
    const item = owner.items.get(itemData._id)
    await item.renderEmbed(itemData)
  }
})

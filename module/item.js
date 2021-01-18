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
      flavor: `<div class="move-title">Fulfill Vow: ${this.name}</div>`
    })
  }

  /**
   * Asset methods
   */
  createField () {
    const fields = this.data.data.fields
    fields.push({ name: 'New field', value: '' })
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

  /**
   * @override - render description for embed
   */
  async update (data, options) {
    const updatedEntity = await super.update(data, options)
    if (this.type === 'asset') {
      const template =
        'systems/foundry-ironsworn/templates/item/asset_embedded.hbs'
      const rendered = await renderTemplate(template, updatedEntity.data)
      await super.update({ 'data.rendered': rendered })
    }
    return updatedEntity
  }
}

<template>
  <div class="flexcol ironsworn__drop__target" data-drop-type="asset">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="flexrow" v-for="(asset, i) in assets" :key="asset._id">
        <order-buttons
          v-if="editMode"
          :i="i"
          :length="assets.length"
          @sortUp="sortUp"
          @sortDown="sortDown"
        />
        <asset :actor="actor" :asset="asset" />
      </div>
    </transition-group>
    <div class="flexrow nogrow" style="text-align: center">
      <btn-compendium class="block" compendium="starforgedassets">{{
        $t('IRONSWORN.Assets')
      }}</btn-compendium>
    </div>
  </div>
</template>

<script>
import { sortBy } from 'lodash'

export default {
  props: {
    actor: Object,
  },
  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    assets() {
      const assets = this.actor.items.filter((x) => x.type === 'asset')
      return sortBy(assets, (x) => x.sort)
    },
  },
  methods: {
    openCompendium() {
      const pack = game.packs?.get('foundry-ironsworn.starforgedassets')
      pack?.render(true)
    },
    async applySort(oldI, newI, sortBefore) {
      const foundryItems = this.$actor.items
        .filter((x) => x.type === 'asset')
        .sort((a, b) => (a.data.sort || 0) - (b.data.sort || 0))
      const updates = SortingHelpers.performIntegerSort(foundryItems[oldI], {
        target: foundryItems[newI],
        siblings: foundryItems,
        sortBefore,
      })
      await Promise.all(
        updates.map(({ target, update }) => target.update(update))
      )
    },
    sortUp(i) {
      this.applySort(i, i - 1, true)
    },
    sortDown(i) {
      this.applySort(i, i + 1, false)
    },
  },
}
</script>

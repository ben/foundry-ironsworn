<template>
  <itemlist-page class="assets-page ironsworn__drop__target" data-drop-type="asset">
    <transition-group name="slide" tag="foundryitem-list" class="player-assets">
      <foundry-listitem class="item-asset player-asset" v-for="(asset, i) in assets" :key="asset._id">
        <order-buttons v-if="editMode" :i="i" :length="assets.length" @sortUp="sortUp" @sortDown="sortDown" />
        <asset :actor="actor" :asset="asset" />
      </foundry-listitem>
    </transition-group>
    <itemlist-controls
      :actor="actor"
      :progressTypes="[]"
      :compendiumTypes="[{ name: 'starforgedassets', i18n: 'Assets' }]"
    >
    </itemlist-controls>
  </itemlist-page>
</template>

<style lang="less">
.player-asset {
  gap: 0.5rem;
  border: 1px solid lightgray;
  padding: 0.5rem;
}
</style>

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
      await Promise.all(updates.map(({ target, update }) => target.update(update)))
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

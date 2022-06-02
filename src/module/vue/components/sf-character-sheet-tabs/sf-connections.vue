<template>
  <itemlist-page class="connections-page">
    <transition-group name="slide" tag="foundryitem-list" class="progress-tracks">
      <foundry-listitem class="item-progress" v-for="(item, i) in connections" :key="item._id">
        <order-buttons v-if="editMode" :i="i" :length="connections.length" @sortUp="sortUp" @sortDown="sortDown" />
        <progress-tracker :item="item" :actor="actor" :showStar="true" />
      </foundry-listitem>
    </transition-group>
    <itemlist-controls
      :actor="actor"
      :progressTypes="[{ name: 'connection', i18n: 'Connection' }]"
      :compendiumTypes="[]"
    >
    </itemlist-controls>
  </itemlist-page>
</template>

<style lang="less">
.connections-page {
  .slide-enter-active,
  .slide-leave-active {
    max-height: 83px;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    connections() {
      return this.actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.subtype === 'bond') // legacy name
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    },

    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
  },

  methods: {
    async applySort(oldI, newI, sortBefore) {
      const foundryItems = this.$actor.items
        .filter((x) => x.type === 'progress')
        .filter((x) => x.data.data.subtype === 'bond')
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

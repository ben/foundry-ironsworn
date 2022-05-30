<template>
  <div class="flexcol connections">
    <transition-group name="slide" tag="div" class="nogrow">
      <div class="flexrow nogrow connection" v-for="(item, i) in connections" :key="item._id">
        <order-buttons v-if="editMode" :i="i" :length="connections.length" @sortUp="sortUp" @sortDown="sortDown" />
        <progress-tracker :item="item" :actor="actor" :showStar="true" />
      </div>
    </transition-group>

    <div class="flexrow nogrow add-connection">
      <div class="clickable block" @click="newConnection">
        <i class="fas fa-plus"></i>
        {{ $t('IRONSWORN.Connection') }}
      </div>
    </div>
  </div>
</template>

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
    async newConnection() {
      const item = await Item.create(
        {
          name: game.i18n.localize('IRONSWORN.Connection'),
          type: 'progress',
          data: { subtype: 'bond' }, // legacy name
          sort: 9000000,
        },
        { parent: this.$actor }
      )
      item.sheet.render(true)
    },

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

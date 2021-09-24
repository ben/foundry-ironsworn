<template>
  <div class="flexcol item-row nogrow">
    <div class="flexrow">
      <h4>{{ $t('IRONSWORN.Bonds') }}</h4>
      <icon-button icon="edit" @click="editBonds" />
      <icon-button icon="dice-d6" @click="rollBonds" />
    </div>
    <progress-track :ticks="bondcount" />
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  computed: {
    bonds() {
      return this.actor.items.filter((x) => x.type === 'bondset')[0]
    },
    bondcount() {
      return Object.values(this.bonds?.data.bonds).length
    },
  },

  methods: {
    editBonds() {
      const actor = game.actors?.get(this.actor._id)
      const item = actor.items.get(this.bonds._id)
      item?.sheet.render(true)
    },
    rollBonds() {
      const actor = game.actors?.get(this.actor._id)
      const item = actor.items.get(this.bonds._id)
      item?.writeEpilogue()
    },
  },
}
</script>

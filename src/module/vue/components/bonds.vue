<template>
  <div class="flexcol item-row nogrow">
    <div class="flexrow">
      <h4>{{ $t('IRONSWORN.Bonds') }}</h4>
      <div class="clickable block nogrow progress-button" @click="editBonds">
        <i class="fas fa-edit"></i>
      </div>
      <div class="clickable block nogrow progress-button" @click="rollBonds">
        <i class="fas fa-dice-d6"></i>
      </div>
    </div>
    <div class="flexrow track">(track)</div>
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

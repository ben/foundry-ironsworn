<template>
  <div :class="$concat('stat block ', clickable)" @click="click">
    <h4>{{ $t(i18nKey) }}</h4>
    <div class="flexrow">
      <div class="clickable text" v-if="editMode" @click="decrement">
        &minus;
      </div>
      <h3>{{ actor.data[attr] }}</h3>
      <div class="clickable text" v-if="editMode" @click="increment">
        &plus;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
  },

  computed: {
    i18nKey() {
      return `IRONSWORN.${this.$capitalize(this.attr)}`
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']['edit-mode']
    },
    clickable() {
      return this.editMode ? '' : ' clickable '
    },
  },

  methods: {
    click() {
      if (this.editMode) return
      const actor = game.actors?.get(this.actor._id)
      CONFIG.IRONSWORN.RollDialog.show({ actor, stat: this.attr })
    },

    increment() {
      const value = parseInt(this.actor.data[this.attr]) + 1
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { [this.attr]: value } })
    },
    decrement() {
      const value = parseInt(this.actor.data[this.attr]) - 1
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { [this.attr]: value } })
    },
  },
}
</script>

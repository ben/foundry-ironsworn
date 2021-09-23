<template>
  <div class="stat clickable block" @click="click">
    <h4>{{ $t(i18nKey) }}</h4>
    <h3>{{ actor.data[attr] }}</h3>
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
  },

  methods: {
    click() {
      const actor = game.actors?.get(this.actor._id)
      CONFIG.IRONSWORN.RollDialog.show({ actor, stat: this.attr })
    },
  },
}
</script>

<template>
  <isicon-button
    @click="rollStat(attr)"
    :title="tooltip"
    :class="classes"
    v-text="game.i18n.localize(i18nLabelKey)"
    icon="d10-tilt"
  />
</template>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
    tooltip: String,
  },
  computed: {
    i18nLabelKey() {
      return `IRONSWORN.${this.$capitalize(this.attr)}`
    },
    classes() {
      return {
        [this.attr]: true,
        stat: true,
        'action-roll': true,
      }
    },
  },

  methods: {
    rollStat() {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat: this.attr })
    },
  },
}
</script>

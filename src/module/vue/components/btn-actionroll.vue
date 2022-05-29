<template>
  <isicon-button @click="rollStat(attr)" :title="tooltip" :class="classes" icon="d10-tilt" :v-text="textContent">
    <slot></slot>
  </isicon-button>
</template>

<script>
export default {
  props: {
    actor: Object,
    attr: String,
    tooltip: String,
    textContent: String,
    // i18nKey: String,
  },
  computed: {
    // i18n() {
    //   return game.i18n.localize(`IRONSWORN.${this.i18nKey ?? this.$capitalize(this.attr)}`)
    // },
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

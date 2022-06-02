<template>
  <isicon-button @click="rollStat()" :title="tooltip" class="action-roll" :class="attr" icon="d10-tilt">
    <slot></slot>
  </isicon-button>
</template>

<script>
export default {
  props: {
    actor: Object,
    item: Object, // the asset. only needed if this is an asset condition meter
    attr: String,
    tooltip: String,
  },
  computed: {},
  methods: {
    rollStat() {
      CONFIG.IRONSWORN.RollDialog.show({ actor: this.$actor, stat: this.attr, asset: this.$item })
    },
  },
}
</script>

<template>
  <svgicon-button @click="rollStat()" :title="tooltip" class="opens-dialog action-roll" :class="attr" icon="d10-tilt">
    <slot></slot>
  </svgicon-button>
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
      console.log(this.attr, this.item)
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        stat: this.attr,
        asset: this.item ? this.$item : undefined,
      })
    },
  },
}
</script>

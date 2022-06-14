<template>
  <btn-isicon
    @click="rollStat()"
    :tooltip="tooltip"
    class="action-roll stat-roll"
    :class="attr"
    icon="d10-tilt"
    aria-haspopup="dialog"
  >
    <slot></slot>
  </btn-isicon>
</template>

<script>
export default {
  props: {
    actor: Object,
    item: Object, // the asset. only needed if this is an asset condition meter
    attr: String,
    tooltip: String,
  },
  methods: {
    rollStat() {
      // console.log(this.attr, this.item)
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        stat: this.attr,
        asset: this.item ? this.$item : undefined,
      })
    },
  },
}
</script>

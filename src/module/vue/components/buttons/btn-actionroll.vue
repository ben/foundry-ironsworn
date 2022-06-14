<template>
  <btn-svgicon
    @click="rollStat()"
    :title="tooltip"
    class="action-roll"
    :class="attr"
    icon="d10-tilt"
    aria-haspopup="dialog"
  >
    <!-- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup -->
    <slot></slot>
  </btn-svgicon>
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

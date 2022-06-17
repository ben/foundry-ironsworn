<template>
  <btn-isicon
    icon="d10-tilt"
    class="oracle-roll"
    @click="rollOracle"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-isicon>
</template>

<style lang="less"></style>

<script>
import { sample } from 'lodash'
export default {
  props: {
    tooltip: String,
    node: Object,
    disabled: Boolean,
  },
  methods: {
    rollOracle() {
      const randomTable = sample(this.node.tables)
      CONFIG.IRONSWORN.rollAndDisplayOracleResult(randomTable)
    },
  },
}
</script>

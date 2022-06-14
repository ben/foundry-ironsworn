<template>
  <btn-svgicon icon="oracle" class="oracle-roll" @click="rollOracle" :title="tooltip">
    <slot></slot>
  </btn-svgicon>
</template>

<style lang="less"></style>

<script>
import { sample } from 'lodash'
export default {
  props: {
    tooltip: String,
    node: Object,
  },
  methods: {
    rollOracle() {
      const randomTable = sample(this.node.tables)
      CONFIG.IRONSWORN.rollAndDisplayOracleResult(randomTable)
    },
  },
}
</script>

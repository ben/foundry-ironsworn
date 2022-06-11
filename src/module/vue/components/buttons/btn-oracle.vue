<template>
  <svgicon-button icon="oracle" class="opens-dialog oracle-roll" @click="rollOracle" :title="tooltip">
    <slot></slot>
  </svgicon-button>
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

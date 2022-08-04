<template>
  <btn-isicon
    icon="d10-tilt"
    class="oracle-roll"
    @click="rollOracle"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { sample } from 'lodash'
import { IOracleTreeNode } from '../../../features/customoracles.js'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  tooltip?: string
  node: IOracleTreeNode
  disabled?: boolean
}>()

function rollOracle() {
  const randomTable = sample(props.node.tables)
  CONFIG.IRONSWORN.rollAndDisplayOracleResult(randomTable)
}
</script>

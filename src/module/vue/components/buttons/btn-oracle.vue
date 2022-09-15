<template>
  <btn-isicon
    icon="oracle"
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
import { inject } from 'vue'
import { IOracleTreeNode } from '../../../features/customoracles.js'
import { OracleRollMessage } from '../../../rolls'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  tooltip?: string
  node: IOracleTreeNode
  disabled?: boolean
}>()

const toolset = inject<'ironsworn' | 'starforged'>('toolset')

async function rollOracle() {
  const randomTable = sample(props.node.tables)
  const pack = {
    ironsworn: 'foundry-ironsworn.ironswornoracles',
    starforged: 'foundry-ironsworn.starforgedoracles',
  }[toolset ?? '']

  const orm = await OracleRollMessage.fromTableId(randomTable?.id ?? '', pack)
  orm.createOrUpdate()
}
</script>

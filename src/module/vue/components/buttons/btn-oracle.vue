<template>
  <BtnIsicon
    icon="oracle"
    class="oracle-roll"
    @click="rollOracle"
    :tooltip="
      $t('IRONSWORN.RollOracleTable', { title: props.node.displayName })
    "
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </BtnIsicon>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { sample } from 'lodash'
import { inject } from 'vue'
import { IOracleTreeNode } from '../../../features/customoracles.js'
import { OracleRollMessage } from '../../../rolls'
import BtnIsicon from './btn-isicon.vue'

const props = defineProps<{
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

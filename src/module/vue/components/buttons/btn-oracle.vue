<template>
  <IronBtn
    class="oracle-roll"
    @click="rollOracle"
    :tooltip="
      $t('IRONSWORN.RollOracleTable', { title: props.node.displayName })
    "
    v-bind="$props"
    icon="ironsworn:oracle"
  />
</template>

<style lang="less"></style>

<script setup lang="ts">
import { sample } from 'lodash'
import { ExtractPropTypes, inject } from 'vue'
import { IOracleTreeNode } from '../../../features/customoracles.js'
import { OracleRollMessage } from '../../../rolls'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {}

const props = defineProps<{
  node: IOracleTreeNode
  overrideClick?: boolean
  // Hack: if we declare `click` in the emits, there's no $attrs['onClick']
  // This allows us to check for presence and still use $emit('click')
  // https://github.com/vuejs/core/issues/4736#issuecomment-934156497
  onClick?: Function
}>()

const toolset = inject<'ironsworn' | 'starforged'>('toolset')
const $emit = defineEmits(['click'])

async function rollOracle() {
  if (props.overrideClick && props.onClick) return $emit('click')

  const randomTable = sample(props.node.tables)
  const pack = {
    ironsworn: 'foundry-ironsworn.ironswornoracles',
    starforged: 'foundry-ironsworn.starforgedoracles',
  }[toolset ?? '']

  const orm = await OracleRollMessage.fromTableId(
    randomTable?.()?.id ?? '',
    pack
  )
  orm.createOrUpdate()
}
</script>

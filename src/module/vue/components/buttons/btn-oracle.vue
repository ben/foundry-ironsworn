<template>
  <IronBtn
    class="oracle-roll"
    @click="rollOracle"
    :tooltip="
      $t('IRONSWORN.RollOracleTable', { title: props.node.displayName })
    "
    icon="ironsworn:oracle"
    v-bind="($props, $attrs)"
  >
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </IronBtn>
</template>

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

const $emit = defineEmits(['click'])

async function rollOracle() {
  if (props.overrideClick && props.onClick) return $emit('click')

  const randomTable = sample(props.node.tables)?.()

  const orm = await OracleRollMessage.fromTableId(
    randomTable?.id ?? '',
    randomTable?.pack || undefined
  )
  orm.createOrUpdate()
}
</script>

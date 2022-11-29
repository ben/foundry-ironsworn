<template>
  <btn-isicon
    @click="rollProgress()"
    :tooltip="$t('IRONSWORN.MakeAProgressRoll', { score: progressScore })"
    class="progress-roll"
    icon="d10-tilt"
    v-bind="props"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { ProgressDataProperties } from '../../../item/itemtypes'
import { $ItemKey } from '../../provisions'
import BtnIsicon from './btn-isicon.vue'

const props = defineProps<{
  item: any
  // FIXME: shared props, inherit them once Vue adds support in 3.3
  disabled?: boolean
  buttonStyle?: 'noBg' | 'block' | 'blockBorder'
  hoverBg?: boolean
}>()

const $item = inject($ItemKey, undefined)

const progressScore = computed(() => {
  return Math.floor(props.item.system.current / 4)
})

function rollProgress() {
  $item?.fulfill()
}
</script>

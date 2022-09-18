<template>
  <btn-isicon
    @click="rollProgress()"
    :tooltip="$t('IRONSWORN.MakeAProgressRoll', { score: progressScore })"
    class="progress-roll"
    icon="d10-tilt"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { IronswornItem } from '../../../item/item'
import { ProgressDataProperties } from '../../../item/itemtypes'
import { $ActorKey, $ItemKey } from '../../provisions'
import BtnIsicon from './btn-isicon.vue'

const props = defineProps<{ item: any; tooltip?: string; disabled?: boolean }>()

const $actor = inject($ActorKey, undefined)
const $item = inject($ItemKey, undefined)

const progressScore = computed(() => {
  if (!$item) return 0
  const itemData = $item.data as ProgressDataProperties
  return Math.floor(itemData.data.current / 4)
})

function rollProgress() {
  $item?.fulfill()
}
</script>

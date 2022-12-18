<template>
  <IronBtn
    @click="rollProgress()"
    :tooltip="$t('IRONSWORN.MakeAProgressRoll', { score: progressScore })"
    class="progress-roll"
    :disabled="props.disabled"
  >
    <template #icon>
      <IronIcon name="d10-tilt" />
    </template>
    <slot name="default"></slot>
  </IronBtn>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { $ItemKey } from '../../provisions'
import IronIcon from '../icon/iron-icon.vue'
import IronBtn from './iron-btn.vue'

const props = defineProps<{ item: any; tooltip?: string; disabled?: boolean }>()

const $item = inject($ItemKey, undefined)

const progressScore = computed(() => {
  return Math.floor(props.item.system.current / 4)
})

function rollProgress() {
  $item?.fulfill()
}
</script>

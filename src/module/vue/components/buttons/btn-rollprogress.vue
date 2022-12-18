<template>
  <IronBtn
    @click="rollProgress()"
    :tooltip="$t('IRONSWORN.MakeAProgressRoll', { score: progressScore })"
    class="progress-roll"
    v-bind="$props"
  >
    <template #icon>
      <IronIcon name="d10-tilt" />
    </template>
    <slot name="default"></slot>
  </IronBtn>
</template>

<script setup lang="ts">
import { ExtractPropTypes, computed, inject } from 'vue'
import { $ItemKey } from '../../provisions'
import IronIcon from '../icon/iron-icon.vue'
import IronBtn from './iron-btn.vue'

interface Props extends ExtractPropTypes<typeof IronBtn> {
  item: any
}

const props = defineProps<Props>()

const $item = inject($ItemKey, undefined)

const progressScore = computed(() => {
  return Math.floor(props.item.system.current / 4)
})

function rollProgress() {
  $item?.fulfill()
}
</script>

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
import { $ActorKey, $ItemKey } from '../../provisions'
import BtnIsicon from './btn-isicon.vue'

const props = defineProps<{ item: any; tooltip?: string; disabled?: boolean }>()

const $actor = inject($ActorKey, undefined)

const progressScore = computed(() => {
  let item: IronswornItem | undefined
  if ($actor) {
    item = $actor.items.find((x) => x.id === props.item._id)
  } else {
    item = game.items?.get(props.item.id)
  }
  return Math.floor(item?.data.data.current / 4)
})

function rollProgress() {
  let item: IronswornItem | undefined
  if ($actor) {
    item = $actor.items.find((x) => x.id === props.item._id)
  } else {
    item = game.items?.get(props.item.id)
  }
  item?.fulfill()
}
</script>

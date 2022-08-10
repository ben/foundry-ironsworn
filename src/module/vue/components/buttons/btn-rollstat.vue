<template>
  <btn-isicon
    @click="rollStat"
    :tooltip="tooltip"
    class="action-roll stat-roll"
    :class="attr"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps({
  item: Object, // the asset. only needed if this is an asset condition meter
  attr: String,
  tooltip: String,
  disabled: Boolean,
})

const $actor = inject($ActorKey)
const $item = computed(() => {
  return (
    $actor?.items.find((x) => x.id === props.item?._id) ??
    game.items?.get(props.item?._id)
  )
})

function rollStat() {
  RollDialog.show({
    actor: $actor,
    stat: props.attr,
    asset: props.item ? $item.value : undefined,
  })
}
</script>

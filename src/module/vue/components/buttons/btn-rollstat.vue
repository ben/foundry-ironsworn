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
    <slot ref="content" name="default"></slot>
  </btn-isicon>
</template>

<script lang="ts" setup>
import { capitalize } from 'lodash'
import { computed, inject, ref, useSlots } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { IronswornPrerollDialog } from '../../../rolls'
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

const slots = useSlots()
const slotText = computed(() => {
  return slots.default?.()[0].children // This is the interesting line
})

function rollStat() {
  if (props.item) {
    const name = `${slotText.value?.toString()} (${props.item.name})`
    return IronswornPrerollDialog.showForStat(
      name,
      $item.value?.data.data[props.attr ?? '']?.current,
      $actor
    )
  } else if ($actor) {
    let attrName = game.i18n.localize('IRONSWORN.' + capitalize(props.attr))
    if (attrName.startsWith('IRONSWORN.')) attrName = props.attr
    const name = `${attrName} (${$actor?.name})`

    return IronswornPrerollDialog.showForStat(
      name,
      $actor.data.data[props.attr ?? ''],
      $actor
    )
  }
  RollDialog.show({
    actor: $actor,
    stat: props.attr,
    asset: props.item ? $item.value : undefined,
  })
}
</script>

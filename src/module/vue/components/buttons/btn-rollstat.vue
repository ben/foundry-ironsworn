<template>
  <btn-isicon
    @click="rollStat"
    :data-tooltip="$t('IRONSWORN.Roll +x', { stat: statLabel })"
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
import { computed, inject, useSlots } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { IronswornItem } from '../../../item/item.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  /**
   * The asset. Only needed if this is an asset condition meter.
   */
  item?: IronswornItem
  /**
   * This string will be inserted in into the tooltip text "Roll +{x}". It should already be localized.
   */
  statLabel: string
  attr: string
  disabled?: boolean
}>()

const $actor = inject($ActorKey)
const $item = computed(() => {
  return (
    $actor?.items.find((x) => x.id === (props.item as any)?._id) ??
    game.items?.get((props.item as any)?._id)
  )
})

const slots = useSlots()
const slotText = computed(() => {
  return slots.default?.()[0].children // This is the interesting line
})

function rollStat(): any {
  if (props.item) {
    const name = `${slotText.value?.toString()} (${props.item.name})`
    return IronswornPrerollDialog.showForStat(
      name,
      $item.value?.data.data[props.attr ?? '']?.current,
      $actor
    )
  } else if ($actor) {
    const name = `${props.statLabel} (${$actor?.name})`

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

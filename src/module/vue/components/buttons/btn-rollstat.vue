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
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { computed, inject, useSlots } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { AssetDataProperties } from '../../../item/itemtypes.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  documentType: DocumentType
  /**
   * This string will be inserted in into the tooltip text "Roll +{x}". It should already be localized.
   */
  statLabel: string
  attr: string
  disabled?: boolean
}>()

const $actor = inject($ActorKey)
const actor = inject(ActorKey)
const $item = inject($ItemKey)
const item = inject(ItemKey)

const slots = useSlots()

function rollStat(): any {
  if (props.documentType === 'Item') {
    const name = `${props.statLabel} (${$item?.name})`
    // FIXME: this should take `attr` instead to get the value, but there doesn't seem to be a simple way to (de)stringify the path to deeper props like there is with e.g. Actor.update()
    // so, for now, we assume that assets are the only Items that we bother to roll with.
    return IronswornPrerollDialog.showForStat(
      name,
      ($item?.data as AssetDataProperties).data.track.current,
      $actor
    )
  } else if (props.documentType === 'Actor') {
    const name = `${props.statLabel} (${$actor?.name})`

    return IronswornPrerollDialog.showForStat(
      name,
      $actor?.data.data[props.attr],
      $actor
    )
  }
  RollDialog.show({
    actor: $actor,
    stat: props.attr,
  })
}
</script>

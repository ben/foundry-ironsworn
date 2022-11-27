<template>
  <btn-isicon
    @click="rollMove"
    :tooltip="
      $t('IRONSWORN.RollMove', {
        title: props.move?.displayName,
      })
    "
    class="action-roll move-roll"
    icon="d10-tilt"
    aria-haspopup="dialog"
    v-bind="props"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Move } from '../../../features/custommoves.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  move?: Move
  // FIXME: shared props, inherit them once Vue adds support in 3.3
  disabled?: boolean
  buttonStyle?:
    | 'iconOnly'
    | 'iconHoverBlock'
    | 'blockBorder'
    | 'blockBorderless'
    | 'text'
  hoverBg?: boolean
}>()

const $actor = inject($ActorKey)

async function rollMove() {
  if (!props.move) throw new Error('No move?')
  if (props.move.dataforgedMove)
    return IronswornPrerollDialog.showForOfficialMove(
      props.move?.dataforgedMove.$id,
      $actor
    )
  IronswornPrerollDialog.showForMove(props.move.moveItem(), $actor)
}
</script>

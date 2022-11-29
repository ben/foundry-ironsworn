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
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { inject, useAttrs } from 'vue'
import { Move } from '../../../features/custommoves.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  move?: Move
  disabled?: boolean
  overrideClick?: boolean

  // Hack: if we declare `click` in the emits, there's no $attrs['onClick']
  // This allows us to check for presence and still use $emit('click')
  // https://github.com/vuejs/core/issues/4736#issuecomment-934156497
  onClick?: Function
}>()

const $actor = inject($ActorKey)
const $emit = defineEmits(['click'])

async function rollMove() {
  if (props.overrideClick && props.onClick) return $emit('click')
  if (!props.move) throw new Error('No move?')
  if (props.move.dataforgedMove)
    return IronswornPrerollDialog.showForOfficialMove(
      props.move?.dataforgedMove.$id,
      { actor: $actor }
    )
  IronswornPrerollDialog.showForMove(props.move.moveItem(), { actor: $actor })
}
</script>

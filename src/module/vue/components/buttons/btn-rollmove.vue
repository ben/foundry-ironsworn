<template>
  <btn-isicon
    @click="rollMove"
    :tooltip="tooltip"
    class="action-roll move-roll"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import { Move } from '../../../features/custommoves.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  move?: Move
  disabled?: boolean
}>()

const tooltip = computed(() => {
  let str = game.i18n.format('IRONSWORN.RollMove', {
    title: props.move?.displayName,
  })
  return str
})

const $actor = inject($ActorKey)

async function rollMove() {
  if (props.move?.dataforgedMove)
    return IronswornPrerollDialog.showForOfficialMove(
      props.move?.dataforgedMove.$id,
      $actor
    )
  IronswornPrerollDialog.showForMove(
    props.move?.moveItem as Move['moveItem'],
    $actor
  )
}
</script>

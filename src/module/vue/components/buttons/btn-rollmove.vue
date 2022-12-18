<template>
  <IronBtn
    @click="rollMove"
    :tooltip="
      $t('IRONSWORN.RollMove', {
        title: props.move?.displayName,
      })
    "
    class="action-roll move-roll"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <template #icon>
      <IronIcon name="d10-tilt" />
    </template>
    <slot name="default"></slot>
  </IronBtn>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Move } from '../../../features/custommoves.js'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey } from '../../provisions'
import IronIcon from '../icon/iron-icon.vue'
import IronBtn from './iron-btn.vue'

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

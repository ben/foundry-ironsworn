<template>
  <btn-faicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :tooltip="tooltip"
    v-bind="props"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import { CharacterDataPropertiesData } from '../../../actor/actortypes'
import { $ActorKey } from '../../provisions'
import btnFaicon from './btn-faicon.vue'

const props = defineProps<{
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

const tooltip = computed(() => {
  const { momentum, momentumReset } =
    $actor?.system as CharacterDataPropertiesData
  return game.i18n.format('IRONSWORN.BurnMomentumAndResetTo', {
    value: momentum,
    resetValue: momentumReset,
  })
})

const burnMomentum = () => $actor?.burnMomentum()
</script>

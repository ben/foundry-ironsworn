<template>
  <btn-faicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :disabled="disabled"
    :tooltip="tooltip"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import { CharacterDataProperties } from '../../../actor/actortypes'
import { $ActorKey } from '../../provisions'
import btnFaicon from './btn-faicon.vue'

defineProps<{ disabled?: boolean }>()
const $actor = inject($ActorKey)

const tooltip = computed(() => {
  const { momentum, momentumReset } = ($actor?.data as CharacterDataProperties)
    ?.data
  return game.i18n.format('IRONSWORN.BurnMomentumAndResetTo', {
    value: momentum,
    resetValue: momentumReset,
  })
})

const burnMomentum = () => $actor?.burnMomentum()
</script>

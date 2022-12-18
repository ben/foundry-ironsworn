<template>
  <IronBtn
    class="burn-momentum"
    @click="burnMomentum"
    :tooltip="tooltip"
    v-bind="$props"
  >
    <template #icon>
      <FontIcon name="fire" />
    </template>
    <slot name="default"></slot>
  </IronBtn>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { ExtractPropTypes, inject } from 'vue'
import { CharacterDataPropertiesData } from '../../../actor/actortypes'
import { $ActorKey } from '../../provisions'
import FontIcon from '../icon/font-icon.vue'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {
  compendium: string
}

defineProps<Props>()
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

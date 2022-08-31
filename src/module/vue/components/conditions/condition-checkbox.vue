<template>
  <label class="checkbox" :data-tooltip="getDescriptionKey()">
    <input
      type="checkbox"
      @change="input"
      :checked="actor.data.debility[name]"
    />
    {{ $t(getLabelKey()) }}
  </label>
</template>

<script lang="ts" setup>
import { inject, nextTick, Ref } from 'vue'
import { DebilityKeys, ImpactKeys } from '../../../features/chat-alert.js'
import { IronswornSettings } from '../../../helpers/settings'
import { $ActorKey } from '../../provisions'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const props = defineProps<{
  name: string
  global?: boolean
  /**
   * Whether to use Ironsown-classic-style "Debilities" instead of "Impacts"
   */
  classic?: boolean
}>()

function getDescriptionKey() {
  return `${
    (props.classic ? DebilityKeys : ImpactKeys)[props.name]
  }.Description`
}

function getLabelKey() {
  return `${(props.classic ? DebilityKeys : ImpactKeys)[props.name]}.Label`
}

async function input(ev) {
  const value = ev.currentTarget.checked
  await $actor?.update({
    data: {
      debility: {
        [props.name]: value,
      },
    },
  })
  await nextTick()
  const numDebilitiesMarked = Object.values(actor.value.data.debility).filter(
    (x) => x === true
  ).length
  await $actor?.update({
    data: {
      momentumMax: 10 - numDebilitiesMarked,
      momentumReset: Math.max(0, 2 - numDebilitiesMarked),
    },
  })

  if (props.global) {
    await IronswornSettings.maybeSetGlobalCondition(props.name, value)
  }
}
</script>

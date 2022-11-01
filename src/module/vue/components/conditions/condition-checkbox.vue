<template>
  <label class="checkbox">
    <input
      type="checkbox"
      @change="input"
      :checked="actor.data.debility[name]"
    />
    {{ $t(`IRONSWORN.${$capitalize(name)}`) }}
  </label>
</template>

<script lang="ts" setup>
import { inject, nextTick, Ref } from 'vue'
import { IronswornSettings } from '../../../helpers/settings'
import { $ActorKey, ActorKey } from '../../provisions'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const props = defineProps<{
  name: string
  global?: boolean
  globalHint?: boolean
}>()

async function input(ev: Event) {
  const impactKey = 'debility'
  const value = (ev.currentTarget as HTMLInputElement)?.checked
  const data = {
    data: {
      [impactKey]: {
        [props.name]: value,
      },
    },
  }
  await $actor?.update(data)
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
    await IronswornSettings.updateGlobalAttribute(data, [
      'character',
      'starship',
    ])
  }

  if (props.globalHint) {
    CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
      name: props.name,
      enabled: value,
    })
  }
}

CONFIG.IRONSWORN.emitter.on('globalConditionChanged', ({ name, enabled }) => {
  if (name === props.name) {
    refreshGlobalHint()
  }
})

function refreshGlobalHint() {
  // TODO: update local state to indicate if any other actors/assets have this flag set
}
refreshGlobalHint()
</script>

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
import { inject } from 'vue'
import { IronswornActor } from '../../../actor/actor'
import { IronswornSettings } from '../../../helpers/settings'

const actor = inject('actor')
const $actor = inject('$actor') as IronswornActor

const props = defineProps({
  name: { type: String, required: true },
  global: Boolean,
})

async function input(ev) {
  const value = ev.currentTarget.checked
  let numDebilitiesMarked =
    Object.values(actor.data.debility).filter((x) => x).length +
    (value ? 1 : -1)
  await $actor?.update({
    data: {
      debility: {
        [props.name]: value,
      },
      momentumMax: 10 - numDebilitiesMarked,
      momentumReset: Math.max(0, 2 - numDebilitiesMarked),
    },
  })
  if (props.global) {
    await IronswornSettings.maybeSetGlobalCondition(props.name, value)
  }
}
</script>

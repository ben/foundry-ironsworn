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
import { inject, Ref } from 'vue'
import { IronswornActor } from '../../../actor/actor'
import { IronswornSettings } from '../../../helpers/settings'

const actor = inject('actor') as Ref
const $actor = inject('$actor') as IronswornActor

const props = defineProps<{
  name: string
  global?: boolean
}>()

async function input(ev) {
  const value = ev.currentTarget.checked
  let numDebilitiesMarked =
    Object.values(actor.value.data.debility).filter((x) => x).length +
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

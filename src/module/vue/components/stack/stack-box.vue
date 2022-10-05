<template>
  <button
    type="button"
    @click="click"
    :class="classes"
    :data-resource="stat"
    :data-value="value"
  >
    {{ valueStr }}
  </button>
</template>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue'
import { IronswornSettings } from '../../../helpers/settings'
import { $ActorKey, ActorKey } from '../../provisions'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const props = defineProps<{
  stat: string
  value: number
  softMax?: number
}>()

const valueStr = computed(() => {
  return props.value > 0 ? `+${props.value}` : props.value.toString()
})
const current = computed(() => {
  return actor.value.data[props.stat]
})
const selected = computed(() => {
  return current.value === props.value
})
const disabled = computed(() => {
  if (props.softMax === undefined) return false
  return props.value > props.softMax
})

const classes = computed(() => ({
  clickable: true,
  block: true,
  'stack-row': true,
  [props.stat]: true,
  selected: selected.value,
  disabled: disabled.value,
}))

function click() {
  if (disabled.value) return
  $actor?.update({ data: { [props.stat]: props.value } })
  if (props.stat === 'supply') {
    IronswornSettings.maybeSetGlobalSupply(props.value)
  }
}
</script>

<template>
  <label class="checkbox flexrow">
    <input
      type="checkbox"
      :checked="actor.data.debility[debilitykey]"
      @input="toggled"
    />
    <input
      type="text"
      v-model="actor.data.debility[nameKey]"
      @input="nameUpdate"
    />
  </label>
</template>

<style lang="less" scoped>
label {
  margin-left: -2px;
  margin-right: 5px;
}
input[type='text'] {
  border: 0;
  outline: 0;
  border-bottom: 1px solid;
}
</style>

<script lang="ts" setup>
import { throttle } from 'lodash'
import { computed, inject, nextTick, Ref } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'

const props = defineProps<{ debilitykey: string }>()

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const nameKey = computed(() => `${props.debilitykey}name`)

async function toggled(ev) {
  const value = ev.target.checked
  await $actor?.update({
    data: {
      debility: {
        [props.debilitykey]: value,
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
}

async function immediateNameUpdate() {
  const nk = nameKey.value
  await $actor?.update({
    [`data.debility.${nk}`]: actor.value.data.debility[nk],
  })
}
const nameUpdate = throttle(immediateNameUpdate, 1000)
</script>

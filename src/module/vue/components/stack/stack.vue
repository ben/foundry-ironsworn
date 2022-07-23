<template>
  <div class="nogrow">
    <stack-box
      v-for="x in values"
      :key="x"
      :stat="stat"
      :value="x"
      :softMax="softMax"
    >
    </stack-box>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import stackBox from './stack-box.vue'

const props = defineProps<{
  stat: string
  top: number
  bottom: number
  softMax?: number
}>()

const values = computed(() => {
  const ret = [] as number[]
  const increment = props.top > props.bottom ? -1 : 1
  let value = props.top
  do {
    ret.push(value)
    value += increment
  } while (value != props.bottom + increment)
  return ret
})
</script>

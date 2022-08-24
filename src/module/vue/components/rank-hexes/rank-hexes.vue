<template>
  <div class="flexrow" style="flex-wrap: nowrap">
    <rank-hex
      v-for="r in ranks"
      :key="r.rank"
      :rank="r.rank"
      :selected="r.selected"
      @click="$emit('click', r.rank)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { RANKS } from '../../../constants'
import RankHex from './rank-hex.vue'
const props = defineProps<{ current: string }>()

const ranks = computed(() => {
  const keys = Object.keys(RANKS)
  const position = keys.indexOf(props.current)
  return keys.map((r) => {
    const rankIndex = keys.indexOf(r)
    const selected = rankIndex <= position
    return {
      rank: r,
      selected,
    }
  })
})

defineEmits(['click'])
</script>

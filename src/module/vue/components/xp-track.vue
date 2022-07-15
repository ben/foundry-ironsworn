<template>
  <div class="flexrow xp nogrow">
    <div
      class="clickable block xp"
      v-for="(box, i) in computedBoxes"
      :key="box.key"
      :class="box.classes"
      @mouseover="hovered = i"
      @mouseleave="hovered = -1"
      @click="click(i)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
  max: number
  marked: number
}>()

const hovered = ref(-1)

interface Box {
  key: string
  classes: {
    hover: boolean
    selected: boolean
  }
}

const computedBoxes = computed(() => {
  const ret = [] as Box[]
  for (let i = 0; i < props.max; i++) {
    ret.push({
      key: `box${i}`,
      classes: {
        hover: hovered.value >= i,
        selected: props.marked >= i + 1,
      },
    })
  }
  return ret
})

const $emit = defineEmits<{ (e: 'click', value: number): void }>()
function click(i) {
  if (i === 0 && this.marked === 1) {
    i = -1
  }
  $emit('click', i + 1)
}
</script>

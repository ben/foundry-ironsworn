<template>
  <div class="boxgroup">
    <div class="flexrow boxrow">
      <boxrow-box
        v-for="(item, i) in items"
        :key="'box' + i"
        v-bind="item"
        @click="click"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import boxrowBox from './boxrow-box.vue'

const props = defineProps<{ min: number; max: number; current: number }>()

const items = computed(() => {
  const ret = [] as any[]
  for (let i = props.min; i <= props.max; i++) {
    ret.push({
      text: `${i > 0 ? '+' : ''}${i}`,
      value: i,
      selected: i === props.current,
    })
  }
  return ret
})

const $emit = defineEmits<{ (e: 'click', value: number): void }>()
function click(i) {
  $emit('click', i)
}
</script>

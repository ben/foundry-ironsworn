<template>
  <article
    class="xp-track continuous-background-color-parent flexrow nogrow"
    role="slider"
    :aria-valuemax="max"
    :aria-valuemin="0"
    :aria-valuenow="marked"
    :aria-valuetext="`${marked} of ${max} xp spent`"
  >
    <button
      v-for="boxValue in boxValues"
      :key="`box-${boxValue}`"
      class="xp-box continuous-background-color-segment clickable block"
      type="button"
      :data-xp-value="boxValue"
      :aria-selected="props.marked === boxValue"
      @click="setXp(boxValue)"
    />
  </article>
</template>
<style lang="less">
.xp-track {
  .xp-box {
    border-width: var(--ironsworn-border-width);
    aspect-ratio: 1;
    max-width: 20px;
  }
}
</style>
<script lang="ts" setup>
import _ from 'lodash'
import { computed, ref } from 'vue'

const props = defineProps<{
  max: number
  marked: number
}>()

interface Box {
  key: string
  selected: boolean
}

const boxValues = computed(() => _.range(1, props.max + 1))

const $emit = defineEmits<{ (e: 'click', value: number): void }>()

function setXp(value: number) {
  if (value === 1 && props.marked === 1) {
    value = 0
  }
  $emit('click', value)
}
</script>

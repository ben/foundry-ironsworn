<template>
  <boxrow
    :min="0"
    :max="item.data.track.max"
    :current="item.data.track.current"
    @click="click"
    class="asset-track"
  />
</template>

<style lang="less">
.asset-track {
  .box:not(:first-child) {
    margin-inline-start: calc(var(--ironsworn-border-width) * -1);
  }
}
</style>

<script setup lang="ts">
import { inject } from 'vue'
import { $ItemKey } from '../../provisions'
import Boxrow from '../boxrow/boxrow.vue'

const props = defineProps<{ item: any }>()

const $item = inject($ItemKey, undefined)

function click(value) {
  $item?.update({
    data: {
      track: {
        current: value,
      },
    },
  })
}
</script>

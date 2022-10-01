<template>
  <boxrow
    :min="0"
    :max="item.data.track.max"
    :current="item.data.track.current"
    @click="click"
  />
</template>

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

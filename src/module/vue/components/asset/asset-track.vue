<template>
  <boxrow
    :min="0"
    :max="item.data.track.max"
    :current="item.data.track.current"
    @click="click"
  />
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { IronswornActor } from '../../../actor/actor'
import Boxrow from '../boxrow/boxrow.vue'

const props = defineProps<{ item: any }>()
const $actor = inject('$actor') as IronswornActor
const $item = () => $actor.items.get(props.item._id)

function click(value) {
  console.log(value, props, $item())
  $item()?.update({
    data: {
      track: {
        current: value,
      },
    },
  })
}
</script>

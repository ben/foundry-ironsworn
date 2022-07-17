<template>
  <boxrow
    :min="0"
    :max="item.data.track.max"
    :current="item.data.track.current"
    @click="click"
  />
</template>

<script setup lang="ts">
import Boxrow from '../boxrow/boxrow.vue'

const props = defineProps<{ item: any; actor?: any }>()

const $item = () => {
  if (props.actor) {
    // This is yucky, there's got to be a better way
    const actor = game.actors?.get(props.actor._id ?? props.actor.id)
    const item = actor?.items.get(props.item._id)
    if (item) return item
  }
  return game.items?.get(props.item._id)
}

function click(value) {
  console.log($item())
  $item()?.update({
    data: {
      track: {
        current: value,
      },
    },
  })
}
</script>

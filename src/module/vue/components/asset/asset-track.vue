<template>
  <boxrow
    :min="0"
    :max="asset.data.track.max"
    :current="asset.data.track.current"
    @click="click"
  />
</template>

<script>
export default {
  props: {
    actor: Object,
    asset: Object,
  },

  methods: {
    click(_ev, value) {
      const actor = game.actors?.get(this.actor._id)
      const item = actor.items.get(this.asset._id)
      item?.update({
        data: {
          track: {
            current: value,
          },
        },
      })
    }
  }
}
</script>

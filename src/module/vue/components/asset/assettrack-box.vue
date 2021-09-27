<template>
  <div class="track-box clickable block" :class="selectedClass" @click="click">
    {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    actor: Object,
    asset: Object,
  },

  computed: {
    selectedClass() {
      return {
        selected: this.value === this.asset.data.track.current,
      }
    },
  },

  methods: {
    click() {
      const actor = game.actors?.get(this.actor._id)
      const item = actor?.items.get(this.asset._id)
      item?.update({
        data: {
          track: {
            current: this.value,
          },
        },
      })
    },
  },
}
</script>

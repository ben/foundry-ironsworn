<template>
  <boxrow
    :min="0"
    :max="item.data.track.max"
    :current="item.data.track.current"
    @click="click"
  />
</template>

<script>
export default {
  props: {
    actor: Object,
    item: Object,
  },

  methods: {
    click(_ev, value) {
      this.$item?.update({
        data: {
          track: {
            current: value,
          },
        },
      })
    },
  },
}
</script>

<template>
  <div
    @click="click"
    :class="classes"
    data-resource="xp"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    value: Number,
    current: Number,
  },

  computed: {
    classes() {
      return {
        clickable: true,
        block: true,
        xp: true,
        selected: this.selected,
      }
    },
    selected() {
      return this.value <= this.current
    },
  },
  methods: {
    click(event) {
      const actor = game.actors?.get(this.actor._id)
      actor?.update({ data: { xp: this.value } })
    },
  },
}
</script>

<template>
  <div
    @click="click"
    :class="$concat('clickable block xp ironsworn__stat__value ', active)"
    data-resource="xp"
    :data-value="thisValue"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    thisValue: Number,
    currentValue: Number,
  },

  computed: {
    active() {
      return this.thisValue <= this.currentValue ? 'selected' : ''
    },
  },
  methods: {
    click(event) {
      const actor = game.actors?.get(this.actor._id)
      actor?.update({data: {xp: this.thisValue}})
    }
  }
}
</script>

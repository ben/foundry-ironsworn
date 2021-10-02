<template>
  <component :is="element">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    element: String,
    actor: Object,
  },
  mounted() {
    const actor = game.actors?.get(this.actor._id)
    CONFIG.IRONSWORN.attachInlineRollListeners($(this.$el), { actor })
  },
}
</script>

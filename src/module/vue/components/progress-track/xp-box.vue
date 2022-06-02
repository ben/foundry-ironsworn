<template>
  <div @click="$emit('click')" :class="classes" data-resource="xp">
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
}
</script>

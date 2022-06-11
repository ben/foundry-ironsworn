<template>
  <button type="button" :aria-selected="selected" @click="$emit('click')" class="clickable block xp" data-attr="xp">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    actor: Object,
    value: Number,
    current: Number,
  },

  computed: {
    selected() {
      return this.value <= this.current
    },
  },
}
</script>

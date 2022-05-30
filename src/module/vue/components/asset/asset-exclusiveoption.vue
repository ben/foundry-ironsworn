<template>
  <!-- this should probably be a radio select, TBH, but a button is still better than a div -->
  <button
    class="clickable block stack-row asset-exclusive-option"
    type="button"
    :class="selectedClass"
    @click="$emit('click')"
  >
    {{ opt.name }}
  </button>
</template>

<script>
export default {
  props: {
    opt: Object,
  },

  computed: {
    selectedClass() {
      return {
        selected: this.opt.selected,
      }
    },
  },
}
</script>

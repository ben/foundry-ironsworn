<template>
  <div class="clickable block stack-row" :class="selectedClass" @click="$emit('click')">
    {{ opt.name }}
  </div>
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

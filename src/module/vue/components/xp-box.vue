<template>
  <div
    :class="$concat('clickable block xp ironsworn__stat__value ', active)"
    data-resource="xp"
    :data-value="thisValue"
  ></div>
</template>

<script>
export default {
  props: {
    thisValue: Number,
    currentValue: Number,
  },

  computed: {
    active() {
      return this.thisValue <= this.currentValue ? 'selected' : ''
    },
  },
}
</script>

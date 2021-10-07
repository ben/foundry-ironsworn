<template>
  <div class="box clickable block" :class="classes" @click="click">
    {{text}}
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    value: Number,
    selected: Boolean,
  },

  computed: {
    classes() {
      return {
        selected: this.selected,
      }
    },
  },

  methods: {
    click(el) {
      this.$emit('click', el, this.value)
    }
  }
}
</script>

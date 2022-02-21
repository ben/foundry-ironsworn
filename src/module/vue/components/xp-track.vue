<template>
  <div class="flexrow xp nogrow">
    <div
      class="clickable block xp"
      v-for="(box, i) in computedBoxes"
      :key="box.key"
      :class="box.classes"
      @mouseover="hovered = i"
      @mouseleave="hovered = -1"
      @click="click(i)"
    />
  </div>
</template>

<script>
export default {
  props: {
    max: Number,
    marked: Number,
  },

  data() {
    return {
      hovered: -1,
    }
  },

  computed: {
    computedBoxes() {
      const ret = []
      for (let i = 0; i < this.max; i++) {
        ret.push({
          key: `box${i}`,
          classes: {
            hover: this.hovered >= i,
            selected: this.marked >= i + 1,
          },
        })
      }
      return ret
    },
  },

  methods: {
    click(i) {
      if (i === 0 && this.marked === 1) {
        i = -1
      }
      this.$emit('click', i + 1)
    },
  },
}
</script>

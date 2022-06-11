<template>
  <div class="xp-track" tab-index="0">
    <button
      class="clickable block xp-box"
      type="button"
      v-for="(box, i) in computedBoxes"
      :key="box.key"
      :class="box.classes"
      :disabled="box.disabled"
      :aria-disabled="box.disabled"
      @mouseover="hovered = i"
      @mouseleave="hovered = -1"
      @click="click(i)"
    />
  </div>
</template>

<style lang="less">
.xp-track {
  display: flex;
  flex-grow: 0;
  flex-direction: row;
  // flex-basis: 140px;
  align-items: center;
  justify-content: space-around;
  max-height: 40px;
  gap: 3px;
  .xp-box {
    height: 15px;
    flex-basis: 15px;
    border: 1px solid;
    margin: 0;
    &:disabled {
      opacity: 0.15;
      pointer-events: none;
    }
  }
}
</style>

<script>
export default {
  props: {
    max: Number,
    marked: Number,
    overflow: { type: Boolean, default: false },
  },
  data() {
    return {
      hovered: -1,
    }
  },
  computed: {
    computedBoxes() {
      const boxesPerTrack = 10
      const xpPerBox = this.overflow ? 1 : 2
      const xpBoxes = boxesPerTrack * xpPerBox
      let boxes = []
      for (let i = 0; i < xpBoxes; i++) {
        if (i < this.max) {
          boxes.push({
            key: `box${i}`,
            classes: {
              hover: this.hovered >= i,
              selected: this.marked >= i + 1,
            },
            disabled: false,
          })
        } else {
          boxes.push({
            key: `box${i}`,
            classes: {
              hover: false,
              selected: false,
            },
            disabled: true,
          })
        }
      }
      // console.log('computedBoxes', boxes)
      return boxes
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

<template>
  <slider class="xp-track" tab-index="0" :segments="boxes" orientation="horizontal">
    <!-- <button
      class="clickable block xp-box"
      type="button"
      v-for="(box, i) in boxes"
      :key="box.key"
      :class="box.classes"
      :disabled="box.disabled"
      :aria-disabled="box.disabled"
      @click="click(i)"
    /> -->
  </slider>
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
    margin-top: -20px;
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
    boxes() {
      const boxesPerTrack = 10
      const xpPerBox = this.overflow ? 1 : 2
      const xpBoxes = boxesPerTrack * xpPerBox
      let boxes = []
      for (let i = 0; i < xpBoxes; i++) {
        boxes.push({
          value: i + 1,
          disabled: !(i < this.max),
          // TODO: aria label, which means adding another localizable string
        })
      }
      // console.log('boxes', boxes)
      return boxes
    },
  },
  methods: {
    async input(event) {
      console.log('xp box event', event)
      this.$emit('input', event)
    },
    // async input(event) {
    //   console.log('slider-segment event', event)
    //   this.$emit('input', event.srcElement._value)
    // },
    // click(i) {
    //   if (i === 0 && this.marked === 1) {
    //     i = -1
    //   }
    //   this.$emit('click', i + 1)
    // },
  },
}
</script>

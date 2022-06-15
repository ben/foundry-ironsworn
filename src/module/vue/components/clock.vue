<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" :height="size" :width="size" viewBox="-55 -55 110 110">
    <path
      v-for="(wedge, i) in computedWedges"
      :key="wedge.path"
      :d="wedge.path"
      fill="white"
      stroke="black"
      stroke-width="2"
      class="clickable svg"
      :class="wedgeClasses(i)"
      @mouseover="hovered = i"
      @mouseleave="hovered = -1"
      @click="click(i)"
    ></path>
  </svg>
</template>

<style lang="less" scoped>
svg {
  pointer-events: fill;
}
</style>

<script>
const R = 50

function pathString(wedgeIdx, numWedges) {
  const wedgeAngle = (2 * Math.PI) / numWedges
  const startAngle = wedgeIdx * wedgeAngle - Math.PI / 2
  const x1 = R * Math.cos(startAngle)
  const y1 = R * Math.sin(startAngle)
  const x2 = R * Math.cos(startAngle + wedgeAngle)
  const y2 = R * Math.sin(startAngle + wedgeAngle)

  return `M0,0 L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} z`
}
export default {
  props: {
    wedges: {
      type: Number,
      default: 6,
    },
    ticked: {
      type: Number,
      default: 2,
    },
    size: {
      type: String,
      default: '100',
    },
  },

  data() {
    return {
      hovered: -1,
    }
  },

  computed: {
    computedWedges() {
      const ret = []
      for (let i = 0; i < this.wedges; i++) {
        ret.push({
          ticked: this.ticked <= i + 1,
          path: pathString(i, this.wedges),
        })
      }
      return ret
    },
  },

  methods: {
    wedgeClasses(i) {
      return {
        hover: this.hovered >= i,
        selected: this.ticked > i,
      }
    },

    click(i) {
      // If 1 is marked and the click is on the first wedge, clear the clock
      if (i === 0 && this.ticked === 1) {
        i = -1
      }
      this.$emit('click', i + 1)
    },
  },
}
</script>

<template>
  <section class="progress-track flexrow track">
    <track-box v-for="(box, i) in boxes" :key="`box${i}`" :boxTicks="box"> </track-box>

    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    ticks: Number,
  },
  computed: {
    boxes() {
      const boxesPerTrack = 10
      const ticksPerBox = 4
      let remainingTicks = this.ticks.valueOf()
      let result = []
      for (let i = 0; i < boxesPerTrack; i++) {
        const ticksToPush = Math.min(ticksPerBox, remainingTicks.valueOf())
        remainingTicks -= ticksToPush
        result.push(ticksToPush)
      }
      return result
    },
  },
}
</script>

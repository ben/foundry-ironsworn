<template>
  <fieldset class="progress-track track">
    <progress-box v-for="(box, i) in boxes" :key="`box${i}`" :boxTicks="box"> </progress-box>

    <slot>
      <!-- intended for xp boxes, etc -->
    </slot>
  </fieldset>
</template>

<style lang="less">
.progress-track {
  display: flex;
  flex-flow: row nowrap;
  gap: 3px;
}
</style>

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

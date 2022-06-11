<template>
  <!-- <section class="flexcol progress-box"> -->
  <svg class="progress-box" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <line id="progress-tick" x1="5" y1="50" x2="95" y2="50" stroke-linecap="round" />
    </defs>
    <transition name="draw">
      <use href="#progress-tick" v-if="boxTicks > 0" transform="rotate(45 50 50)" class="progress-tick tick-1" />
    </transition>
    <transition name="draw">
      <use href="#progress-tick" v-if="boxTicks > 1" transform="rotate(135 50 50)" class="progress-tick tick-2" />
    </transition>
    <transition name="draw">
      <use href="#progress-tick" v-if="boxTicks > 2" class="progress-tick tick-3" />
    </transition>
    <transition name="draw">
      <use href="#progress-tick" v-if="boxTicks > 3" transform="rotate(90 50 50)" class="progress-tick tick-4" />
    </transition>
  </svg>
  <!-- </section> -->
</template>
<style lang="less">
@tick-length: 90; // should be equal to x2 - x1
@draw-time: 0.35s;
@keyframes draw {
  from {
    stroke-dasharray: @tick-length;
    stroke-dashoffset: @tick-length;
  }
  to {
    stroke-dasharray: @tick-length;
    stroke-dashoffset: 0;
  }
}
.progress-box {
  flex: 1 0 20px;
  max-height: 30px;
  border: 1px solid;
  stroke-width: 5%;
  text-align: center;
  padding: 0.125rem;
  border-radius: 0.25rem;
  &.stagger-ticks-2 {
    // for extreme tracks; drawing the two at a time means there's two possible animations: 0 ticks => 2 ticks (tick-1 followed by tick-2) and 2 ticks => 4 ticks (tick-3 and tick-4)
    // .tick-2,
    // .tick-4 {
    //   animation-delay: @draw-time;
    // }
  }
  &.stagger-ticks-4 {
    // works fine backwards, but not forwards. weird.
    // .tick-2 {
    //   animation-delay: @draw-time;
    // }
    // .tick-3 {
    //   animation-delay: (@draw-time*2);
    // }
    // .tick-4 {
    //   animation-delay: (@draw-time*3);
    // }
  }
  .draw-enter-active {
    animation: draw @draw-time;
  }
  .draw-leave-active {
    animation: draw @draw-time reverse;
  }
  &:not(:last-child) {
    margin-right: -1px;
  }
}
</style>
<script>
export default {
  computed: {},
  props: {
    boxTicks: Number,
    ticksPerUnit: { type: Number, default: 1 },
    animationDuration: { type: Number, default: 350 },
  },
  // methods: {
  //   drawDelay(tickNumber) {
  //     return ((tickNumber - 1) % this.ticksPerUnit) * this.animationDuration
  //   },
  // },
}
</script>

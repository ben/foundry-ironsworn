<template>
  <section class="flexcol track-box">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line v-if="boxTicks > 0" x1="23" y1="23" x2="77" y2="77" />
      <line v-if="boxTicks > 1" x1="77" y1="23" x2="23" y2="77" />
      <line v-if="boxTicks > 2" x1="15" y1="50" x2="85" y2="50" />
      <line v-if="boxTicks > 3" x1="50" y1="15" x2="50" y2="85" />
    </svg>
    <slot></slot>
  </section>
</template>
<style lang="less">
.track-box {
  flex: 1 0 20px;
  max-height: 30px;
  border: 1px solid;
  margin-right: -1px;
  stroke-width: 5;
  text-align: center;
  align-items: center;
  justify-items: center;
}
</style>
<script>
export default {
  computed: {},
  props: {
    boxTicks: Number,
  },
}
</script>

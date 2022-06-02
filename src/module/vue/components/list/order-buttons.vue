<template>
  <section class="item-order-controls">
    <icon-button icon="caret-up" :class="{ disabled: i == 0 }" @click="$emit('sortUp', i)"></icon-button>
    <icon-button icon="caret-down" :class="{ disabled: i == length - 1 }" @click="$emit('sortDown', i)"></icon-button>
  </section>
</template>

<style lang="less">
.item-order-controls {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 0;
}
</style>

<script>
export default {
  props: {
    i: Number,
    length: Number,
  },
}
</script>

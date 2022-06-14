<template>
  <section class="item-order-controls">
    <faicon-button
      icon="caret-up"
      :disabled="i == 0"
      :aria-disabled="i == 0"
      @click="$emit('sortUp', i)"
    ></faicon-button>
    <faicon-button
      icon="caret-down"
      :disabled="i == length - 1"
      :aria-disabled="i == length - 1"
      @click="$emit('sortDown', i)"
    ></faicon-button>
  </section>
</template>

<style lang="less">
.item-order-controls {
  @buttonWidth: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 0;
  justify-content: space-around;
  margin-left: -(@buttonWidth);
  button {
    width: @buttonWidth;
    flex-grow: 1;
  }
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

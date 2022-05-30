<template>
  <section class="flexcol nogrow item-order-controls">
    <i class="clickable block fas fa-caret-up nogrow" :class="{ disabled: i == 0 }" @click="$emit('sortUp', i)"></i>
    <i
      class="clickable block fas fa-caret-down nogrow"
      :class="{ disabled: i == length - 1 }"
      @click="$emit('sortDown', i)"
    ></i>
  </section>
</template>

<style lang="less">
.item-order-controls {
  padding-right: 3px;
  i {
    padding: 2px;
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

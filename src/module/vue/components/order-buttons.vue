<template>
  <div class="flexcol nogrow order-buttons">
    <!-- TODO: replace with better disabled attr? either aria-disabled or disabled attr -->
    <BtnFaicon
      icon="caret-up"
      class="block nogrow"
      :class="{ disabled: i == 0 }"
      @click="$emit('sortUp', i)"
    ></BtnFaicon>
    <BtnFaicon
      icon="caret-down"
      class="block nogrow"
      :class="{ disabled: i == length - 1 }"
      @click="$emit('sortDown', i)"
    ></BtnFaicon>
  </div>
</template>

<style lang="less" scoped>
.order-buttons {
  padding-right: 3px;

  .icon-button {
    padding: 2px;
  }
}
</style>

<script setup lang="ts">
import BtnFaicon from './buttons/btn-faicon.vue'
defineProps<{ i: number; length: number }>()
</script>

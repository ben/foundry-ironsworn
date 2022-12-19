<template>
  <div class="flexcol nogrow order-buttons">
    <!-- TODO: replace with better disabled attr? either aria-disabled or disabled attr -->
    <IronBtn
      icon="fa:caret-up"
      block
      nogrow
      :class="{ disabled: i == 0 }"
      @click="$emit('sortUp', i)"
    ></IronBtn>
    <IronBtn
      icon="fa:caret-down"
      block
      nogrow
      :class="{ disabled: i == length - 1 }"
      @click="$emit('sortDown', i)"
    ></IronBtn>
  </div>
</template>

<style lang="scss" scoped>
.order-buttons {
  padding-right: 3px;

  .icon-button {
    padding: 2px;
  }
}
</style>

<script setup lang="ts">
import IronBtn from './buttons/iron-btn.vue'
defineProps<{ i: number; length: number }>()
</script>

<template>
  <article class="ironsworn-sheet flexcol">
    <slot name="before-header"></slot>
    <slot name="header">
      <SheetHeaderBasic class="nogrow" :document="props.document" />
    </slot>
    <section class="ironsworn-sheet-body nogrow" :class="bodyClass">
      <slot name="default"></slot>
    </section>
  </article>
</template>

<style lang="less" scoped>
.ironsworn-sheet {
  gap: 10px;
}
</style>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
const props = withDefaults(
  defineProps<{
    document: any
    bodyClass: any
  }>(),
  { bodyClass: { flexcol: true } }
)
</script>

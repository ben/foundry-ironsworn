<template>
  <button
    :data-legacy="props.legacy"
    :data-xp-value="props.xpValue"
    type="button"
    class="xp-counter"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  xpValue: number
  /**
   * The legacy track type.
   */
  legacy: 'quests' | 'bonds' | 'discoveries'
}>()
console.log('xpCounter init', props.legacy, props.xpValue)
</script>
<style lang="less" scoped>
.xp-counter {
  box-sizing: border-box;
  aspect-ratio: 1;
  height: 1em;
  border: 1px solid;
  transition: var(--std-animation);
  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.1;
    pointer-events: none;
  }
}
</style>

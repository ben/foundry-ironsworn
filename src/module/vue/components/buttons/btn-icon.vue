<!-- generic button used to build other icon buttons that use an icon font or SVGs -->
<!-- the default value for a button element's type is "submit", which refreshes the page; "type=button" obviates the need for preventing the submit action with JS. -->
<template>
  <button
    class="icon-button clickable"
    type="button"
    :tooltip="tooltip"
    :aria-label="tooltip"
    :data-tooltip="tooltip"
    :disabled="disabled"
    :aria-disabled="disabled"
  >
    <span v-if="hasDefaultSlot" class="button-text">
      <slot name="default"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from '@vue/runtime-core'

defineProps<{ tooltip?: string; disabled?: boolean }>()
// so the span can be omitted if there's no slot content
const hasDefaultSlot = computed(() => {
  return !!useSlots().default?.()[0].children?.length
})
</script>

<style lang="less">
.icon-button {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  align-content: center;
  text-align: center;
  justify-content: center;
  padding: 0.2em;
  &:not(:empty) {
    gap: 0.2em;
  }
  &:empty {
    // restricts width + removes border if there's no text
    border: 0;
    flex-grow: 0;
    line-height: 1;
    height: max-content;
    width: max-content;
  }
  &:before {
    line-height: 1;
    height: 1em;
    width: 1em;
  }
}

// override to compensate for chrome user agent stylesheet bug: https://bugs.chromium.org/p/chromium/issues/detail?id=681917
.icon-button {
  .button-text {
    // makes this seamless with existing buttons that don't need this styling
    display: inline;
    strong {
      white-space: nowrap;
    }
  }
  &.vertical {
    writing-mode: initial !important; // prevents this fix from breaking the button layout in FF
    flex-direction: column;
    .button-text {
      line-height: inherit;
      display: inherit;
      writing-mode: vertical-lr !important;
    }
  }
}
</style>

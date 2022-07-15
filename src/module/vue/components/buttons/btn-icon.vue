<!-- generic button used to build other icon buttons (for FA, IS, and SVG icons) -->
<!-- the default value for a button element's type is "submit", which refreshes the page; "type=button" obviates the need for preventing the submit action with JS. -->
<template>
  <button
    class="icon-button clickable"
    type="button"
    @click="$emit('click')"
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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    tooltip: String,
    disabled: Boolean,
  },
  emits: ['click'],
  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default
    },
  },
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
  padding: 0.25em;
  &:not(:empty) {
    gap: 0.25em;
  }
  &:before {
    line-height: 1;
    height: 1em;
    width: 1em;
  }
  &:empty {
    // restricts width + removes border if there's no text
    border: 0;
    flex-grow: 0;
    line-height: 1;
    height: max-content;
    width: max-content;
    padding: 2px;
    gap: 0;
    // min-width: 1.25em;
  }
}

// override to compensate for chrome user agent stylesheet bug: https://bugs.chromium.org/p/chromium/issues/detail?id=681917
.icon-button {
  .button-text {
    // makes this seamless with existing buttons that don't need this styling
    display: contents;
  }
  &.vertical-v2 {
    writing-mode: unset; // prevents this fix from breaking the button layout in FF
    flex-direction: column;
    .button-text {
      line-height: inherit;
      display: inherit;
      writing-mode: vertical-lr !important;
    }
  }
}
</style>

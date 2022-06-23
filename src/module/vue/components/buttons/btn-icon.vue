<!-- generic button used to build other icon buttons (for FA, IS, and SVG icons) -->
<!-- the default value for a button element's type is "submit", which refreshes the page; "type=button" obviates the need for preventing the submit action with JS. -->
<template>
  <button
    class="icon-button clickable"
    :class="classes"
    type="button"
    @click="$emit('click')"
    :tooltip="tooltip"
    :aria-label="tooltip"
    :data-tooltip="tooltip"
    :disabled="disabled"
    :aria-disabled="disabled"
  >
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    tooltip: String,
    disabled: Boolean,
  },
}
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
  gap: 0.25em;
  &:empty {
    // restricts width + removes border if there's no text
    border: 0;
    flex-grow: 0;
    line-height: 1;
    // min-width: 1.25em;
  }
}
</style>

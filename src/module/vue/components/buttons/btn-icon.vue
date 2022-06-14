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
  >
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    tooltip: String,
  },
}
</script>

<style lang="less">
.icon-button {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  flex-grow: 0;
  align-content: center;
  text-align: center;
  justify-content: center;
  padding: 0.25em;
  gap: 0.25em;
  line-height: 1;
  &:empty {
    // restricts width + removes border if there's no text
    width: 1.5em;
    border: 0;
  }
}
</style>

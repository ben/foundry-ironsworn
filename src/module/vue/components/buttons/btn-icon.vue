<!-- generic button used to build other icon buttons that use an icon font or SVGs -->
<!-- the default value for a button element's type is "submit", which refreshes the page; "type=button" obviates the need for preventing the submit action with JS. -->
<template>
  <button
    :class="{ [$style[props.buttonStyle]]: true }"
    type="button"
    :title="!versionHasTooltips ? tooltip : ''"
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

const props = withDefaults(
  defineProps<{
    tooltip?: string
    disabled?: boolean
    buttonStyle?:
      | 'iconOnly'
      | 'iconHoverBlock'
      | 'blockBorder'
      | 'blockBorderless'
      | 'text'
    hoverBg?: boolean
  }>(),
  { buttonStyle: 'blockBorderless' }
)
// so the span can be omitted if there's no slot content
const hasDefaultSlot = computed(() => {
  return !!useSlots().default?.()[0].children?.length
})

/**
 * Tests whether the client's version includes a tooltip API.
 */
const versionHasTooltips = computed(
  () => !!(game as { tooltip?: unknown }).tooltip
)
</script>

<style lang="less" module>
@import '../../../../styles/clickable.less';
@import '../../../../styles/mixins.less';

.iconHoverBlock() {
  .iconButtonBaseMixin();
  .clickableBlockMixin(0px);
  background: none;
}
.iconOnly {
  .iconButtonBaseMixin();
  .clickableTextMixin();
  background: none !important;
  border: none;
  padding: 0;
}
.blockBorder {
  .iconButtonBaseMixin();
  .clickableBlockMixin(1px);
}
.blockBorderless {
  .iconButtonBaseMixin();
  .clickableBlockMixin(0px);
  border: none;
}
.text {
  .clickableTextMixin();
  text-align: left;
}
</style>

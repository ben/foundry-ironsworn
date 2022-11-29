<!-- generic button used to build other icon buttons that use an icon font or SVGs -->
<!-- the default value for a button element's type is "submit", which refreshes the page; "type=button" obviates the need for preventing the submit action with JS. -->
<template>
  <button
    :class="{ [$style[props.buttonStyle + 'Btn']]: true }"
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
    buttonStyle?: 'noBg' | 'block' | 'blockBorder'
    hoverBg?: boolean
  }>(),
  { buttonStyle: 'block' }
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
@import '../../../../styles/mixins.less';

.btnIconMixin {
  display: flex;
  flex-direction: row;
  padding: var(--ironsworn-spacer-sm);
  gap: var(--ironsworn-spacer-sm);
  align-items: center;
  justify-content: center;
  &:empty {
    // icon-only buttons
    // padding: 0;
    padding: 1px;
    aspect-ratio: 1;
    height: 1.5em;
    // box-shadow: none;
  }
  &:before {
    text-shadow: none !important;
  }
}

.noBgBtn {
  .clickableTextMixin();
  .btnIconMixin();
  background-color: transparent;
  &:not(:empty) {
    text-align: left;
    justify-content: left;
  }
}

.blockBtnMixin {
  justify-content: center;
  .btnIconMixin();
}
.blockBtn {
  .clickableBlockMixin(0px,5em);
  .blockBtnMixin();
}
.blockBorderBtn {
  .clickableBlockMixin(var(--ironsworn-border-width-md),5em);
  .blockBtnMixin();
}
</style>

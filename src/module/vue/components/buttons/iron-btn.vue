<template>
  <button
    class="iron-btn"
    :class="{
      [$style['iron-btn']]: true,
      [$style['vertical-button']]: vertical,
      [$style['icon-only']]: !hasText,
      [$style['clickable-block']]: block,
      [$style['clickable-text']]: !block,
      [$style[`flex-${justify}`]]: true,
      nogrow,
    }"
    type="button"
    :data-tooltip="tooltip"
    :disabled="disabled"
    :aria-disabled="disabled"
    ref="$el"
  >
    <!-- @slot The button icon. Provide an ID string for an icon with default settings, or use this slot if you need to do something specific.  -->
    <slot name="icon">
      <IronIcon
        v-if="iconOptions?.set === 'ironsworn'"
        :name="iconOptions.name"
      />
      <FontIcon
        v-if="iconOptions?.set === 'fa'"
        :name="(iconOptions.name as FontAwesome.Name)"
      />
    </slot>
    <!-- @slot Primary button text, wrapped to scope its styling and to enable direction workaround required for vertical button text. -->
    <slot name="text">
      <span
        v-if="text"
        class="button-text"
        :class="{ [$style.verticalText]: vertical, [$style.buttonText]: true }"
        >{{ text }}</span
      >
    </slot>
  </button>
</template>
<style lang="scss" module>
@import (reference) '../../../../styles/utils';
@import (reference) '../../../../styles/mixins';

.flex-start {
  align-items: center;
  align-content: center;
  justify-items: start;
  justify-content: start;
}

.flex-center {
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
}

.flex-end {
  align-items: center;
  align-content: center;
  justify-items: end;
  justify-content: end;
}

.iron-btn {
  display: flex;
  flex-wrap: nowrap;
  border-radius: 0;
  border-width: 0;
  color: inherit;
  margin: 0;
  height: v-bind(height);
  width: v-bind(width);
  gap: var(--ironsworn-spacer-sm);
  padding: var(--ironsworn-spacer-xs);

  & > svg {
    // prevents double hover effect on svg hover
    pointer-events: none;
  }

  &.vertical-button {
    writing-mode: initial !important; // prevents this fix from breaking the button layout in FF
    flex-direction: column;
    line-height: 1.25;

    .vertical-text.button-text {
      @include vertical-text;

      width: max-content;
      line-height: inherit;
      display: inherit;
      writing-mode: vertical-lr !important;
    }
  }
}

.button-text {
  display: inline;
  border-width: 0;

  strong {
    white-space: nowrap;
  }
}

.icon-only {
  aspect-ratio: 1;
  flex-direction: row;
  box-sizing: content-box;
  padding: 2px;
  height: 1em;
  width: 1em;
  justify-content: center;
  align-content: center;
  line-height: 1;
}

.clickable-text {
  @include clickable-text;

  line-height: var(--ironsworn-line-height);
}

.clickable-block {
  @include clickable-block;

  &:hover:not(:focus) {
    box-shadow: none;
  }
}
</style>

<script setup lang="ts">
import { capitalize } from 'lodash'
import { computed, onMounted, ref, useCssModule, useSlots } from 'vue'
import FontIcon from '../icon/font-icon.vue'
import { FontAwesome, IconId } from '../icon/icon-common'
import IronIcon from '../icon/iron-icon.vue'

/**
 * Generic button that applies styles and behaviour common to this system.
 */
const props = withDefaults(
  defineProps<{
    /**
     *  The button text/label, which appears as the default content for the "text" slot.
     */
    text?: string
    /**
     * A simple way to specify an icon with default settings. For something weirder, you can override it with the "icon" slot.
     */
    icon?: IconId | null
    tooltip?: string
    hoverBg?: boolean
    disabled?: boolean
    /**
     * Should the button grow in flex containers?
     */
    nogrow?: boolean
    /**
     * Should the button be styled with a block background?
     */
    block?: boolean
    /**
     * Should the button be styled as vertical?
     */
    vertical?: boolean
    height?: string
    width?: string
    /**
     * How to justify the button content. If it's a block or icon-only button, this is 'center'. Otherwise, it's 'start'.
     */
    justify?: 'start' | 'center' | 'end'
  }>(),
  { disabled: false, vertical: false, width: 'auto', height: 'auto' }
)

const justify = computed(() => {
  if (props.justify) {
    return props.justify
  }
  switch (true) {
    case !hasText.value:
    case props.block:
      return 'center'
    default:
      return 'start'
  }
})

const $style = useCssModule()

let $el = ref<HTMLElement>()

const hasText = computed(() => {
  if (props.text || useSlots().text?.()[0]) return true
  return false
})

const iconOptions = computed(() => {
  if (!props.icon) {
    return null
  }
  const [set, name] = props.icon.split(/:/)
  return {
    set,
    name,
  }
})

defineExpose({
  element: $el,
})
</script>

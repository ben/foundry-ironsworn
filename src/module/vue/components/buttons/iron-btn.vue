<template>
  <button
    class="iron-btn"
    :class="{
      [$style.ironBtn]: true,
      [$style.verticalButton]: vertical,
      [$style.iconOnly]: !hasText,
      [$style.clickableBlock]: block,
      [$style.clickableText]: !block,
      [$style[`flex${capitalize(justify)}`]]: true,
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
<style lang="less" module>
@import (reference) '../../../../styles/utils.less';
@import (reference) '../../../../styles/mixins.less';

.flexStart {
  align-content: center;
  align-items: center;
  justify-content: start;
  justify-items: start;
}
.flexCenter {
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
}
.flexEnd {
  align-content: center;
  align-items: center;
  justify-content: end;
  justify-items: end;
}

.ironBtn {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--ironsworn-spacer-sm);
  margin: 0;
  border-width: 0;
  border-radius: 0;
  padding: var(--ironsworn-spacer-xs);
  width: v-bind(width);
  height: v-bind(height);
  color: inherit;
  & > svg {
    // prevents double hover effect on svg hover
    pointer-events: none;
  }

  &.verticalButton {
    writing-mode: initial !important; // prevents this fix from breaking the button layout in FF
    flex-direction: column;
    line-height: 1.25;
    .verticalText.buttonText {
      .vertical-text();
      display: inherit;
      width: max-content;
      line-height: inherit;
      writing-mode: vertical-lr !important;
    }
  }
}

.buttonText {
  display: inline;
  border-width: 0px;
  strong {
    white-space: nowrap;
  }
}

.iconOnly {
  box-sizing: content-box;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  padding: 2px;
  width: 1em;
  height: 1em;
  line-height: 1;
  aspect-ratio: 1;
}
.clickableText {
  .clickableTextMixin();
  line-height: var(--ironsworn-line-height);
}
.clickableBlock {
  .clickableBlockMixin();
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

const classes = computed(() => {
  return {
    [$style.ironBtn]: true,
    [$style.verticalButton]: props.vertical,
    [$style.iconOnly]: !hasText,
    [$style.clickableBlock]: props.block,
    [$style.clickableText]: !props.block,
    [$style[`flex${capitalize(justify.value)}`]]: true,
    nogrow: props.nogrow,
  }
})
// so the span can be omitted if there's no slot content

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

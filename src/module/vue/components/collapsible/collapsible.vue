<template>
  <component
    :id="wrapperId"
    :is="wrapperIs"
    :class="[$style.wrapper, state.highlighted ? 'highlighted' : '']"
    :aria-expanded="state.expanded"
    :tabindex="-1"
    :aria-orientation="orientation"
    ref="$wrapper"
  >
    <component
      :is="toggleSectionIs"
      :class="[toggleSectionClass, $style.toggleSection]"
    >
      <slot name="before-toggle"></slot>
      <component
        :class="[toggleWrapperClass, $style.toggleWrapper]"
        :is="toggleWrapperIs"
      >
        <component
          :is="noIcon ? 'button' : BtnFaicon"
          :buttonStyle="toggleButtonStyle"
          :id="controlId"
          type="button"
          :aria-controls="contentId"
          :icon="noIcon ? undefined : 'chevron-right'"
          @click="toggle"
          :class="[
            $style.toggle,
            toggleButtonClass,
            $style.toggleButtonTransition,
          ]"
          :noClickable="props.noClickable ?? undefined"
          :data-tooltip="toggleTooltip"
          data-tooltip-direction="LEFT"
          ref="$toggle"
        >
          {{ toggleLabel }}
        </component>
      </component>
      <slot name="after-toggle"></slot>
    </component>
    <CollapseTransition :dimension="dimension">
      <component
        v-if="state.expanded"
        :is="contentWrapperIs"
        role="region"
        :aria-labelledby="controlId"
        :id="contentId"
        :class="[contentWrapperClass, $style.contentWrapper]"
        ref="$contentWrapper"
      >
        <slot name="default"></slot>
      </component>
    </CollapseTransition>
  </component>
</template>

<style lang="less" module>
// TODO: horizontal and vertical versions
.wrapper {
}

.contentWrapper {
}

.toggleButtonTransition:before {
  transition: transform 0.4s;
  font-size: 0.75em;
  aspect-ratio: 1;
  align-items: center;
  display: flex;
  justify-content: center;
  height: 1em;
  width: 1em;

  .wrapper[aria-expanded='true'] & {
    transform: rotate(90deg);
  }
}

.toggleWrapper {
  display: contents !important;
}

.toggleSection {
  display: flex;
}

.toggle {
  margin: 0;
  height: inherit;
  flex-grow: 1;
  text-transform: uppercase;
  justify-content: left;
  font-size: inherit;
}
</style>

<script setup lang="ts">
import { nextTick, reactive } from 'vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import { computed, ref } from '@vue/reactivity'

const props = withDefaults(
  defineProps<{
    /**
     * The text displayed on the button element that controls the expand/collapse toggle.
     */
    toggleLabel: string
    /**
     * The ID to be assigned to the wrapper element, from which the IDs of other elements within this component are generated. Required in order to generate the correct ARIA annotations.
     */
    baseId: string
    /**
     * @defaultValue `'vertical'`
     */
    orientation?: 'horizontal' | 'vertical'
    noIcon?: boolean

    toggleTooltip?: string
    disabled?: boolean
    /**
     * @defaultValue `'article'`
     */
    wrapperIs?: string
    /**
     * @defaultValue `'header'`
     */
    toggleSectionIs?: string
    toggleSectionClass?: any
    /**
     * @defaultValue `'h3'`
     */
    toggleWrapperIs?: string
    toggleButtonStyle?: 'noBg' | 'block' | 'blockBorder'
    toggleWrapperClass?: any
    toggleButtonClass?: any
    toggleTextClass?: any
    /**
     * @defaultValue `'section'`
     */
    contentWrapperIs?: string
    contentWrapperClass?: any
    // FIXME NYI
    forceExpand?: boolean
    noClickable?: boolean
  }>(),
  {
    orientation: 'vertical',
    wrapperIs: 'article',
    contentWrapperIs: 'section',
    toggleWrapperIs: 'h3',
    toggleSectionIs: 'header',
    disabled: false,
    contentWrapperClass: '',
    toggleWrapperClass: '',
    headingClass: '',
    toggleTextClass: '',
    noClickable: false,
  }
)

const $wrapper = ref<HTMLElement>()
const $toggle = ref<HTMLElement>()
const $contentWrapper = ref<HTMLElement>()
const state = reactive<{
  forceExpand: boolean
  expanded: boolean
  highlighted: boolean
}>({
  forceExpand: props.forceExpand ?? false,
  expanded: false,
  highlighted: false,
})

const wrapperId = computed(() => props.baseId)
const controlId = computed(() => `${props.baseId}_control`)
const contentId = computed(() => `${props.baseId}_content`)

const dimension = computed(() =>
  props.orientation === 'horizontal' ? 'width' : 'height'
)

function toggle() {
  state.expanded = !state.expanded
}

function expand() {
  state.expanded = true
}
function collapse() {
  state.expanded = false
}

function highlight() {
  state.highlighted = true
}

function unhighlight() {
  state.highlighted = false
}

/**
 * Scroll to the collapsible, apply the highlight class, and expand it.
 * @param ms The duration of the highlight effect, in milliseconds
 */
async function scrollToAndExpand(ms: number = 2000) {
  expand()
  highlight()

  await nextTick()

  $wrapper.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
  $wrapper.value?.focus()

  await nextTick()

  setTimeout(unhighlight, ms)
}

defineExpose({
  scrollToAndExpand,
  unhighlight,
  highlight,
  toggle,
  collapse,
  expand,
})
</script>

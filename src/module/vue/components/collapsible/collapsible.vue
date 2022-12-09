<template>
  <component
    :id="wrapperId"
    :is="wrapperIs"
    :class="[$style.wrapper, state.highlighted ? 'highlighted' : '']"
    :aria-expanded="state.expanded"
    :tabindex="-1"
    :aria-orientation="orientation"
    :aria-disabled="disabled"
    ref="$wrapper"
  >
    <component
      :is="toggleSectionIs"
      :class="[toggleSectionClass, $style.toggleSection]"
    >
      <slot name="before-toggle"></slot>
      <component
        :class="[toggleWrapperClass, $style.toggleWrapper, 'toggle-wrapper']"
        :is="toggleWrapperIs"
      >
        <component
          :is="noIcon ? 'button' : BtnFaicon"
          :id="controlId"
          type="button"
          :aria-controls="contentId"
          :icon="noIcon ? undefined : 'chevron-right'"
          @click="toggle"
          :disabled="disabled"
          :class="[
            $style.toggle,
            toggleButtonClass,
            $style.toggleButtonTransition,
          ]"
          :data-tooltip="toggleTooltip"
          data-tooltip-direction="LEFT"
          ref="$toggle"
        >
          {{ toggleLabel }}
        </component>
      </component>
      <slot name="after-toggle"></slot>
    </component>
    <CollapseTransition
      :v-bind="{
        ...props.collapseTransition,
        orientation: dimension,
        duration: state.duration,
      }"
    >
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
  font-size: 75%;
  display: flex;
  .wrapper[aria-expanded='true'] & {
    transform: rotate(90deg);
  }
}

.toggleWrapper {
  padding: 0;
  margin: 0;
  flex-grow: 1;
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
import { ExtractPropTypes, nextTick, reactive } from 'vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import { computed, ref } from '@vue/reactivity'

const props = withDefaults(
  defineProps<{
    duration?: ExtractPropTypes<typeof CollapseTransition>['duration']
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
    toggleWrapperClass?: any
    toggleButtonClass?: any
    toggleTextClass?: any
    /**
     * @defaultValue `'section'`
     */
    contentWrapperIs?: string
    contentWrapperClass?: any
    /**
     * @default false
     */
    expanded?: boolean
    /**
     * @inheritdoc
     */
    collapseTransition?: Omit<
      ExtractPropTypes<typeof CollapseTransition>,
      'dimension' | 'duration'
    >
  }>(),
  {
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
    expanded: false,
    duration: 300,
  }
)

const $wrapper = ref<HTMLElement>()
const $toggle = ref<HTMLElement>()
const $contentWrapper = ref<HTMLElement>()
const state = reactive<{
  expanded: boolean
  highlighted: boolean
  duration: number
}>({
  expanded: props.expanded,
  highlighted: false,
  duration: props.duration,
})

const wrapperId = computed(() => props.baseId)
const controlId = computed(() => `${props.baseId}_control`)
const contentId = computed(() => `${props.baseId}_content`)

const dimension = computed(() =>
  props.orientation === 'horizontal' ? 'width' : 'height'
)

function setExpandState(
  expanded: typeof state.expanded,
  /**
   * The desired duration for the collapse transition, if it's different than what the component's state maintains.
   */
  overrideDuration?: typeof state.duration
) {
  let oldDuration
  if (overrideDuration) {
    console.log('overrideDurationn', overrideDuration)
    oldDuration = state.duration.valueOf()
    state.duration = overrideDuration
  }
  state.expanded = expanded

  if (overrideDuration && oldDuration) {
    console.log('setting timeout', overrideDuration, overrideDuration)
    setTimeout(() => {
      state.duration = oldDuration
    }, overrideDuration)
  }
}

function toggle(overrideDuration?: number) {
  setExpandState(!state.expanded, overrideDuration)
}

function expand(overrideDuration?: number) {
  setExpandState(true, overrideDuration)
}

function collapse(overrideDuration?: number) {
  setExpandState(false, overrideDuration)
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
  expand(0)
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
  /**
   * Whether the collapsible is expanded.
   */
  expanded: state.expanded,
  /**
   * The current duration of the animation, in ms.
   */
  duration: state.duration,
})
</script>

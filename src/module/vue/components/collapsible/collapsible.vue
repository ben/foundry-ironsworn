<template>
  <component
    :id="wrapperId"
    :is="wrapperIs"
    :class="`${$style.collapsible} ${state.highlighted ? 'highlighted' : ''}`"
    :aria-expanded="state.expanded"
    :tabindex="0"
    ref="$wrapper"
  >
    <header :class="headerClass">
      <slot name="before-toggle"></slot>
      <component :class="headingClass" :is="`h${headingLevel}`">
        <BtnFaicon
          :id="controlId"
          :aria-controls="contentId"
          :icon="state.expanded ? toggleIconExpanded : toggleIconCollapsed"
          @click="toggle"
          class="text"
          :class="{ [$style.toggle]: true, [toggleClass]: true }"
          :data-tooltip="toggleTooltip"
        >
          <slot name="toggle-content"></slot>
        </BtnFaicon>
      </component>
      <slot name="after-toggle"></slot>
    </header>
    <CollapseTransition>
      <component
        v-if="state.expanded"
        :is="contentWrapperIs"
        role="region"
        :aria-labelledby="controlId"
        :id="contentId"
        class="collapsible-content"
        :class="contentWrapperClass"
      >
        <slot></slot>
      </component>
    </CollapseTransition>
  </component>
</template>

<style lang="less" module>
// TODO: horizontal and vertical versions
.collapsible {
}

.heading {
  margin: 0;
  display: flex;
  font-weight: bold;
}

.toggle {
  flex-grow: 1;
  text-transform: uppercase;
  justify-content: left;
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
     * The ID to be assigned to the wrapper element, from which the IDs of other elements within this component are generated. Required in order to generate the correct ARIA annotations.
     */
    baseId: string
    toggleIconCollapsed?: string
    toggleIconExpanded?: string
    contentWrapperIs?: string
    contentWrapperClass?: any
    toggleClass?: any
    wrapperIs?: string
    disabled?: boolean
    headerClass?: any
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
    headingClass?: any
    toggleTooltip?: string
    forceExpand?: boolean
  }>(),
  {
    toggleIconCollapsed: 'caret-right',
    toggleIconExpanded: 'caret-down',
    wrapperIs: 'article',
    contentWrapperIs: 'section',
    disabled: false,
    headingLevel: 3,
  }
)

const $wrapper = ref<HTMLElement>()
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

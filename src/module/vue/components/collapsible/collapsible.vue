<template>
  <Component
    :id="wrapperId"
    :is="wrapperIs"
    class="collapsible"
    role=""
    :aria-expanded="state.expanded"
    :tabindex="0"
  >
    <header>
      <slot name="heading-start"></slot>
      <Component :is="`h${headingLevel}`">
        <BtnFaicon
          class="collapsible-toggle"
          :id="controlId"
          :aria-controls="contentId"
          :icon="state.expanded ? toggleIconExpanded : toggleIconCollapsed"
          @click="toggle"
        >
          <slot name="button-content"></slot>
        </BtnFaicon>
      </Component>
      <slot name="heading-end"></slot>
    </header>
    <CollapseTransition>
      <Component
        v-if="state.expanded"
        :is="contentWrapperIs"
        role="region"
        :aria-labelledby="controlId"
        :id="contentId"
        class="collapsible-content"
        :class="contentWrapperClass"
      >
        <slot name="default"></slot>
      </Component>
    </CollapseTransition>
  </Component>
</template>

<style lang="less">
.collapsible {
}
</style>

<script setup lang="ts">
import { Component, reactive } from 'vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import BtnFaicon from '../buttons/btn-faicon.vue'
import { computed } from '@vue/reactivity'

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
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
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

const state = reactive<{ expanded: boolean }>({ expanded: false })

const wrapperId = computed(() => props.baseId)
const controlId = computed(() => `${props.baseId}_control`)
const contentId = computed(() => `${props.baseId}_content`)

function toggle() {
  state.expanded = !state.expanded
}
</script>

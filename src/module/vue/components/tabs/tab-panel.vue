<template>
  <Transition :name="transitionName">
    <component
      :is="is"
      ref="$el"
      role="tabpanel"
      :aria-labelledby="getTabId(tabState.tabSetId, tabKey)"
      :id="getTabPanelId(tabState.tabSetId, tabKey)"
      tabindex="-1"
      v-show="isActive"
      :data-tab-set="tabState.tabSetId"
      :data-tab-key="tabKey"
      :class="$style.wrapper"
    >
      <slot></slot>
    </component>
  </Transition>
</template>

<style lang="scss" scoped>
[class*='-leave-active'] {
  // prevents outgoing panels from fighting incoming panels for space
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>

<style lang="scss" module>
.wrapper {
  --ironsworn-transition-duration: var(--ironsworn-tab-transition-duration);

  // improves performance of transform transitions
  backface-visibility: hidden;
  background-color: var(--ironsworn-color-bg);
}
</style>

<script lang="ts" setup>
import { computed, inject, Ref, ref, watch } from 'vue'
import {
  getSlideTransitionName,
  getTabId,
  getTabPanelId,
  SetActivePanelRef,
  SetActivePanelRefKey,
  TabKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The container for the content associated with a {@link Tab}. Should be descended from a {@link TabPanels} component.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The key must match that of a {@link Tab} with the same parent {@link TabSet} element.
     */
    tabKey: TabKey
    /**
     * @defaultValue 'div'
     */
    is?: any
  }>(),
  { is: 'div' }
)

const tabState = inject(TabStateKey) as TabState

const $el = ref<HTMLElement>() as Ref<HTMLElement>
const isActive = computed(() => tabState.activeTab === props.tabKey)
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef

watch(isActive, () => isActive.value && setActivePanelRef($el.value))

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({ tabSetId: tabSetId.value })

/**
 * Extracts the `--ironsworn-tab-transition` CSS variable to set the tab panel transition. If the variable is set to 'slide', it computes an appropriate direction for the slide.
 */
const transitionName = computed(() => {
  const varHaver =
    document.querySelector<HTMLElement>('.system-foundry-ironsworn') ??
    document.documentElement
  const themeTransition = getComputedStyle(varHaver)
    .getPropertyValue('--ironsworn-tab-transition')
    .trim()
  if (themeTransition === 'slide') {
    const thisIndex = tabState.tabKeys.indexOf(props.tabKey)
    const oldIndex = tabState.tabKeys.indexOf(tabState.previousTab)
    const newIndex = tabState.tabKeys.indexOf(tabState.activeTab)
    const slideTransitionName = getSlideTransitionName(
      thisIndex,
      oldIndex,
      newIndex,
      tabState.orientation
    )
    return slideTransitionName
  }
  return themeTransition
})
</script>

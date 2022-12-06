<template>
  <Transition :name="transitionName">
    <component
      :is="is"
      ref="$el"
      role="tabpanel"
      :aria-labelledby="getTabId(tabState.tabSetId, tabKey)"
      :id="getTabPanelId(tabState.tabSetId, tabKey)"
      tabindex="-1"
      v-if="isActive"
      :data-tab-set="tabState.tabSetId"
      :data-tab-key="tabKey"
      :class="$style.tabPanel"
    >
      <slot></slot>
    </component>
  </Transition>
</template>

<style lang="less" scoped>
@animationDuration: var(--ironsworn-transition-duration, 0.5s);
@import 'node_modules/vue2-animate/src/less/make-transitions.less';
@import 'node_modules/vue2-animate/src/less/animations/sliding/all.less';

each(Left Right Up Down; {
  .slide@{value}-enter-active, .slide@{value}-leave-active {
    // prevents the incoming and outgoing elements from fighting for space
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
});
</style>

<style lang="less" module>
.tabPanel {
  background-color: var(--ironsworn-color-bg);
  backface-visibility: hidden;
}
</style>

<script lang="ts" setup>
import { computed, inject, Ref, ref, watch } from 'vue'
import {
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

const transitionName = computed(() => {
  const thisIndex = tabState.tabKeys.indexOf(props.tabKey)
  const oldIndex = tabState.tabKeys.indexOf(tabState.previousTab)
  const newIndex = tabState.tabKeys.indexOf(tabState.activeTab)
  // for a horizontal tab set: lower = positioned to the left, higher = positioned to the right
  const horizontal = tabState.orientation === 'horizontal'
  // for a vertical tab set: lower = positioned above, higher = positioned below
  const vertical = tabState.orientation === 'vertical'

  switch (true) {
    case horizontal && oldIndex < newIndex && thisIndex === oldIndex:
    case horizontal && oldIndex > newIndex && thisIndex === newIndex:
      console.log('slideLeft')
      return 'slideLeft'
    case horizontal && oldIndex < newIndex && thisIndex === newIndex:
    case horizontal && oldIndex > newIndex && thisIndex === oldIndex:
      console.log('slideLeft')
      return 'slideRight'
    case vertical && oldIndex < newIndex && thisIndex === oldIndex:
    case vertical && oldIndex > newIndex && thisIndex === newIndex:
      return 'slideUp'
    case vertical && oldIndex < newIndex && thisIndex === newIndex:
    case vertical && oldIndex > newIndex && thisIndex === oldIndex:
      return 'slideDown'
    default:
      return ''
  }
})
</script>

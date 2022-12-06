<template>
  <component
    :is="is"
    ref="$el"
    role="tab"
    type="button"
    :data-tab-set="tabState.tabSetId"
    :data-tab-key="tabKey"
    :class="$style.tab"
    :aria-disabled="disabled"
    :aria-selected="isActive"
    :aria-controls="getTabPanelId(tabState.tabSetId, tabKey)"
    :id="getTabId(tabState.tabSetId, tabKey)"
    :tabindex="isActive ? undefined : -1"
    @click="setActiveTab(tabKey)"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<style lang="less" module>
@import (reference) '../../../../styles/mixins.less';
.tab {
  .clickableBlockMixin();
  border-radius: 0;
  margin: 0;
  border: 0;
  flex: 1 1 0;
  overflow-x: visible;
  padding: var(--ironsworn-spacer-md);
  gap: var(--ironsworn-spacer-md);
  justify-content: v-bind(
    'tabState.orientation === "horizontal" ? "center" : "left"'
  );
  text-align: v-bind(
    'tabState.orientation === "horizontal" ? "center" : "left"'
  );
  &:before {
    font-size: 140%;
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import {
  FocusActivePanel,
  FocusActivePanelKey,
  getTabId,
  getTabPanelId,
  SetActiveTab,
  SetActiveTabKey,
  TabKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The index tab of a {@link TabPanel}, which serves as its title/label. Should be descended from a {@link TabList}.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The tab's key must match the key of a {@link TabPanel}.
     */
    tabKey: TabKey
    disabled?: boolean
    /**
     * The component to use. Use {@link BtnFaicon} or {@link BtnIsicon} if you want an icon.
     * @defaultValue `'button'`
     * @remarks The component automatically applies the `type="button"` attribute to prevent any weirdness with `<button>` form submission.
     */
    is?: any
  }>(),
  { disabled: false, is: 'button' }
)

const tabState = inject(TabStateKey) as TabState<typeof props.tabKey>

const setActiveTab = inject(SetActiveTabKey) as SetActiveTab<
  typeof props.tabKey
>
const focusActivePanel = inject(FocusActivePanelKey) as FocusActivePanel

const $el = ref<HTMLButtonElement>()

const isActive = computed(() => tabState.activeTab === props.tabKey)

const isFocused = computed(() => tabState.focusedTab === props.tabKey)
watch(isFocused, () => $el.value?.focus())

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({
  tabSetId: tabSetId.value,
})

function handleKeydown(event: KeyboardEvent) {
  const vertical = tabState.orientation === 'vertical'
  const horizontal = tabState.orientation === 'horizontal'
  const currentTabIndex = tabState.tabKeys.indexOf(props.tabKey)
  const lastTabIndex = tabState.tabKeys.length - 1
  switch (true) {
    case horizontal && event.key === 'ArrowRight':
    case vertical && event.key === 'ArrowDown':
      event.preventDefault()
      const nextTabIndex = Math.min(currentTabIndex + 1, lastTabIndex)
      const nextTabKey = tabState.tabKeys[nextTabIndex]
      setActiveTab(nextTabKey)
      break
    case horizontal && event.key === 'ArrowLeft':
    case vertical && event.key === 'ArrowUp':
      event.preventDefault()
      const previousTabIndex = Math.max(currentTabIndex - 1, 0)
      const previousTabKey = tabState.tabKeys[previousTabIndex]
      setActiveTab(previousTabKey)
      break
    // If in horizontal mode, focus the active panel on ArrowDown, for screenreaders
    case horizontal && event.key === 'ArrowDown':
      event.preventDefault()
      focusActivePanel()
      break
    case event.key === 'Home':
      event.preventDefault()
      setActiveTab(tabState.tabKeys[0])
      break
    case event.key === 'End':
      event.preventDefault()
      setActiveTab(tabState.tabKeys[lastTabIndex])
      break
    default:
      break
  }
}
</script>

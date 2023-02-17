<template>
  <div
    :data-tab-set="tabState.tabSetId"
    :class="{
      flexcol: orientation === 'horizontal',
      flexrow: orientation === 'vertical',
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { forEach } from 'lodash'
import { inject, onMounted, provide, reactive } from 'vue'
import { $LocalEmitterKey } from '../../provisions'
import {
  FocusActivePanelKey,
  getTabId,
  Orientation,
  SetActivePanelRefKey,
  SetActiveTabKey,
  TabActivationMode,
  TabKey,
  TabState,
  TabStateKey,
} from './tab-helpers.js'

/**
 * The wrapper for tabbed displays, which controls tab focus and selection. Put a {@link TabList} (filled with {@link Tab}s) and a {@link TabPanels} (filled with {@link TabPanel}s) in it.
 */
const props = withDefaults(
  defineProps<{
    id: string
    tabKeys: TabKey[]
    /**
     * @default `$props.tabKeys[0]`
     */
    defaultKey?: TabKey
    /**
     * @default `'horizontal'`
     */
    orientation?: Orientation
    /**
     * @default `'auto'`
     */
    tabActivationMode?: TabActivationMode
  }>(),
  {
    orientation: 'horizontal',
    tabActivationMode: 'auto',
  }
)

const tabState = reactive<TabState>({
  activeTab: props.defaultKey ?? props.tabKeys[0],
  activePanelRef: null,
  focusedTab: null,
  orientation: props.orientation,
  mode: props.tabActivationMode,
  tabKeys: props.tabKeys,
  tabSetId: props.id,
  previousTab: props.defaultKey ?? props.tabKeys[0],
})

function setActivePanelRef(ref: HTMLElement) {
  tabState.activePanelRef = ref
}
function focusActivePanel() {
  if (tabState.activePanelRef) {
    tabState.activePanelRef.focus()
  }
}

function setActiveTab(tabKey: TabKey) {
  if (tabState.activeTab !== tabKey) {
    tabState.previousTab = tabState.activeTab
    tabState.activeTab = tabKey
    tabState.focusedTab = tabKey
  }
}

const $localEmitter = inject($LocalEmitterKey)
$localEmitter?.on('activateTab', setActiveTab)

provide(TabStateKey, tabState)
provide(SetActiveTabKey, setActiveTab)
provide(SetActivePanelRefKey, setActivePanelRef)
provide(FocusActivePanelKey, focusActivePanel)

defineExpose({
  setActiveTab,
})

/**
 * Validates descendant tabs by comparing them to provided tabKeys.
 */
onMounted(() => {
  const elements = {
    Tab: new Set(
      props.tabKeys.map(
        (key) =>
          document.getElementById(getTabId(props.id, key))?.dataset?.tabKey
      )
    ),
  }
  const componentKeys = new Set(tabState.tabKeys.map((key) => key))
  forEach(elements, (role, label) => {
    switch (true) {
      case role.equals(componentKeys):
        // Tabs OK!
        break
      default:
        throw Error(
          `TabSet prop tabKeys doesn't match the tabKey props of its descendent ${label}s.`
        )
    }
  })
})
</script>

<template>
  <div
    :data-tab-set="tabState.tabSetId"
    :class="{
      flexcol: orientation === 'horizontal',
      flexrow: orientation === 'vertical',
    }"
    ref="$el"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { forEach } from 'lodash'
import { onMounted, provide, reactive, ref } from 'vue'
import {
  FocusActivePanelKey,
  getTabId,
  getTabPanelId,
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
})

function setActivePanelRef(ref: HTMLElement) {
  tabState.activePanelRef = ref
}
function focusActivePanel() {
  if (tabState.activePanelRef) {
    tabState.activePanelRef.focus()
  }
}
type ItemIn<T extends any[]> = T extends (infer U)[] ? U : never

function setActiveTab<T extends ItemIn<typeof props.tabKeys>>(tabKey: T) {
  if (tabState.activeTab !== tabKey) {
    tabState.activeTab = tabKey
  }
}

provide(TabStateKey, tabState)
provide(SetActiveTabKey, setActiveTab)
provide(SetActivePanelRefKey, setActivePanelRef)
provide(FocusActivePanelKey, focusActivePanel)

defineExpose({
  setActiveTab,
})

const $el = ref<HTMLElement>()

/**
 * Validates child elements by comparing them to provided tabKeys.
 */
onMounted(() => {
  const elements = {
    TabPanel: new Set(
      props.tabKeys.map(
        (key) =>
          document.getElementById(getTabPanelId(props.id, key))?.dataset?.tabKey
      )
    ),
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
      case role.size === 0:
        throw Error(`No ${label} IDs found.`)
      case role.has(undefined):
        throw Error(`At least one ${label} has an undefined tabKey.`)
      case componentKeys.isSubset(role as Set<string>):
        throw Error(`${label}s are missing one or more tabKeys.`)
      default:
        throw Error(
          `TabSet prop tabKeys doesn't match the tabKey props of its descendent ${label}s.`
        )
    }
  })
})
</script>

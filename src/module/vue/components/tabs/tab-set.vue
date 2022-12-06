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
import { onMounted, provide, reactive, ref } from 'vue'
import {
  FocusActivePanelKey,
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
     * @default ```$props.tabKeys[0]```
     */
    defaultKey?: TabKey
    /**
     * @default ```'horizontal'```
     */
    orientation?: Orientation
    /**
     * @default ```'auto'```
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

type Role = 'tabpanel' | 'tab'

function queryRoles(tabSet: HTMLElement, ...roles: Role[]) {
  const selector = roles
    .map((role) => `[data-tab-set="${tabState.tabSetId}"][role=${role}]`)
    .join(', ')
  return tabSet.querySelectorAll(selector)
}

onMounted(() => {
  const element = $el.value as HTMLElement
  const roles: Set<Role> = new Set(['tabpanel', 'tab'])
  const tabElements = queryRoles(element, ...roles)
  if (!tabElements ?? tabElements?.length === 0) {
    throw Error(
      `TabList for ${tabState.tabSetId} contains no valid tab set members.`
    )
  }
  const componentKeys = new Set(tabState.tabKeys.map((key) => key.toString()))
  const elementKeys = new Map(
    Array.from(roles).map((role) => [role, new Set<string>()])
  )

  tabElements.forEach((el) => {
    const tabElement = el as HTMLElement
    const tabElementKey = tabElement.dataset.tabKey
    const tabElementRole = tabElement.getAttribute('role') as Role
    if (!tabElementKey) {
      throw Error(
        `${tabElement.id} is missing tabKey attribute. Check its component props.`
      )
    }
    elementKeys.get(tabElementRole)?.add(tabElementKey)
  })

  elementKeys.forEach((role, roleName) => {
    if (role.intersection(componentKeys).size !== role.size) {
      throw Error(
        `${roleName} HTML element tabKeys don't match with TabSet tabKeys.`
      )
    }
  })
  // console.log('tabs validated', elementKeys)
})
</script>

<template>
  <component
    :is="is"
    ref="$el"
    role="tabpanel"
    :aria-labelledby="`tabs--${tabState.tabSetId}--tab--${tabKey}`"
    :id="`tabs--${tabState.tabSetId}--panel--${tabKey}`"
    tabindex="-1"
    :hidden="!isActive"
    v-show="isActive"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, Ref, ref, watch } from 'vue'
import {
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

const tabState = inject(TabStateKey) as TabState<typeof props.tabKey>

onMounted(() => {
  if (!Object.values(tabState.tabKeys).includes(props.tabKey)) {
    throw new Error(
      `TabPanel's tabKey prop is ${JSON.stringify(
        props.tabKey
      )}, but TabSet doesn't include it in its tabKeys prop: ${JSON.stringify(
        tabState.tabKeys
      )}`
    )
  }
})

const $el = ref<HTMLElement>() as Ref<HTMLElement>
const isActive = computed(() => tabState.activeTab === props.tabKey)
const setActivePanelRef = inject(SetActivePanelRefKey) as SetActivePanelRef

watch(isActive, () => isActive.value && setActivePanelRef($el.value))

const tabSetId = computed(() => tabState.tabSetId)
defineExpose({ tabSetId: tabSetId.value })
</script>
